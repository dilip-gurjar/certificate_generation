import { resolver } from "./did-resolver.js";

const did =
  "did:ethr:0x13882:0xf4658a6b4300C656b5801Ee52C9106a86Db6b88e";

async function main() {
  const result = await resolver.resolve(did);

  console.log(JSON.stringify(result, null, 2));
}

main().catch(console.error);