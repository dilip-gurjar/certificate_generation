import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Get,
} from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { ApiTags } from '@nestjs/swagger';
import { GetCertificatesRequestDto } from './dto/get-certificates-request-dto';
import { DisableCache } from '@Common';

@ApiTags('certificate')
@Controller('certificate')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Post(':employeeId')
  create(@Param('employeeId', ParseIntPipe) employeeId: number) {
    return this.certificateService.create(employeeId);
  }

  // @Get(':id/verify')
  // @DisableCache()
  // async verify(@Param('id', ParseIntPipe) id: number) {
  //   return this.certificateService.verify(id);
  // }

  @Get()
  @DisableCache()
  findAll(@Query() query: GetCertificatesRequestDto) {
    return this.certificateService
      .findAll
      // query.page ?? 1,
      // query.limit ?? 10,
      ();
  }

  // @Get('public/:shareToken')
  // async getPublicCertificate(@Param('shareToken') shareToken: string) {
  //   return this.certificateService.getPublicCertificate(shareToken);
  // }
}
