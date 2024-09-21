import { Injectable } from '@nestjs/common';
import { Account } from '../../domain/Account';
import { AccountAppService } from './AccountAppService';

export type AccountWithHobbies = {
  account: Account;
  publicHobbies: string[];
};

export type DashboardData = {
  byHobby: {
    hobby: string;
    accounts: AccountWithHobbies[];
  }[];
};

// 自分自身を除く&publicHobbiesのみを返す
const sanitizeAccounts = (
  accountId: string,
  accounts: AccountWithHobbies[],
) => {
  return accounts
    .filter((a) => a.account.id !== accountId)
    .map((a) => ({
      account: a.account,
      publicHobbies: a.publicHobbies,
    }));
};

@Injectable()
export class LoadDashboardUsecase {
  constructor(private readonly accountAppService: AccountAppService) {}

  async load(accountId: string): Promise<DashboardData> {
    const dashboardData: DashboardData = {
      byHobby: [],
    };

    const [account] = await this.accountAppService.loadAccountsWithHobbies([
      accountId,
    ]);
    if (!account) throw new Error('Account not found');

    for (const hobby of [...account.publicHobbies, ...account.privateHobbies]) {
      const accounts =
        await this.accountAppService.searchAccountsWithHobbies(hobby);
      dashboardData.byHobby.push({
        hobby,
        accounts: sanitizeAccounts(accountId, accounts),
      });
    }

    return dashboardData;
  }
}
