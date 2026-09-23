import { Module } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CertificateController } from './certificate.controller';
import { PrismaModule } from 'src/prisma';
import { VcService } from 'src/did/vc.service';
import { DidModule } from 'src/did/did.module';

@Module({
  imports: [PrismaModule, DidModule],
  providers: [CertificateService, VcService],
  controllers: [CertificateController],
})
export class CertificateModule {}
