import { Global, Module } from '@nestjs/common';
import { PrismaService } from './PrismaService';
import { AccountRepository } from './AccountRepository';
import { GENERATIVE_AI } from '../domain/GenerativeAi';
import { GenerativeAiImpl } from './GenerativeAiImpl';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { HobbyRepository } from './HobbyRepository';
import { SearchService } from './SearchService';

@Global()
@Module({
  imports: [
    ElasticsearchModule.register({
      node: process.env.ES_URL,
    }),
  ],
  providers: [
    PrismaService,
    SearchService,
    {
      provide: GENERATIVE_AI,
      useClass: GenerativeAiImpl,
    },
    AccountRepository,
    HobbyRepository,
  ],
  exports: [AccountRepository, HobbyRepository, GENERATIVE_AI],
})
export class InfraModule {}
