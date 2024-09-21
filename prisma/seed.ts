import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { v5 as uuidv5 } from 'uuid';

const ACCOUNT_IDS = [...new Array(5).keys()].map((n) =>
  uuidv5(`Account${n}`, uuidv5.DNS)
);

const prisma = new PrismaClient();

async function main() {
  await prisma.account.upsert({
    where: { id: ACCOUNT_IDS[0] },
    update: {},
    create: {
      id: ACCOUNT_IDS[0],
      name: 'user',
      displayName: '田中 太郎',
      password: hashSync('password', 10),
      affiliation: null,
    },
  });
}

main()
  .then(async () => {
    console.log('Seed completed');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
