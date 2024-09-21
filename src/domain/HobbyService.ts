import { Inject, Injectable } from '@nestjs/common';
import { GENERATIVE_AI, GenerativeAi } from './GenerativeAi';
import { Hobby } from './Hobby';
import { HobbyRepository } from '../infra/HobbyRepository';

@Injectable()
export class HobbyService {
  constructor(
    @Inject(GENERATIVE_AI) private readonly ai: GenerativeAi,
    private readonly hobbyRepository: HobbyRepository,
  ) {}

  async createHobby(word: string) {
    const hobby = await Hobby.create(word, this.ai);
    await this.hobbyRepository.save(hobby);
  }
}
