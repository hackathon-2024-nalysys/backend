import { Module } from '@nestjs/common';
import { HobbyService } from './HobbyService';

@Module({
  providers: [HobbyService],
  exports: [HobbyService],
})
export class DomainServiceModule {}
