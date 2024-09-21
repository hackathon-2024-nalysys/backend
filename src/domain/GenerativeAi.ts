export const GENERATIVE_AI = Symbol('GenerativeAi');

export interface GenerativeAi {
  generateHobbyDescription(hobbyName: string): Promise<string>;
  generateEmbedding(content: string): Promise<number[]>;
}
