import { Injectable } from '@nestjs/common';
import { Account } from '../../domain/Account';
import { AccountAppService } from './AccountAppService';

export type AccountWithHobbies = {
  account: Account;
  publicHobbies: string[];
  privateHobbies: string[];
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
  similarHobbies: string[],
) => {
  return accounts
    .filter((a) => a.account.id !== accountId)
    .map((a) => ({
      account: a.account,
      publicHobbies: a.publicHobbies,
      privateHobbies: a.privateHobbies.filter((h) =>
        similarHobbies.includes(h),
      ),
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
      const { accounts, similars } =
        await this.accountAppService.searchAccountsWithHobbies(hobby);
      dashboardData.byHobby.push({
        hobby,
        accounts: sanitizeAccounts(accountId, accounts, similars),
      });
    }

    return dashboardData;
  }
}
