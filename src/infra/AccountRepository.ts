import { Injectable } from '@nestjs/common';
import { PrismaService } from './PrismaService';
import { Account } from '../domain/Account';

@Injectable()
export class AccountRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: string) {
    const raw = await this.prismaService.account.findUnique({
      where: { id },
    });
    return raw ? new Account(raw) : null;
  }

  async findByName(name: string) {
    const raw = await this.prismaService.account.findFirst({
      where: { name },
    });
    return raw ? new Account(raw) : null;
  }
}
