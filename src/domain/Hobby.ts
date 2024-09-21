import { randomUUID } from 'crypto';
import { Literal } from '../lib/typeUtil';
import { GenerativeAi } from './GenerativeAi';

export class Hobby {
  constructor(hobby: Literal<Hobby>) {
    this.name = hobby.name;
    this.description = hobby.description;
    this.embeddings = hobby.embeddings;
  }

  name: string;
  description: string;
  embeddings: number[];

  static async create(name: string, ai: GenerativeAi): Promise<Hobby> {
    const description = await ai.generateHobbyDescription(name);
    const embeddings = await ai.generateEmbedding(description);
    return new Hobby({
      name,
      description,
      embeddings,
    });
  }
}
