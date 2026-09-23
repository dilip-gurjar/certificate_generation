import { Module } from '@nestjs/common';
import { DidService } from './did.service';
import { DidController } from './did.controller';

@Module({
  imports: [DidModule],
  providers: [DidService],
  controllers: [DidController],
  exports: [DidService],
})
export class DidModule {}
