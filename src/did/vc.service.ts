import { Injectable } from '@nestjs/common';
import { Ed25519VerificationKey2020 } from '@digitalbazaar/ed25519-verification-key-2020';
import { Ed25519Signature2020 } from '@digitalbazaar/ed25519-signature-2020';
import * as vc from '@digitalbazaar/vc';
import { securityLoader } from '@digitalbazaar/security-document-loader';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { DidService } from './did.service';
// import { AssertionProofPurpose } from '@digitalbazaar/ed25519-signature-2020';

@Injectable()
export class VcService {
  constructor(private readonly didService: DidService) {}

  private readonly issuerDid = 'did:web:codesfortomorrow.com';

  async verifyCredential(credential: any) {
    const suite = new Ed25519Signature2020();

    const documentLoader = await this.didService.buildDocumentLoader();

    const result = await vc.verifyCredential({
      credential,
      suite,
      documentLoader,
    });

    return {
      verified: result.verified ?? result.valid,
      error: result.error ?? null,
    };
  }

  async createCredential(employee: {
    id: number;
    name: string;
    workEmail: string;
    joiningDate: Date;
    leavingDate: Date | null;
  }) {
    // 1. Load CFT's existing key
    const keyPath = path.resolve('secrets/cft-key.json');

    const keyData = JSON.parse(await fs.readFile(keyPath, 'utf8'));

    const key = await Ed25519VerificationKey2020.from(keyData); //Ye raw JSON key data ko Digital Bazaar ke key object mein convert karta hai.

    // 2. Create signature suite
    const suite = new Ed25519Signature2020({
      //VC ko Ed25519Signature2020 algorithm ke according sign karo aur ye CFT key use karo.
      key,
    });

    // 3. Create unsigned VC
    const credential = {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        {
          EmploymentCertificate:
            'https://codesfortomorrow.com/credentials/EmploymentCertificate',

          name: 'https://schema.org/name',
          workEmail: 'https://schema.org/email',
          joiningDate: 'https://schema.org/startDate',
          leavingDate: 'https://schema.org/endDate',
        },
      ],

      id: `urn:uuid:${crypto.randomUUID()}`,

      type: ['VerifiableCredential', 'EmploymentCertificate'],

      issuer: this.issuerDid,

      // issuanceDate: new Date().toISOString(),

      credentialSubject: {
        id: `employee:${employee.id}`,
        name: employee.name,
        workEmail: employee.workEmail,
        joiningDate: employee.joiningDate.toISOString(),
        leavingDate: employee.leavingDate?.toISOString() ?? null,
      },
    };

    // 4. Create document loader
    const documentLoader = securityLoader().build(); //Required JSON-LD/security documents kahan milenge?

    try {
      const signedCredential = await vc.issue({
        credential,
        suite,
        documentLoader,
      });

      return signedCredential;
    } catch (error) {
      console.error('VC ISSUE ERROR:', error);
      throw error;
    }
  }
}
