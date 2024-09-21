import { Module } from '@nestjs/common';
import { PresentationModule } from './presentation/PresentationModule';
import { InfraModule } from './infra/InfraModule';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './presentation/AuthGuard';

@Module({
  imports: [InfraModule, PresentationModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
