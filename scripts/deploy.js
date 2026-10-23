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

  const providerNetwork = await hre.ethers.provider.getNetwork();
  const chainId = Number(providerNetwork.chainId);
  const explorerUrl = "https://scan.botchain.ai";

  console.log("Submitting deployment transaction...");
  const LuckyNumberFactory = await hre.ethers.getContractFactory("LuckyNumber");
  
  // Deploy with current standard gas price without overpaying
  const feeData = await hre.ethers.provider.getFeeData();
  const gasPrice = feeData.gasPrice || 20000000000n;
  console.log(`Gas Price: ${hre.ethers.formatUnits(gasPrice, "gwei")} gwei`);

  const luckyNumber = await LuckyNumberFactory.deploy({
    gasPrice: gasPrice,
  });

  await luckyNumber.waitForDeployment();
  const contractAddress = await luckyNumber.getAddress();
  const deployTx = luckyNumber.deploymentTransaction();
  const txHash = deployTx?.hash;

  if (deployTx) {
    const receipt = await deployTx.wait();
    if (receipt) {
      const gasUsed = receipt.gasUsed;
      const totalCost = gasUsed * (receipt.gasPrice || gasPrice);
      console.log(`Gas Used: ${gasUsed.toString()} units`);
      console.log(`Actual Gas Fee: ${hre.ethers.formatEther(totalCost)} BOT`);
    }
  }

  console.log(`🎉 LuckyNumber deployed successfully!`);
  console.log(`Contract Address: ${contractAddress}`);
  if (txHash) {
    console.log(`Transaction Hash: ${txHash}`);
    console.log(`Explorer Link:    ${explorerUrl}/tx/${txHash}`);
  }

  // Update frontend config file
  const configDir = path.resolve(__dirname, "../src/config");
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  const deploymentData = {
    contractAddress,
    network,
    chainId,
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
