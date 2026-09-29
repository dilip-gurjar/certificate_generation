import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { PrismaModule } from 'src/prisma';
import { EmployeeDidModule } from 'src/employee-did/employee-did.module';
import { EncryptionModule } from 'src/encryption/encryption.module';

@Module({
  imports: [PrismaModule, EncryptionModule, EmployeeDidModule],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
