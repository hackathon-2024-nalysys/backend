import { Injectable } from '@nestjs/common';
import { PrismaService } from './PrismaService';
import { Account } from '../domain/Account';

@Injectable()
export class AccountRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async save(account: Account) {
    await this.prismaService.account.upsert({
      where: { id: account.id },
      update: {
        name: account.name,
        password: account.password,
        displayName: account.displayName,
        affiliation: account.affiliation,
      },
      create: {
        id: account.id,
        name: account.name,
        password: account.password,
        displayName: account.displayName,
        affiliation: account.affiliation,
      },
    });
  }

  async saveHobbyAssociation(
    accountId: string,
    publicHobbies: string[],
    privateHobbies: string[],
  ) {
    await this.prismaService.$transaction(async (prisma) => {
      await prisma.accountHobby.deleteMany({
        where: { accountId },
      });

      const publicHobbyAssociations = publicHobbies.map((hobbyName) => ({
        accountId,
        hobbyName,
        isPublic: true,
      }));
      const privateHobbyAssociations = privateHobbies.map((hobbyName) => ({
        accountId,
        hobbyName,
        isPublic: false,
      }));

      await prisma.accountHobby.createMany({
        data: [...publicHobbyAssociations, ...privateHobbyAssociations],
      });
    });
  }

  async findByIdsWithHobbies(
    id: string[],
  ): Promise<
    { account: Account; hobbies: { name: string; isPublic: boolean }[] }[]
  > {
    const result = await this.prismaService.account.findMany({
      where: { id: { in: id } },
      include: {
        hobbies: {
          select: { hobbyName: true, isPublic: true },
        },
      },
    });
    return result.map((raw) => ({
      account: new Account(raw),
      hobbies: raw.hobbies.map((h) => ({
        name: h.hobbyName,
        isPublic: h.isPublic,
      })),
    }));
  }

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
