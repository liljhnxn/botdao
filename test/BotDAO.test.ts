import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("BotDAO — Smart Contract Tests", function () {
  let botDAO: any;
  let owner: HardhatEthersSigner;
  let proposer: HardhatEthersSigner;
  let voter1: HardhatEthersSigner;
  let voter2: HardhatEthersSigner;
  let voter3: HardhatEthersSigner;
  let recipient: HardhatEthersSigner;

  const QUORUM = 2; // 2 votes required
  const ONE_DAY = 24 * 60 * 60;

  beforeEach(async function () {
    [owner, proposer, voter1, voter2, voter3, recipient] = await ethers.getSigners();

    const BotDAOFactory = await ethers.getContractFactory("BotDAO");
    botDAO = await BotDAOFactory.deploy(QUORUM);
    await botDAO.waitForDeployment();
  });

  describe("1. Treasury Management", function () {
    it("Should accept deposits via depositTreasury() and emit event", async function () {
      const depositAmount = ethers.parseEther("10.0");
      await expect(botDAO.connect(voter1).depositTreasury({ value: depositAmount }))
        .to.emit(botDAO, "TreasuryDeposit")
        .withArgs(voter1.address, depositAmount);

      expect(await botDAO.getTreasuryBalance()).to.equal(depositAmount);
    });

    it("Should accept deposits via direct transfer (receive())", async function () {
      const depositAmount = ethers.parseEther("5.0");
      await voter2.sendTransaction({
        to: await botDAO.getAddress(),
        value: depositAmount,
      });

      expect(await botDAO.getTreasuryBalance()).to.equal(depositAmount);
    });

    it("Should reject zero-value deposits", async function () {
      await expect(
        botDAO.connect(voter1).depositTreasury({ value: 0 })
      ).to.be.revertedWith("Deposit amount must be greater than zero");
    });
  });

  describe("2. Proposal Creation", function () {
    it("Should create a proposal with valid parameters and emit ProposalCreated event", async function () {
      const amount = ethers.parseEther("2.5");
      const duration = 3 * ONE_DAY;
      const description = "Fund developer tooling for Botchain ecosystem";

      const tx = await botDAO.connect(proposer).createProposal(
        recipient.address,
        amount,
        description,
        duration
      );

      const blockTimestamp = (await ethers.provider.getBlock("latest"))!.timestamp;

      await expect(tx)
        .to.emit(botDAO, "ProposalCreated")
        .withArgs(
          1,
          proposer.address,
          recipient.address,
          amount,
          description,
          blockTimestamp,
          blockTimestamp + duration
        );

      expect(await botDAO.getProposalCount()).to.equal(1);

      const proposal = await botDAO.getProposal(1);
      expect(proposal.id).to.equal(1);
      expect(proposal.proposer).to.equal(proposer.address);
      expect(proposal.recipient).to.equal(recipient.address);
      expect(proposal.amount).to.equal(amount);
      expect(proposal.description).to.equal(description);
      expect(proposal.forVotes).to.equal(0);
      expect(proposal.againstVotes).to.equal(0);
      expect(proposal.executed).to.equal(false);
      expect(proposal.canceled).to.equal(false);
    });

    it("Should reject proposal with zero recipient address", async function () {
      await expect(
        botDAO.createProposal(
          ethers.ZeroAddress,
          ethers.parseEther("1"),
          "Invalid recipient",
          ONE_DAY
        )
      ).to.be.revertedWith("Recipient cannot be zero address");
    });

    it("Should reject proposal with zero amount", async function () {
      await expect(
        botDAO.createProposal(
          recipient.address,
          0,
          "Zero amount",
          ONE_DAY
        )
      ).to.be.revertedWith("Amount must be greater than zero");
    });

    it("Should reject proposal with empty description", async function () {
      await expect(
        botDAO.createProposal(
          recipient.address,
          ethers.parseEther("1"),
          "",
          ONE_DAY
        )
      ).to.be.revertedWith("Description cannot be empty");
    });

    it("Should reject proposal with zero voting duration", async function () {
      await expect(
        botDAO.createProposal(
          recipient.address,
          ethers.parseEther("1"),
          "No duration",
          0
        )
      ).to.be.revertedWith("Voting duration must be greater than zero");
    });
  });

  describe("3. Voting System", function () {
    beforeEach(async function () {
      await botDAO.connect(proposer).createProposal(
        recipient.address,
        ethers.parseEther("5"),
        "Community Hackathon Prize Pool",
        2 * ONE_DAY
      );
    });

    it("Should allow casting FOR vote and emit VoteCast event", async function () {
      await expect(botDAO.connect(voter1).vote(1, true))
        .to.emit(botDAO, "VoteCast")
        .withArgs(1, voter1.address, true);

      const proposal = await botDAO.getProposal(1);
      expect(proposal.forVotes).to.equal(1);
      expect(proposal.againstVotes).to.equal(0);
      expect(await botDAO.hasUserVoted(1, voter1.address)).to.equal(true);
    });

    it("Should allow casting AGAINST vote", async function () {
      await botDAO.connect(voter2).vote(1, false);

      const proposal = await botDAO.getProposal(1);
      expect(proposal.forVotes).to.equal(0);
      expect(proposal.againstVotes).to.equal(1);
    });

    it("Should prevent double voting from the same address", async function () {
      await botDAO.connect(voter1).vote(1, true);
      await expect(botDAO.connect(voter1).vote(1, true)).to.be.revertedWith(
        "Already voted on this proposal"
      );
      await expect(botDAO.connect(voter1).vote(1, false)).to.be.revertedWith(
        "Already voted on this proposal"
      );
    });

    it("Should prevent voting after voting period has ended", async function () {
      await time.increase(2 * ONE_DAY + 10);

      await expect(botDAO.connect(voter1).vote(1, true)).to.be.revertedWith(
        "Voting period has ended"
      );
    });

    it("Should reject voting on non-existent proposal", async function () {
      await expect(botDAO.connect(voter1).vote(99, true)).to.be.revertedWith(
        "Proposal does not exist"
      );
    });
  });

  describe("4. Quorum & Passing Rules", function () {
    beforeEach(async function () {
      await botDAO.connect(proposer).createProposal(
        recipient.address,
        ethers.parseEther("3"),
        "Infrastructure Node Support",
        ONE_DAY
      );
    });

    it("Should not pass before voting duration ends", async function () {
      await botDAO.connect(voter1).vote(1, true);
      await botDAO.connect(voter2).vote(1, true);

      // Quorum met and FOR > AGAINST, but voting still active
      expect(await botDAO.proposalPassed(1)).to.equal(false);
    });

    it("Should pass when duration ended, quorum met, and FOR > AGAINST", async function () {
      await botDAO.connect(voter1).vote(1, true);
      await botDAO.connect(voter2).vote(1, true);

      await time.increase(ONE_DAY + 1);

      expect(await botDAO.proposalPassed(1)).to.equal(true);
    });

    it("Should fail if quorum is not reached", async function () {
      // Only 1 vote cast (quorum is 2)
      await botDAO.connect(voter1).vote(1, true);

      await time.increase(ONE_DAY + 1);

      expect(await botDAO.proposalPassed(1)).to.equal(false);
    });

    it("Should fail if AGAINST votes >= FOR votes", async function () {
      // 1 FOR, 1 AGAINST (Tie = Fails)
      await botDAO.connect(voter1).vote(1, true);
      await botDAO.connect(voter2).vote(1, false);

      await time.increase(ONE_DAY + 1);

      expect(await botDAO.proposalPassed(1)).to.equal(false);
    });

    it("Should fail if AGAINST votes > FOR votes", async function () {
      await botDAO.connect(voter1).vote(1, false);
      await botDAO.connect(voter2).vote(1, false);

      await time.increase(ONE_DAY + 1);

      expect(await botDAO.proposalPassed(1)).to.equal(false);
    });
  });

  describe("5. Proposal Execution & Treasury Fund Transfer", function () {
    const proposalAmount = ethers.parseEther("4.0");

    beforeEach(async function () {
      // Fund treasury with 10 BOT
      await botDAO.connect(owner).depositTreasury({ value: ethers.parseEther("10.0") });

      await botDAO.connect(proposer).createProposal(
        recipient.address,
        proposalAmount,
        "DAO Marketing Outreach Campaign",
        ONE_DAY
      );
    });

    it("Should execute passed proposal, transfer BOT, and emit ProposalExecuted event", async function () {
      await botDAO.connect(voter1).vote(1, true);
      await botDAO.connect(voter2).vote(1, true);

      await time.increase(ONE_DAY + 1);

      const recipientBalBefore = await ethers.provider.getBalance(recipient.address);
      const treasuryBalBefore = await botDAO.getTreasuryBalance();

      // Any wallet (e.g. voter3) can execute
      const tx = await botDAO.connect(voter3).executeProposal(1);

      await expect(tx)
        .to.emit(botDAO, "ProposalExecuted")
        .withArgs(1, voter3.address, recipient.address, proposalAmount);

      const recipientBalAfter = await ethers.provider.getBalance(recipient.address);
      const treasuryBalAfter = await botDAO.getTreasuryBalance();

      expect(recipientBalAfter - recipientBalBefore).to.equal(proposalAmount);
      expect(treasuryBalBefore - treasuryBalAfter).to.equal(proposalAmount);

      const proposal = await botDAO.getProposal(1);
      expect(proposal.executed).to.equal(true);
      expect(await botDAO.proposalPassed(1)).to.equal(false); // Can no longer pass once executed
    });

    it("Should prevent execution before voting ends", async function () {
      await botDAO.connect(voter1).vote(1, true);
      await botDAO.connect(voter2).vote(1, true);

      await expect(botDAO.executeProposal(1)).to.be.revertedWith(
        "Voting period has not ended"
      );
    });

    it("Should prevent execution if proposal did not pass", async function () {
      await botDAO.connect(voter1).vote(1, false);
      await botDAO.connect(voter2).vote(1, false);

      await time.increase(ONE_DAY + 1);

      await expect(botDAO.executeProposal(1)).to.be.revertedWith(
        "Proposal did not pass"
      );
    });

    it("Should prevent double execution", async function () {
      await botDAO.connect(voter1).vote(1, true);
      await botDAO.connect(voter2).vote(1, true);

      await time.increase(ONE_DAY + 1);
      await botDAO.executeProposal(1);

      await expect(botDAO.executeProposal(1)).to.be.revertedWith(
        "Proposal is already executed"
      );
    });

    it("Should revert if treasury has insufficient balance for execution", async function () {
      // Create expensive proposal requesting 20 BOT (treasury only has 10 BOT)
      await botDAO.connect(proposer).createProposal(
        recipient.address,
        ethers.parseEther("20.0"),
        "Massive Fund Request",
        ONE_DAY
      );

      await botDAO.connect(voter1).vote(2, true);
      await botDAO.connect(voter2).vote(2, true);

      await time.increase(ONE_DAY + 1);

      await expect(botDAO.executeProposal(2)).to.be.revertedWith(
        "Insufficient treasury balance"
      );
    });
  });

  describe("6. Proposal Cancellation", function () {
    beforeEach(async function () {
      await botDAO.connect(proposer).createProposal(
        recipient.address,
        ethers.parseEther("1"),
        "Proposal to cancel",
        ONE_DAY
      );
    });

    it("Should allow proposer to cancel proposal and emit ProposalCanceled event", async function () {
      await expect(botDAO.connect(proposer).cancelProposal(1))
        .to.emit(botDAO, "ProposalCanceled")
        .withArgs(1, proposer.address);

      const proposal = await botDAO.getProposal(1);
      expect(proposal.canceled).to.equal(true);
    });

    it("Should prevent non-proposer from canceling", async function () {
      await expect(botDAO.connect(voter1).cancelProposal(1)).to.be.revertedWith(
        "Only the proposer can cancel"
      );
    });

    it("Should prevent voting on canceled proposal", async function () {
      await botDAO.connect(proposer).cancelProposal(1);
      await expect(botDAO.connect(voter1).vote(1, true)).to.be.revertedWith(
        "Proposal is canceled"
      );
    });

    it("Should prevent executing canceled proposal even if votes were cast earlier", async function () {
      await botDAO.connect(voter1).vote(1, true);
      await botDAO.connect(voter2).vote(1, true);

      await botDAO.connect(proposer).cancelProposal(1);

      await time.increase(ONE_DAY + 1);

      await expect(botDAO.executeProposal(1)).to.be.revertedWith(
        "Proposal is canceled"
      );
    });

    it("Should prevent canceling already canceled proposal", async function () {
      await botDAO.connect(proposer).cancelProposal(1);
      await expect(botDAO.connect(proposer).cancelProposal(1)).to.be.revertedWith(
        "Proposal is already canceled"
      );
    });
  });

  describe("7. Multi-Proposal Reads & Helper Functions", function () {
    it("Should return all proposals using getAllProposals()", async function () {
      await botDAO.createProposal(recipient.address, ethers.parseEther("1"), "Prop 1", ONE_DAY);
      await botDAO.createProposal(recipient.address, ethers.parseEther("2"), "Prop 2", ONE_DAY);
      await botDAO.createProposal(recipient.address, ethers.parseEther("3"), "Prop 3", ONE_DAY);

      const all = await botDAO.getAllProposals();
      expect(all.length).to.equal(3);
      expect(all[0].description).to.equal("Prop 1");
      expect(all[1].description).to.equal("Prop 2");
      expect(all[2].description).to.equal("Prop 3");
    });
  });
});
