import { Injectable } from '@nestjs/common';
import { HobbyService } from '../../domain/HobbyService';
import { HobbyRepository } from '../../infra/HobbyRepository';

@Injectable()
export class HobbyAppService {
  constructor(
    private readonly hobbyService: HobbyService,
    private readonly hobbyRepository: HobbyRepository,
  ) {}

  async ensureHobbyExists(hobbies: string[]): Promise<void> {
    for (const hobby of hobbies) {
      if (!(await this.hobbyRepository.exists(hobby))) {
        await this.hobbyService.createHobby(hobby);
      }
    }
  }
}
