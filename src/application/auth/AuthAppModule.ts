import { Module } from '@nestjs/common';
import { LoginUsecase } from './LoginUsecase';

@Module({
  providers: [LoginUsecase],
  exports: [LoginUsecase],
})
export class AuthAppModule {}
