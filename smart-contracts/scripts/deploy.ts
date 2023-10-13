import { ethers } from "hardhat";
import fs from "fs";

async function main() {
  const factory = await ethers.deployContract("Factory", [], {});
  factory.waitForDeployment()

  console.log(`Deployed factory contract to: ${await factory.getAddress()}`)

  const data = { address: await factory.getAddress() }
  fs.writeFileSync("deployments.json", JSON.stringify(data, null, 4))
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
