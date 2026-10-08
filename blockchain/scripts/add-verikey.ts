import { network } from "hardhat";

const REGISTRY_ADDRESS =
  "0x61932A29e301BD7eD3C9CA32e950464b073BcF96";

const CFT_ADDRESS =
  "0xf4658a6b4300C656b5801Ee52C9106a86Db6b88e";

const SIGNING_ADDRESS =
  "0xe359C2eb35ADB341358A82eceED9fdA006861f52";

async function main() {
  const { ethers } = await network.connect();

  const registry = await ethers.getContractAt(
    "EthereumDIDRegistry",
    REGISTRY_ADDRESS,
  );

  // "veriKey" as bytes32
  const delegateType = ethers.encodeBytes32String("veriKey");

  // Valid for 1 year
  const validity = 365 * 24 * 60 * 60;

  console.log("Adding VC signing key as veriKey...");
  console.log("Controller:", CFT_ADDRESS);
  console.log("Signing key:", SIGNING_ADDRESS);

  const tx = await registry.addDelegate(
    CFT_ADDRESS,
    delegateType,
    SIGNING_ADDRESS,
    validity,
  );

  console.log("Transaction:", tx.hash);

  await tx.wait();

  console.log("veriKey delegate added successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});