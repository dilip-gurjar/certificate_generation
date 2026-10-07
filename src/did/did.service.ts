import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resolver } from 'did-resolver';
import { getResolver } from 'web-did-resolver';
import { securityLoader } from '@digitalbazaar/security-document-loader';

@Injectable()
export class DidService {
  private readonly resolver: Resolver;
  constructor(private readonly configService: ConfigService) {
    this.resolver = new Resolver({
      ...getResolver(), //resolver ko batata hai ki did:web DID ko kaise resolve karna hai.
    });
  }

  private get did(): string {
    return this.configService.getOrThrow<string>('CFT_DID');
  }

  async buildDocumentLoader() {
    const loader = securityLoader();

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

    const baseDocumentLoader = loader.build();

    return async (url: string) => {
      if (url.startsWith('did:')) {
        return this.loadDidDocument(url); // DID resolver
      }

      return baseDocumentLoader(url); // security + custom contexts
    };
  }

  private async loadDidDocument(url: string) {
    const [did] = url.split('#');

    if (did !== this.did) {
      throw new Error(`Unsupported DID: ${did}`);
    }

    const result = await this.resolver.resolve(did);

    if (result.didResolutionMetadata?.error) {
      throw new Error(
        `DID resolution failed: ${result.didResolutionMetadata.error}`,
      );
    }

    const didDocument = result.didDocument;
    // console.log("dcmt",didDocument);

    if (!didDocument) {
      throw new Error(`DID document not found for ${did}`);
    }

    if (url === did) {
      return {
        contextUrl: null,
        documentUrl: did,
        document: didDocument,
      };
    }

    const fragment = url.substring(url.indexOf('#') + 1);
    // console.log(fragment)

    const verificationMethod = didDocument.verificationMethod?.find(
      (method: any) => method.id === url || method.id === `#${fragment}`,
    );

    if (!verificationMethod) {
      throw new Error(`Verification method not found: ${url}`);
    }

    return {
      contextUrl: null,
      documentUrl: url,
      document: verificationMethod,
    };
  }
}
