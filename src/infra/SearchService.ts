import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Hobby } from '../domain/Hobby';

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearch: ElasticsearchService) {}

  async searchSimilarHobbies(embeddings: number[]): Promise<string[]> {
    const result = await this.elasticsearch.search({
      index: process.env.ES_INDEX,
      body: {
        knn: {
          field: 'embeddings',
          query_vector: embeddings,
          k: 10,
          num_candidates: 10,
        },
      },
    });
    return result.hits.hits
      .filter((hit) => (hit._score ?? 0) > 0.94) // the magic number
      .map((hit) => hit._id!);
  }

  async indexHobby(name: string, embeddings: number[]): Promise<void> {
    await this.elasticsearch.index({
      index: process.env.ES_INDEX ?? '',
      id: name,
      body: {
        name,
        embeddings,
      },
    });
  }
}
