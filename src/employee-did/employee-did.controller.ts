import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { EmployeeDidService } from './employee-did.service';

@Controller('employee-did')
export class EmployeeDidController {
  constructor(private readonly employeeDidService: EmployeeDidService) {}

  // @Get('test')
  // async test() {
  //   return this.employeeDidService.generateDid();
  // }
  //   @Get(':employeeId/private-key')
  //   async getPrivateKey(
  //     @Param('employeeId', ParseIntPipe) employeeId: number,
  //   ) {
  //     return this.employeeDidService.getPrivateKey(employeeId);
  //   }

  // @Get(':employeeId/test-key-pair')
  // async testKeyPair(
  //   @Param('employeeId', ParseIntPipe) employeeId: number,
  // ) {
  //   return this.employeeDidService.testKeyPair(employeeId);
  // }
  // @Get(':employeeId/verification-key')
  // async getVerificationKey(
  //   @Param('employeeId', ParseIntPipe) employeeId: number,
  // ) {
  //   const key =
  //     await this.employeeDidService.getVerificationKey(
  //       employeeId,
  //     );

  //   return {
  //     id: key.id,
  //     controller: key.controller,
  //     type: key.type,
  //     publicKeyMultibase: key.publicKeyMultibase,
  //     hasPrivateKey: !!key.privateKeyMultibase,
  //   };
  // }
}
