import { Injectable } from '@nestjs/common';
import { Hobby } from '../domain/Hobby';
import { PrismaService } from './PrismaService';
import { SearchService } from './SearchService';

@Injectable()
export class HobbyRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly searchService: SearchService,
  ) {}

  async exists(name: string): Promise<boolean> {
    return (
      (await this.prismaService.hobby.count({
        where: { name },
      })) === 1
    );
  }

  async searchSimilarHobbies(name: string): Promise<string[]> {
    const hobby = await this.prismaService.hobby.findUnique({
      where: { name: name },
    });
    if (!hobby) throw new Error('Hobby not found');
    const similarHobbies = await this.searchService.searchSimilarHobbies(
      hobby.vector,
    );
    return similarHobbies;
  }

  async save(hobby: Hobby): Promise<void> {
    await this.searchService.indexHobby(hobby.name, hobby.embeddings);
    await this.prismaService.hobby.upsert({
      where: { name: hobby.name },
      update: {
        description: hobby.description,
        vector: hobby.embeddings,
      },
      create: {
        name: hobby.name,
        description: hobby.description,
        vector: hobby.embeddings,
      },
    });
  }
}
