import { Module } from '@nestjs/common';
import { AccountController } from './AccountController';
import { AuthAppModule } from '../application/auth/AuthAppModule';
import { AuthController } from './AuthController';
import { AccountAppModule } from '../application/account/AccountAppModule';

@Module({
  imports: [AccountAppModule, AuthAppModule],
  controllers: [AccountController, AuthController],
})
export class PresentationModule {}
