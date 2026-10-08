require("dotenv").config();
const { ethers } = require("ethers");

async function main() {
  const provider = new ethers.JsonRpcProvider(
    process.env.POLYGON_AMOY_RPC_URL
  );

  const wallet = new ethers.Wallet(
    process.env.CFT_PRIVATE_KEY,
    provider
  );

  console.log("Wallet Address:", wallet.address);

  const balance = await provider.getBalance(wallet.address);

  console.log(
    "POL Balance:",
    ethers.formatEther(balance),
    "POL"
  );
}

main().catch(console.error);