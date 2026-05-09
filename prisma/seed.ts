import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Clearing and seeding single product...');

  await prisma.product.deleteMany();

  await prisma.product.create({
    data: {
      name: "IMPASTO MONILITH",
      price: 45900,
      description: "깊이 있는 우디, 섬세한 여운을 남기는 시그니처 향수",
      category: "Signature",
      stock: 100,
      images: "/images/product2.png",
      topNotes: "Bergamot",
      middleNotes: "Lavender",
      baseNotes: "Amber"
    },
  });

  console.log('Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
