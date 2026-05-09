import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'zjsqpstus0620@gmail.com';
  const newPassword = '12341234';
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword }
  });

  console.log(`Password for ${email} reset to: ${newPassword}`);
}

main().finally(() => prisma.$disconnect());
