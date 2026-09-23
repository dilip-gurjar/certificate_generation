import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreateCertificateDto {
  //   @ApiProperty({
  //     example: 'CFT-CERT-001',
  //     description: 'Unique certificate number',
  //   })
  //   @IsString()
  //   certificateNumber!: string;
}
