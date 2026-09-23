import { Controller, Get } from '@nestjs/common';
import { DidService } from './did.service';

@Controller()
export class DidController {
  constructor(private readonly didService: DidService) {}

  @Get('.well-known/did.json')
  async getDidDocument() {
    return this.didService.getDidDocument();
  }
}
