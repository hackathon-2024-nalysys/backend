import { Controller, Get } from '@nestjs/common';
import { CurrentSession } from './session';
import { SessionInterface } from '../application/auth/SessionInterface';
import { AccountRepository } from '../infra/AccountRepository';
import { Account } from '../domain/Account';

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

@Controller('/v1/accounts/')
export class AccountController {
  constructor(private readonly accountRepository: AccountRepository) {}

  @Get('me')
  async me(@CurrentSession() session: SessionInterface) {
    const accountId = session.getAccountId();
    if (!accountId) {
      return null;
    }
    const account = await this.accountRepository.findById(accountId);
    return account ? sanitizeAccount(account) : null;
  }
}
