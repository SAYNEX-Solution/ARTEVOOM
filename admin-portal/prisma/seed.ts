import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Business Info
  await prisma.businessInfo.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      companyName: 'ARTEVOOM',
      representative: '김도윤',
      address: '서울특별시 강남구 테헤란로 427, 12층',
      businessNum: '104-86-12345',
      email: 'contact@artevoom.com',
      phone: '02-1234-5678',
    },
  })

  // Admin User (Password: admin123! - hashed version would be better, but for now plaintext or simple hash)
  // In a real app, use bcrypt to hash passwords
  await prisma.user.upsert({
    where: { email: 'admin@artevoom.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@artevoom.com',
      password: 'admin123!', // Note: Use hashing in real implementation
      role: 'ADMIN',
    },
  })

  // Products
  const products = [
    {
      name: 'La Mémoire',
      description: 'ARTEVOOM의 시그니처 향수로, 숲의 깊은 울림과 꽃의 섬세함을 담았습니다. 시간이 멈춘 듯한 평온한 기억을 선사합니다.',
      price: 129000,
      category: 'Woody Floral',
      images: '/images/perfume1.jpg',
      topNotes: '베르가못, 레몬, 만다린',
      middleNotes: '로즈, 자스민, 프리지아',
      baseNotes: '머스크, 우디, 앰버',
      stock: 50,
    },
    {
      name: 'Nuit Blanche',
      description: '하얀 밤의 신비로움을 담은 스파이시 앰버 향수. 차가운 공기 속에서 느껴지는 따뜻한 온기를 표현했습니다.',
      price: 135000,
      category: 'Spicy Amber',
      images: '/images/perfume2.jpg',
      topNotes: '핑크 페퍼, 카다멈',
      middleNotes: '인센스, 아이리스',
      baseNotes: '앰버, 바닐라, 샌달우드',
      stock: 30,
    },
    {
      name: 'Rosé d\'Aube',
      description: '새벽 이슬을 머금은 장미 정원의 싱그러움. 아침의 시작을 알리는 맑고 투명한 향기입니다.',
      price: 119000,
      category: 'Fresh Floral',
      images: '/images/perfume3.jpg',
      topNotes: '그린 애플, 민트',
      middleNotes: '메이 로즈, 피오니',
      baseNotes: '화이트 머스크, 시더우드',
      stock: 45,
    },
    {
      name: 'Bois Noir',
      description: '검은 숲의 묵직한 카리스마. 다크 우드와 레더의 조화가 만들어내는 강렬한 존재감의 향수입니다.',
      price: 142000,
      category: 'Dark Woody',
      images: '/images/perfume4.jpg',
      topNotes: '블랙 페퍼, 자몽',
      middleNotes: '가죽, 팔로 산토',
      baseNotes: '과야크 우드, 베티버, 패출리',
      stock: 20,
    },
  ]

  for (const product of products) {
    await prisma.product.create({
      data: product,
    })
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
