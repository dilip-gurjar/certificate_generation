import { Wallet } from "ethers";

const wallet = Wallet.createRandom();

console.log("Signing Address:", wallet.address);
console.log("Signing Private Key:", wallet.privateKey);



// Signing Address: 0xe359C2eb35ADB341358A82eceED9fdA006861f52
// Signing Private Key: 0x8c0266d0056958a8f17a931473927764e739564172a785f18796d68e1c1399b1

