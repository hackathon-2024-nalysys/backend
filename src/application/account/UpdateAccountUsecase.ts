import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../../infra/AccountRepository';
import { HobbyAppService } from './HobbyAppService';
import { IsArray, Validate, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAccountInput {
  displayName!: string;

  @IsArray()
  publicHobbies!: string[];

  @IsArray()
  privateHobbies!: string[];
}

@Injectable()
export class UpdateAccountUsecase {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly hobbyAppService: HobbyAppService,
  ) {}

  async exec(accountId: string, input: UpdateAccountInput) {
    const account = await this.accountRepository.findById(accountId);

    if (!account) {
      throw new Error('Account not found');
    }

    account?.setDisplayName(input.displayName);

    await this.accountRepository.save(account);

    // 続いてhobbyの登録
    await this.hobbyAppService.ensureHobbyExists([
      ...input.publicHobbies,
      ...input.privateHobbies,
    ]);
    await this.accountRepository.saveHobbyAssociation(
      accountId,
      input.publicHobbies,
      input.privateHobbies,
    );
  }
}
