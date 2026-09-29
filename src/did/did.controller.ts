import { Controller, Get } from '@nestjs/common';
import { DidService } from './did.service';

@Controller()
export class DidController {
  constructor(private readonly didService: DidService) {}
}

// import { Controller, Get } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';

// @Controller('.well-known')
// export class DidController {
//   constructor(
//     private readonly configService: ConfigService,
//   ) {}

//   @Get('did.json')
//   getDidDocument() {
//     const did =
//       this.configService.getOrThrow<string>('CFT_DID');

//     const keyId =
//       this.configService.getOrThrow<string>('CFT_KEY_ID');

//     const publicKey =
//       this.configService.getOrThrow<string>(
//         'CFT_PUBLIC_KEY_MULTIBASE',
//       );

//     return {
//       '@context': [
//         'https://www.w3.org/ns/did/v1',
//       ],

//       id: did,

//       verificationMethod: [
//         {
//           id: keyId,
//           type: 'Ed25519VerificationKey2020',
//           controller: did,
//           publicKeyMultibase: publicKey,
//         },
//       ],

//       authentication: [keyId],

//       assertionMethod: [keyId],
//     };
//   }
// }
