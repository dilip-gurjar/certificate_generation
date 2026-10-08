import { Ed25519VerificationKey2020 } from '@digitalbazaar/ed25519-verification-key-2020';
import fs from 'node:fs/promises';
import path from 'node:path';
const did = 'did:web:codesfortomorrow.com';

const key = await Ed25519VerificationKey2020.generate({
  id: `${did}#cft-signing-key`,
  controller: did,
});

const exportedKey = await key.export({
  publicKey: true,
  privateKey: true,
});

const outputDir = path.resolve('secrets');

await fs.mkdir(outputDir, { recursive: true });

await fs.writeFile(
  path.join(outputDir, 'cft-key.json'),
  JSON.stringify(exportedKey, null, 2),
  'utf8', //Computer text ko numbers/bytes ke form mein store karta hai. UTF-8 batata hai ki un bytes ko characters mein kaise convert karna hai.
);
