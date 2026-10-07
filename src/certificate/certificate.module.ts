import { Module } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CertificateController } from './certificate.controller';
import { PrismaModule } from 'src/prisma';
import { VcService } from 'src/did/vc.service';
import { DidModule } from 'src/did/did.module';
import { MailModule } from 'src/mail';
import { EncryptionModule } from 'src/encryption/encryption.module';

@Module({
  imports: [MailModule, PrismaModule, DidModule, EncryptionModule],
  providers: [CertificateService, VcService],
  controllers: [CertificateController],
})
export class CertificateModule {}
