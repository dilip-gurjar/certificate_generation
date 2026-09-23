import { Injectable } from '@nestjs/common';
import { Ed25519VerificationKey2020 } from '@digitalbazaar/ed25519-verification-key-2020';
import { securityLoader } from '@digitalbazaar/security-document-loader';
import fs from 'node:fs/promises';
import path from 'node:path';

@Injectable()
export class DidService {
  private readonly did = 'did:web:codesfortomorrow.com';

  async getDidDocument() {
    const keyPath = path.resolve('secrets/cft-key.json');

    const keyData = JSON.parse(await fs.readFile(keyPath, 'utf8'));

    const key = await Ed25519VerificationKey2020.from(keyData);

    const publicKey = await key.export({
      publicKey: true,
    });

    const verificationMethodId = `${this.did}#key-1`;

    return {
      '@context': ['https://www.w3.org/ns/did/v1'],

      id: this.did,

      verificationMethod: [
        {
          id: verificationMethodId,
          type: 'Ed25519VerificationKey2020',
          controller: this.did,
          publicKeyMultibase: publicKey.publicKeyMultibase,
        },
      ],

      authentication: [verificationMethodId],

      assertionMethod: [verificationMethodId],
    };
  }
  async buildDocumentLoader() {
    const didDocument = await this.getDidDocument();

    const verificationMethod = didDocument.verificationMethod[0];

    const loader = securityLoader();

    // Our CFT DID Document
    loader.addStatic(this.did, didDocument);

    // Our CFT verification method
    loader.addStatic(verificationMethod.id, verificationMethod);

    // Our custom EmploymentCertificate context
    loader.addStatic(
      'https://codesfortomorrow.com/credentials/EmploymentCertificate',
      {
        '@context': {
          EmploymentCertificate:
            'https://codesfortomorrow.com/credentials/EmploymentCertificate',

          name: 'https://schema.org/name',

          workEmail: 'https://schema.org/email',

          joiningDate: 'https://schema.org/startDate',

          leavingDate: 'https://schema.org/endDate',
        },
      },
    );

    return loader.build();
  }
}
