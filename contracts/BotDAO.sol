// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title BotDAO
 * @notice Mini Decentralized Autonomous Organization on Botchain for community treasury governance.
 * @dev Governs native BOT treasury funds with proposal creation, 1-wallet-1-vote voting, quorum, and safe execution.
 */
contract BotDAO is ReentrancyGuard {
    struct Proposal {
        uint256 id;
        address proposer;
        address recipient;
        uint256 amount;
        string description;
        uint256 startTime;
        uint256 endTime;
        uint256 forVotes;
        uint256 againstVotes;
        bool executed;
        bool canceled;
    }

    /// @notice Quorum votes required for a proposal to pass
    uint256 public quorumVotes;

    /// @notice Total proposals counter
    uint256 public proposalCount;

    /// @notice Mapping from proposal ID to Proposal struct
    mapping(uint256 => Proposal) public proposals;

    /// @notice Mapping to track if a wallet has voted on a proposal: proposalId => voter => voted
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    // Events
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        address indexed recipient,
        uint256 amount,
        string description,
        uint256 startTime,
        uint256 endTime
    );

    event TreasuryDeposit(
        address indexed depositor,
        uint256 amount
    );

    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        bool support
    );

    event ProposalExecuted(
        uint256 indexed proposalId,
        address indexed executor,
        address indexed recipient,
        uint256 amount
    );

    event ProposalCanceled(
        uint256 indexed proposalId,
        address indexed proposer
    );

    /**
     * @notice Initialize BotDAO with required quorum votes
     * @param _initialQuorum Minimum total votes needed for proposal validity
     */
    constructor(uint256 _initialQuorum) {
        quorumVotes = _initialQuorum;
    }

    /**
     * @notice Deposit native BOT tokens into the DAO treasury
     */
    function depositTreasury() external payable {
        require(msg.value > 0, "Deposit amount must be greater than zero");
        emit TreasuryDeposit(msg.sender, msg.value);
    }

    /**
     * @notice Allow contract to receive native BOT directly
     */
    receive() external payable {
        if (msg.value > 0) {
            emit TreasuryDeposit(msg.sender, msg.value);
        }
    }

    /**
     * @notice Create a funding proposal requesting native BOT from treasury
     * @param recipient Target address to receive treasury funds if passed
     * @param amount Amount of BOT requested (in wei)
     * @param description Purpose/title/details of the proposal
     * @param votingDuration Duration of voting in seconds
     * @return proposalId The ID of the newly created proposal
     */
    function createProposal(
        address recipient,
        uint256 amount,
        string calldata description,
        uint256 votingDuration
    ) external returns (uint256) {
        require(recipient != address(0), "Recipient cannot be zero address");
        require(amount > 0, "Amount must be greater than zero");
        require(bytes(description).length > 0, "Description cannot be empty");
        require(votingDuration > 0, "Voting duration must be greater than zero");

        proposalCount++;
        uint256 proposalId = proposalCount;
        uint256 startTime = block.timestamp;
        uint256 endTime = block.timestamp + votingDuration;

        proposals[proposalId] = Proposal({
            id: proposalId,
            proposer: msg.sender,
            recipient: recipient,
            amount: amount,
            description: description,
            startTime: startTime,
            endTime: endTime,
            forVotes: 0,
            againstVotes: 0,
            executed: false,
            canceled: false
        });

        emit ProposalCreated(
            proposalId,
            msg.sender,
            recipient,
            amount,
            description,
            startTime,
            endTime
        );

        return proposalId;
    }

    /**
     * @notice Cast a vote on a proposal (One wallet = one vote)
     * @param proposalId ID of the proposal
     * @param support True for FOR, False for AGAINST
     */
    function vote(uint256 proposalId, bool support) external {
        require(proposalId > 0 && proposalId <= proposalCount, "Proposal does not exist");
        Proposal storage proposal = proposals[proposalId];

        require(!proposal.canceled, "Proposal is canceled");
        require(!proposal.executed, "Proposal is already executed");
        require(block.timestamp >= proposal.startTime, "Voting has not started");
        require(block.timestamp <= proposal.endTime, "Voting period has ended");
        require(!hasVoted[proposalId][msg.sender], "Already voted on this proposal");

        hasVoted[proposalId][msg.sender] = true;

        if (support) {
            proposal.forVotes++;
        } else {
            proposal.againstVotes++;
        }

        emit VoteCast(proposalId, msg.sender, support);
    }

    /**
     * @notice Check if a proposal meets all criteria to pass
     * @param proposalId ID of the proposal
     * @return True if proposal passed, false otherwise
     */
    function proposalPassed(uint256 proposalId) public view returns (bool) {
        if (proposalId == 0 || proposalId > proposalCount) {
            return false;
        }

        Proposal storage proposal = proposals[proposalId];

        // Must be past voting end time
        if (block.timestamp <= proposal.endTime) {
            return false;
        }

        // Cannot be canceled or already executed
        if (proposal.canceled || proposal.executed) {
            return false;
        }

        // Total votes must meet or exceed quorum
        uint256 totalVotes = proposal.forVotes + proposal.againstVotes;
        if (totalVotes < quorumVotes) {
            return false;
        }

        // Majority rule: FOR > AGAINST
        if (proposal.forVotes <= proposal.againstVotes) {
            return false;
        }

        return true;
    }

    /**
     * @notice Execute a passed proposal and transfer native BOT from treasury
     * @dev Follows Checks-Effects-Interactions pattern with ReentrancyGuard
     * @param proposalId ID of the proposal to execute
     */
    function executeProposal(uint256 proposalId) external nonReentrant {
        require(proposalId > 0 && proposalId <= proposalCount, "Proposal does not exist");
        Proposal storage proposal = proposals[proposalId];

        require(block.timestamp > proposal.endTime, "Voting period has not ended");
        require(!proposal.canceled, "Proposal is canceled");
        require(!proposal.executed, "Proposal is already executed");
        require(proposalPassed(proposalId), "Proposal did not pass");
        require(address(this).balance >= proposal.amount, "Insufficient treasury balance");
        require(proposal.recipient != address(0), "Invalid recipient address");

        // Effects
        proposal.executed = true;

        // Interaction
        (bool success, ) = proposal.recipient.call{value: proposal.amount}("");
        require(success, "BOT treasury transfer failed");

        emit ProposalExecuted(
            proposalId,
            msg.sender,
            proposal.recipient,
            proposal.amount
        );
    }

    /**
     * @notice Cancel a proposal before it is executed
     * @param proposalId ID of the proposal
     */
    function cancelProposal(uint256 proposalId) external {
        require(proposalId > 0 && proposalId <= proposalCount, "Proposal does not exist");
        Proposal storage proposal = proposals[proposalId];

        require(msg.sender == proposal.proposer, "Only the proposer can cancel");
        require(!proposal.executed, "Proposal is already executed");
        require(!proposal.canceled, "Proposal is already canceled");

        proposal.canceled = true;

        emit ProposalCanceled(proposalId, msg.sender);
    }

    /**
     * @notice Get single proposal by ID
     * @param proposalId ID of the proposal
     */
    function getProposal(uint256 proposalId) external view returns (Proposal memory) {
        require(proposalId > 0 && proposalId <= proposalCount, "Proposal does not exist");
        return proposals[proposalId];
    }

    /**
     * @notice Get total number of proposals
     */
    function getProposalCount() external view returns (uint256) {
        return proposalCount;
    }

    /**
     * @notice Get current native BOT treasury balance
     */
    function getTreasuryBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @notice Fetch all proposals in a single call for efficient UI rendering
     */
    function getAllProposals() external view returns (Proposal[] memory) {
        Proposal[] memory allProposals = new Proposal[](proposalCount);
        for (uint256 i = 1; i <= proposalCount; i++) {
            allProposals[i - 1] = proposals[i];
        }
        return allProposals;
    }

    /**
     * @notice Helper to check if a specific user has voted on a proposal
     */
    function hasUserVoted(uint256 proposalId, address user) external view returns (bool) {
        return hasVoted[proposalId][user];
    }
}
