import { Injectable } from '@nestjs/common';
// import { Ed25519VerificationKey2020 } from '@digitalbazaar/ed25519-verification-key-2020';
// import { Ed25519Signature2020 } from '@digitalbazaar/ed25519-signature-2020';
// import * as vc from '@digitalbazaar/vc';
// import crypto from 'node:crypto';
// import { DidService } from './did.service';
import { ConfigService } from '@nestjs/config';
import { decodeJWT,  } from 'did-jwt';

import { createVerifiableCredentialJwt,CredentialPayload } from 'did-jwt-vc';
import { ES256KSigner, hexToBytes } from 'did-jwt';

@Injectable()
export class VcService {
  constructor(
    private readonly configService: ConfigService,
    // private readonly didService: DidService,
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
    // const keyId = this.configService.getOrThrow<string>('CFT_KEY_ID');

    const privateKey = this.configService.getOrThrow<string>(
      'VC_SIGNING_PRIVATE_KEY',
    );

    const signingKeyId = this.configService.getOrThrow<string>(
      'VC_SIGNING_KEY_ID',
    );

    const signer = ES256KSigner(
      hexToBytes(privateKey.replace(/^0x/, '')),
    );

  
    const credential: CredentialPayload = {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        
      ],

      id: `urn:uuid:${crypto.randomUUID()}`,

      type: ['VerifiableCredential',],

      issuer: this.issuerDid,

      issuanceDate: new Date().toISOString(),

      credentialSubject: {
        id: employee.did,
        name: employee.name,
        workEmail: employee.workEmail,
        joiningDate: employee.joiningDate.toISOString(),
        leavingDate: employee.leavingDate?.toISOString() ?? null,
      },
    };

  }}
