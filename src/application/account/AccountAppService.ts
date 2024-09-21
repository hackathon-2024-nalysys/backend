import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../../infra/AccountRepository';
import { Account } from '../../domain/Account';

@Injectable()
export class AccountAppService {
  constructor(private readonly accountRepository: AccountRepository) {}

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
}
