import { Module } from '@nestjs/common';
import { HobbyAppService } from './HobbyAppService';
import { UpdateAccountUsecase } from './UpdateAccountUsecase';
import { DomainServiceModule } from '../../domain/DomainServiceModule';
import { AccountAppService } from './AccountAppService';

@Module({
  imports: [DomainServiceModule],
  providers: [AccountAppService, HobbyAppService, UpdateAccountUsecase],
  exports: [AccountAppService, UpdateAccountUsecase],
})
export class AccountAppModule {}
