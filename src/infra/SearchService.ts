import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearch: ElasticsearchService) {}

  async searchSimilarHobbies(query: string): Promise<string[]> {
    const result = await this.elasticsearch.search({
      index: process.env.ES_INDEX,
      body: {
        query: {
          match: { content: query },
        },
      },
    });
    return result.hits.hits
      .filter((hit) => (hit._score ?? 0) > 0.94) // the magic number
      .map((hit) => hit.fields?.name);
  }

  async indexHobby(name: string, embeddings: number[]): Promise<void> {
    await this.elasticsearch.index({
      index: process.env.ES_INDEX ?? '',
      body: {
        name,
        embeddings,
      },
    });
  }
}
