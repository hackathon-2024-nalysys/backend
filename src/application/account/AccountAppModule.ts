import { Module } from '@nestjs/common';
import { HobbyAppService } from './HobbyAppService';
import { UpdateAccountUsecase } from './UpdateAccountUsecase';
import { DomainServiceModule } from '../../domain/DomainServiceModule';
import { AccountAppService } from './AccountAppService';
import { LoadDashboardUsecase } from './LoadDashboardUsecase';

@Module({
  imports: [DomainServiceModule],
  providers: [
    AccountAppService,
    HobbyAppService,
    LoadDashboardUsecase,
    UpdateAccountUsecase,
  ],
  exports: [AccountAppService, LoadDashboardUsecase, UpdateAccountUsecase],
})
export class AccountAppModule {}
