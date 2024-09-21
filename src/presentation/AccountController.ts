import { Body, Controller, Get, Patch } from '@nestjs/common';
import { CurrentSession } from './session';
import { SessionInterface } from '../application/auth/SessionInterface';
import { AccountRepository } from '../infra/AccountRepository';
import { Account } from '../domain/Account';
import {
  UpdateAccountInput,
  UpdateAccountUsecase,
} from '../application/account/UpdateAccountUsecase';
import { AccountAppService } from '../application/account/AccountAppService';

type SanitizedAccount = {
  id: string;
  name: string;
  displayName: string;
  affiliation: string | null;
};

const sanitizeAccount = (account: Account): SanitizedAccount => {
  return {
    id: account.id,
    name: account.name,
    displayName: account.displayName,
    affiliation: account.affiliation,
  };
};

const flattenHobbies = (result: {
  account: Account;
  publicHobbies: string[];
  privateHobbies: string[];
}) => {
  return {
    ...sanitizeAccount(result.account),
    publicHobbies: result.publicHobbies,
    privateHobbies: result.privateHobbies,
  };
};

@Controller('/v1/accounts/')
export class AccountController {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly updateAccountUsecase: UpdateAccountUsecase,
    private readonly accountAppService: AccountAppService,
  ) {}

  @Get('me')
  async me(@CurrentSession() session: SessionInterface) {
    const accountId = session.getAccountId();
    if (!accountId) {
      return null;
    }
    const [account] = await this.accountAppService.loadAccountsWithHobbies([
      accountId,
    ]);
    if (!account) return null;
    return flattenHobbies(account);
  }

  @Patch('me')
  async updateMe(
    @CurrentSession() session: SessionInterface,
    @Body() input: UpdateAccountInput,
  ) {
    const accountId = session.getAccountId();
    await this.updateAccountUsecase.exec(accountId!, input);
  }
}
