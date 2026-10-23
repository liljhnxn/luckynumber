import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const rpcUrl = process.env.BOTCHAIN_RPC_URL || "https://rpc.botchain.ai";
  console.log("========================================");
  console.log("🚀 Starting Botchain Mainnet Deployment");
  console.log("========================================");
  console.log(`RPC Endpoint: ${rpcUrl}`);

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const network = await provider.getNetwork();
  const chainId = Number(network.chainId);
  console.log(`Chain ID:     ${chainId}`);

  if (chainId !== 677) {
    console.warn(`⚠️ Warning: Expected Chain ID 677 for Botchain Mainnet, but connected to ${chainId}`);
  }

  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    console.error("❌ Error: No PRIVATE_KEY configured in .env file.");
    process.exit(1);
  }

  const wallet = new ethers.Wallet(privateKey, provider);
  console.log(`Deployer:     ${wallet.address}`);

  const balance = await provider.getBalance(wallet.address);
  console.log(`Balance:      ${ethers.formatEther(balance)} BOT`);

  if (balance === 0n) {
    console.error("❌ Error: Deployer account has 0 BOT balance.");
    process.exit(1);
  }

  // Load contract artifact
  const artifactPath = path.resolve(__dirname, "../artifacts/contracts/LuckyNumber.sol/LuckyNumber.json");
  if (!fs.existsSync(artifactPath)) {
    console.error(`❌ Error: Artifact not found at ${artifactPath}. Please compile contract first.`);
    process.exit(1);
  }
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);

  // Get optimal gas price
  const feeData = await provider.getFeeData();
  const minGasPrice = 20000000000n; // 20 gwei standard minimum
  const gasPrice = feeData.gasPrice && feeData.gasPrice > minGasPrice ? feeData.gasPrice : minGasPrice;
  console.log(`Optimal Gas Price: ${ethers.formatUnits(gasPrice, "gwei")} gwei (economical minimum)`);

  console.log("Estimating gas units...");
  const deployTxReq = await factory.getDeployTransaction();
  const estimatedGas = await provider.estimateGas(deployTxReq);
  const estimatedTotalCost = estimatedGas * gasPrice;
  console.log(`Estimated Gas Units: ${estimatedGas.toString()}`);
  console.log(`Estimated Deployment Fee: ${ethers.formatEther(estimatedTotalCost)} BOT`);

  if (balance < estimatedTotalCost) {
    console.error(`❌ Error: Insufficient balance. Need at least ${ethers.formatEther(estimatedTotalCost)} BOT.`);
    process.exit(1);
  }

  console.log("Submitting deployment transaction to Botchain Mainnet...");
  const contract = await factory.deploy({
    gasPrice: gasPrice,
    gasLimit: (estimatedGas * 12n) / 10n, // safe 20% margin on gas limit without paying extra unless consumed
  });

  console.log("Waiting for block confirmation...");
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  const deployTx = contract.deploymentTransaction();
  const txHash = deployTx?.hash;

  let actualCost = estimatedTotalCost;
  if (deployTx) {
    const receipt = await deployTx.wait();
    if (receipt) {
      actualCost = receipt.gasUsed * (receipt.gasPrice || gasPrice);
      console.log(`Actual Gas Used: ${receipt.gasUsed.toString()} units`);
      console.log(`Actual Gas Fee:  ${ethers.formatEther(actualCost)} BOT`);
    }
  }

  console.log("----------------------------------------");
  console.log("🎉 LuckyNumber Contract Successfully Deployed!");
  console.log(`Contract Address: ${contractAddress}`);
  if (txHash) {
    console.log(`Transaction Hash: ${txHash}`);
    console.log(`Explorer Link:    https://scan.botchain.ai/tx/${txHash}`);
    console.log(`Contract Link:    https://scan.botchain.ai/address/${contractAddress}`);
  }
  console.log("----------------------------------------");

  // Save to deployedContract.json
  const configDir = path.resolve(__dirname, "../src/config");
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  const deploymentData = {
    contractAddress,
    network: "botchainMainnet",
    chainId: 677,
    deployedAt: new Date().toISOString(),
    txHash: txHash || null,
    gasUsed: actualCost ? ethers.formatEther(actualCost) : null,
  };

  const configPath = path.join(configDir, "deployedContract.json");
  fs.writeFileSync(configPath, JSON.stringify(deploymentData, null, 2));
  console.log(`💾 Saved to ${configPath}`);

  // Update .env NEXT_PUBLIC_CONTRACT_ADDRESS
  const envPath = path.resolve(__dirname, "../.env");
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, "utf8");
    if (envContent.includes("NEXT_PUBLIC_CONTRACT_ADDRESS=")) {
      envContent = envContent.replace(
        /NEXT_PUBLIC_CONTRACT_ADDRESS=.*/,
        `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`
      );
    } else {
      envContent += `\nNEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}\n`;
    }
    fs.writeFileSync(envPath, envContent);
    console.log(`💾 Updated NEXT_PUBLIC_CONTRACT_ADDRESS in .env`);
  }

  console.log("========================================");
  console.log("✅ Mainnet Deployment Completed Successfully!");
  console.log("========================================");
}

main().catch((err) => {
  console.error("❌ Deployment failed with error:", err);
  process.exit(1);
});
