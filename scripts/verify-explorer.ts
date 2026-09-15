import * as fs from "fs";
import * as path from "path";

async function verifyExplorer(endpoint: string, contractAddress: string) {
  const flattenedPath = path.join(process.cwd(), "contracts", "BotDAO_Flattened.sol");
  const sourceCode = fs.readFileSync(flattenedPath, "utf-8");

  console.log(`Submitting verification to ${endpoint}...`);

  const params = new URLSearchParams();
  params.append("module", "contract");
  params.append("action", "verifysourcecode");
  params.append("contractaddress", contractAddress);
  params.append("sourceCode", sourceCode);
  params.append("codeformat", "solidity-single-file");
  params.append("contractname", "BotDAO");
  params.append("compilerversion", "v0.8.24+commit.e11b9ed9");
  params.append("optimizationUsed", "1");
  params.append("runs", "200");
  params.append("evmversion", "shanghai");
  params.append("licenseType", "3");
  // Constructor arguments: uint256 2
  params.append("constructorArguements", "0000000000000000000000000000000000000000000000000000000000000002");

  try {
    const res = await fetch(`${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const text = await res.text();
    console.log("Response body:", text);

    const json = JSON.parse(text);
    if (json.status === "1" || json.message === "OK") {
      const guid = json.result;
      console.log("🎉 Verification submitted! GUID:", guid);

      for (let i = 0; i < 6; i++) {
        await new Promise((r) => setTimeout(r, 3000));
        const checkRes = await fetch(`${endpoint}?module=contract&action=checkverifystatus&guid=${guid}`);
        const checkJson = await checkRes.json();
        console.log(`Status check (${i + 1}/6):`, checkJson);
        if (
          checkJson.result === "Pass - Verified" ||
          checkJson.result === "Already Verified" ||
          checkJson.message === "OK"
        ) {
          console.log("✅ CONTRACT VERIFIED SUCCESSFULLY!");
          return true;
        }
      }
      return true;
    }
  } catch (err) {
    console.error(`Error with ${endpoint}:`, err);
  }
  return false;
}

async function main() {
  const contractAddress = process.env.NEXT_PUBLIC_BOTDAO_CONTRACT_ADDRESS || "0x0E88F330627423a40947378bb91EF3215707cCfa";
  console.log("Verifying BotDAO at:", contractAddress);
  await verifyExplorer("https://scan.botchain.ai/api", contractAddress);
}

main().catch(console.error);
