import { network } from "hardhat";

const CONTRACT_ADDRESS = "0x696293f8D41a02add86EF20071C353457Ac80520";

async function main() {
  const { ethers } = await network.connect();

  const contract = await ethers.getContractAt(
    "CertificateRegistry",
    CONTRACT_ADDRESS,
  );

  // Test certificate hash
  const certificateHash = ethers.keccak256(
    ethers.toUtf8Bytes("certificate-123"),
  );

  console.log("Certificate Hash:", certificateHash);

  // Check certificate before registration
  const before = await contract.verifyCertificate(certificateHash);

  console.log("\nBefore Registration:");
  console.log("Exists:", before[0]);
  console.log("Issuer:", before[1]);
  console.log("Issued At:", before[2].toString());
  console.log("Revoked:", before[3]);

  // Register certificate
  console.log("\nRegistering certificate...");

  const tx = await contract.registerCertificate(certificateHash);

  console.log("Transaction Hash:", tx.hash);

  await tx.wait();

  console.log("Certificate registered!");

  // Check certificate after registration
  const after = await contract.verifyCertificate(certificateHash);

  console.log("\nAfter Registration:");
  console.log("Exists:", after[0]);
  console.log("Issuer:", after[1]);
  console.log("Issued At:", after[2].toString());
  console.log("Revoked:", after[3]);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});