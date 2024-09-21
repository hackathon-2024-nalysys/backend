import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../../infra/AccountRepository';
import { Account } from '../../domain/Account';
import { HobbyRepository } from '../../infra/HobbyRepository';

@Injectable()
export class AccountAppService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly hobbyRepository: HobbyRepository,
  ) {}

  async loadAccountsWithHobbies(accountIds: string[]): Promise<
    {
      account: Account;
      publicHobbies: string[];
      privateHobbies: string[];
    }[]
  > {
    const accounts =
      await this.accountRepository.findByIdsWithHobbies(accountIds);
    return accounts.map((account) => ({
      account: account.account,
      publicHobbies: account.hobbies
        .filter((hobby) => hobby.isPublic)
        .map((hobby) => hobby.name),
      privateHobbies: account.hobbies
        .filter((hobby) => !hobby.isPublic)
        .map((hobby) => hobby.name),
    }));
  }

  async searchAccountsWithHobbies(hobby: string): Promise<
    {
      account: Account;
      publicHobbies: string[];
      privateHobbies: string[];
    }[]
  > {
    const similars = await this.hobbyRepository.searchSimilarHobbies(hobby);
    const accountIds = await this.accountRepository.getIdsByHobbies(similars);
    return await this.loadAccountsWithHobbies(accountIds);
  }
}
