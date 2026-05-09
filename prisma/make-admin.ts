import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.updateMany({
    data: {
      role: 'ADMIN',
    },
  });
  console.log('All users set to ADMIN.');
}

main().finally(() => prisma.$disconnect());
