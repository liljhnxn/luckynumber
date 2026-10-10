import hre from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  if (!deployer) {
    console.error("❌ No deployer account found. Please check your PRIVATE_KEY in .env.");
    process.exit(1);
  }

  const network = hre.network.name;
  console.log(`========================================`);
  console.log(`Deploying LuckyNumber Contract`);
  console.log(`Network:  ${network}`);
  console.log(`Deployer: ${deployer.address}`);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`Balance:  ${hre.ethers.formatEther(balance)} BOT`);

  if (balance === 0n) {
    console.warn("⚠️ Warning: Deployer account has 0 BOT balance. Deployment might fail if network requires gas fees.");
  }

  console.log("Submitting deployment transaction...");
  const LuckyNumberFactory = await hre.ethers.getContractFactory("LuckyNumber");
  const luckyNumber = await LuckyNumberFactory.deploy();

  await luckyNumber.waitForDeployment();
  const contractAddress = await luckyNumber.getAddress();
  const txHash = luckyNumber.deploymentTransaction()?.hash;

  console.log(`🎉 LuckyNumber deployed successfully!`);
  console.log(`Contract Address: ${contractAddress}`);
  if (txHash) {
    console.log(`Transaction Hash: ${txHash}`);
    console.log(`Explorer Link:    https://scan.bohr.life/tx/${txHash}`);
  }

  // Update frontend config file
  const configDir = path.resolve(__dirname, "../src/config");
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  const deploymentData = {
    contractAddress,
    network,
    chainId: 968,
    deployedAt: new Date().toISOString(),
    txHash: txHash || null,
  };

  const configPath = path.join(configDir, "deployedContract.json");
  fs.writeFileSync(configPath, JSON.stringify(deploymentData, null, 2));
  console.log(`💾 Saved deployed address to: ${configPath}`);
  console.log(`========================================`);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exit(1);
});
