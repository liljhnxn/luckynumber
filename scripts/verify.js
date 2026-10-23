import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const contractAddress = process.argv[2] || "0x27Cdd24BEa9983E50fAfCF943F992b7785731f36";
  const contractPath = path.resolve(__dirname, "../contracts/LuckyNumber.sol");
  const sourceCode = fs.readFileSync(contractPath, "utf8");

  console.log("Verifying contract at:", contractAddress);
  console.log("Explorer API: https://scan.botchain.ai/api");

  const params = new URLSearchParams();
  params.append("module", "contract");
  params.append("action", "verifysourcecode");
  params.append("contractaddress", contractAddress);
  params.append("sourceCode", sourceCode);
  params.append("codeformat", "solidity-single-file");
  params.append("contractname", "LuckyNumber");
  params.append("compilerversion", "v0.8.20+commit.a1b79de6");
  params.append("optimizationUsed", "1");
  params.append("runs", "200");
  params.append("evmversion", "paris");
  params.append("licenseType", "3");

  const res = await fetch("https://scan.botchain.ai/api", {
    method: "POST",
    body: params,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  const data = await res.json();
  console.log("Verification Response:", data);
}

main().catch(console.error);
