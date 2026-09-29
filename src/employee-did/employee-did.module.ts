import { Module } from '@nestjs/common';
import { EmployeeDidController } from './employee-did.controller';
import { EmployeeDidService } from './employee-did.service';
import { PrismaModule } from '../prisma/prisma.module';
import { EncryptionModule } from 'src/encryption/encryption.module';

@Module({
  imports: [PrismaModule, EncryptionModule],

  controllers: [EmployeeDidController],
  providers: [EmployeeDidService],
  exports: [EmployeeDidService],
})
export class EmployeeDidModule {}
