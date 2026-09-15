import hre from "hardhat";
const { ethers } = hre;

async function main() {
  console.log("-----------------------------------------");
  console.log("Deploying BotDAO to Botchain Testnet...");
  console.log("-----------------------------------------");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying from address:", deployer.address);
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "BOT");

  // Initial quorum: 2 votes for testnet flexibility
  const initialQuorum = 2;
  console.log(`Setting initial quorum votes to: ${initialQuorum}`);

  const BotDAO = await ethers.getContractFactory("BotDAO");
  const botDAO = await BotDAO.deploy(initialQuorum);
  await botDAO.waitForDeployment();

  const deployedAddress = await botDAO.getAddress();
  console.log("\n=========================================");
  console.log("🎉 BotDAO deployed successfully!");
  console.log("Contract Address:", deployedAddress);
  console.log("Quorum:", initialQuorum);
  console.log("=========================================\n");

  console.log("Next steps:");
  console.log(`1. Add to .env.local: NEXT_PUBLIC_BOTDAO_CONTRACT_ADDRESS=${deployedAddress}`);
  console.log("2. Run 'npm run dev' to start the dApp.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
