import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class EmployeeLoginRequestDto {
  @ApiProperty({
    example: 'employee@gmail.com',
  })
  @IsEmail()
  personalEmail!: string;

  @ApiProperty({
    example: 'Password123',
  })
  @IsString()
  password!: string;
}
