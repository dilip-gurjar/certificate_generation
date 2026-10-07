import { Module } from '@nestjs/common';
import { DidService } from './did.service';

@Module({
  imports: [DidModule],
  providers: [DidService],
  exports: [DidService],
})
export class DidModule {}
