import { ethers } from "hardhat";

const address = { main: "CHANGE_ME" };

async function main() {
  console.log("Deploying Service contract.....");
  const deployerAddress = address["main"];
  const Ledger = await ethers.getContractFactory("Ledger");
  const ledger = await Ledger.deploy(deployerAddress);
  await ledger.deployed();
  console.log(`Contract Deployed at: `, ledger.address);
  console.log(`Deployed by: `, deployerAddress);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
