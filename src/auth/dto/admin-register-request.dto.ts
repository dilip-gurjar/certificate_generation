import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AdminRegisterRequestDto {
  @ApiProperty({
    example: 'Dilip',
    description: 'Admin first name',
  })
  @IsString()
  @IsNotEmpty()
  firstname!: string;

  @ApiProperty({
    example: 'Gurjar',
    description: 'Admin last name',
  })
  @IsString()
  @IsNotEmpty()
  lastname!: string;

  @ApiProperty({
    example: 'admin@codesfortomorrow.com',
    description: 'Admin email address',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'Admin@123',
    description: 'Admin password',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;
}
