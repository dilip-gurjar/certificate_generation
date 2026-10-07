import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { DisableCache } from '@Common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetEmployeesRequestDto } from './dto/get-employee-request.dto';
import { JwtAuthGuard, ValidatedUser } from '@Common';
import { PrismaService } from 'src/prisma/prisma.service';
// import PDFDocument from 'pdfkit';
import { Response } from 'express';

@ApiTags('Employee')
@Controller('employee')
export class EmployeeController {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly prismaservice: PrismaService,
  ) {}

  @Get('public/:token')
  async getPublicEmployee(@Param('token') token: string) {
    return this.employeeService.getPublicEmployee(token);
  }

  @ApiBearerAuth()
  @Get('certificate')
  @UseGuards(JwtAuthGuard)
  async getMyCertificate(@Req() req: Request & { user: ValidatedUser }) {
    return this.employeeService.getMyCertificate(req.user.id);
  }

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get()
  @DisableCache()
  async findAll(@Query() query: GetEmployeesRequestDto) {
    return this.employeeService
      .findAll
      //   {
      //   // skip: query.skip,
      //   // take: query.take,
      // }
      ();
  }

  @Get(':id')
  @DisableCache()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeeService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.employeeService.remove(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('certificate/pdf')
  async downloadCertificate(
    @Req() req: Request & { user: ValidatedUser },
    @Res() res: Response,
  ) {
    const pdf = await this.employeeService.generateCertificatePdf(req.user.id);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition':
        'attachment; filename="employment-certificate.pdf"',
      'Content-Length': pdf.length.toString(),
    });

    res.send(pdf);
  }
}
