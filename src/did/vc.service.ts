import { Injectable } from '@nestjs/common';
import { Ed25519VerificationKey2020 } from '@digitalbazaar/ed25519-verification-key-2020';
import { Ed25519Signature2020 } from '@digitalbazaar/ed25519-signature-2020';
import * as vc from '@digitalbazaar/vc';
import crypto from 'node:crypto';
import { DidService } from './did.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VcService {
  constructor(
    private readonly configService: ConfigService,
    private readonly didService: DidService,
  ) {}

  private get issuerDid(): string {
    return this.configService.getOrThrow<string>('CFT_DID');
  }

  async createCredential(employee: {
    id: number;
    did: string;
    name: string;
    workEmail: string;
    joiningDate: Date;
    leavingDate: Date | null;
  }) {
    const keyId = this.configService.getOrThrow<string>('CFT_KEY_ID');

    const privateKeyMultibase = this.configService.getOrThrow<string>(
      'CFT_PRIVATE_KEY_MULTIBASE',
    );
    const publicKeyMultibase = this.configService.getOrThrow<string>(
      'CFT_PUBLIC_KEY_MULTIBASE',
    );

    // from() ka kaam raw/existing key material ko VC/DID ecosystem ke expected structured key object mein load karna

    const key = await Ed25519VerificationKey2020.from({
      id: keyId,
      controller: this.issuerDid,
      type: 'Ed25519VerificationKey2020',
      publicKeyMultibase,
      privateKeyMultibase,
    });

    // 2. Create signature suite
    const suite = new Ed25519Signature2020({ key });

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
        id: employee.did,
        name: employee.name,
        workEmail: employee.workEmail,
        joiningDate: employee.joiningDate.toISOString(),
        leavingDate: employee.leavingDate?.toISOString() ?? null,
      },
    };

    // 4. Create document loader
    const documentLoader = await this.didService.buildDocumentLoader(); //Required JSON-LD/security documents kahan milenge?

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
}
