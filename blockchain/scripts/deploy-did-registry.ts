import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();

  const EthereumDIDRegistry =
    await ethers.getContractFactory("EthereumDIDRegistry");

  const registry = await EthereumDIDRegistry.deploy();

  await registry.waitForDeployment();

  const registryAddress = await registry.getAddress();

  console.log(
    "EthereumDIDRegistry deployed to:",
    registryAddress,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});