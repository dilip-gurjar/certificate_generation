import { IsDateString, IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsEmail()
  workEmail!: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  personalEmail?: string;

  @ApiProperty({
    example: '2026-01-10',
    description: 'Employee joining date',
  })
  @IsDateString()
  joiningDate!: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  leavingDate?: string;

  //   @ApiProperty()
  //   @IsOptional()
  //   @IsString()
  //   did?: string;

  //   @ApiProperty()
  //   @IsOptional()
  //   @IsString()
  //   organizationDid?: string;
}
