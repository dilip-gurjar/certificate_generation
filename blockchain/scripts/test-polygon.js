require("dotenv").config();
const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider(
  process.env.POLYGON_AMOY_RPC_URL
);

async function main() {
  const network = await provider.getNetwork();

  console.log("Connected!");
  console.log("Chain ID:", network.chainId.toString());

  const blockNumber = await provider.getBlockNumber();

  console.log("Latest Block:", blockNumber);
}

main().catch(console.error);