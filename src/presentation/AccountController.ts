import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { CurrentSession } from './session';
import { SessionInterface } from '../application/auth/SessionInterface';
import { AccountRepository } from '../infra/AccountRepository';
import { Account } from '../domain/Account';
import {
  UpdateAccountInput,
  UpdateAccountUsecase,
} from '../application/account/UpdateAccountUsecase';
import { AccountAppService } from '../application/account/AccountAppService';
import { LoadDashboardUsecase } from '../application/account/LoadDashboardUsecase';
import { Unauthorized } from './authDecorators';
import { hashSync } from 'bcrypt';
import { HashedIconPicker } from '../infra/HashedIconPicker';

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
  privateHobbies?: string[];
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
    private readonly loadDashboardUsecase: LoadDashboardUsecase,
    private readonly iconPicker: HashedIconPicker,
  ) {}

  @Unauthorized()
  @Post('/')
  async create(@Body() input: UpdateAccountInput) {
    const account = Account.create({
      name: input.displayName,
      ...input,
      password: 'password',
      affiliation: null,
    });
    await this.accountRepository.save(account);
    await this.updateAccountUsecase.exec(account.id, input);
  }

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

  @Get('fellows')
  async fellows(@CurrentSession() session: SessionInterface) {
    const result = await this.loadDashboardUsecase.load(
      session.getAccountId()!,
    );
    return {
      byHobby: result.byHobby.map((hobby) => ({
        hobby: hobby.hobby,
        isPublic: hobby.isPublic,
        accounts: hobby.accounts.map(flattenHobbies).map((account) => ({
          ...account,
          icon: `http://localhost:3000/api/assets/icons/${encodeURIComponent(this.iconPicker.pickIcon(account.id))}`,
        })),
      })),
    };
  }
}
