import { IsNotEmpty, IsString } from 'class-validator';
import { AccountRepository } from '../../infra/AccountRepository';
import { SessionInterface } from './SessionInterface';
import { Injectable } from '@nestjs/common';

export class LoginInput {
  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  password!: string;
}

@Injectable()
export class LoginUsecase {
  constructor(private accountRepo: AccountRepository) {}

  async login(session: SessionInterface, input: LoginInput): Promise<boolean> {
    const account = await this.accountRepo.findByName(input.name);
    if (account == null) {
      return false;
    }
    if (account.checkPassword(input.password) === false) {
      return false;
    }

    await session.setAccount(account.id);
    return true;
  }
}
