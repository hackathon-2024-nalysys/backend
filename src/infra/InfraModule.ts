import { Global, Module } from '@nestjs/common';
import { PrismaService } from './PrismaService';
import { AccountRepository } from './AccountRepository';

@Global()
@Module({
  providers: [PrismaService, AccountRepository],
  exports: [AccountRepository],
})
export class InfraModule {}
