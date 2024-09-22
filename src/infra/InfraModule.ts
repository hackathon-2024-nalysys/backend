import { Global, Module } from '@nestjs/common';
import { PrismaService } from './PrismaService';
import { AccountRepository } from './AccountRepository';
import { GENERATIVE_AI } from '../domain/GenerativeAi';
import { GenerativeAiImpl } from './GenerativeAiImpl';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { HobbyRepository } from './HobbyRepository';
import { SearchService } from './SearchService';
import { HashedIconPicker } from './HashedIconPicker';

@Global()
@Module({
  imports: [
    ElasticsearchModule.register({
      node: process.env.ES_URL,
    }),
  ],
  providers: [
    HashedIconPicker,
    PrismaService,
    SearchService,
    {
      provide: GENERATIVE_AI,
      useClass: GenerativeAiImpl,
    },
    AccountRepository,
    HobbyRepository,
  ],
  exports: [
    AccountRepository,
    HobbyRepository,
    GENERATIVE_AI,
    HashedIconPicker,
  ],
})
export class InfraModule {}
