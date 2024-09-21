import { Module } from '@nestjs/common';
import { AccountController } from './AccountController';
import { AuthAppModule } from '../application/auth/AuthAppModule';
import { AuthController } from './AuthController';

@Module({
  imports: [AuthAppModule],
  controllers: [AccountController, AuthController],
})
export class PresentationModule {}
