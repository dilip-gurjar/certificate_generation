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
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('certificate')
@Controller('certificate')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Post(':employeeId')
  create(@Param('employeeId', ParseIntPipe) employeeId: number) {
    return this.certificateService.create(employeeId);
  }

  @Get(':id/verify')
  async verify(@Param('id', ParseIntPipe) id: number) {
    return this.certificateService.verify(id);
  }

  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 5) {
    return this.certificateService.findAll(Number(page), Number(limit));
  }
}
