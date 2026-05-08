export const dynamic = "force-dynamic";

import Navigation from '@/components/Navigation/Navigation'
import Footer from '@/components/Footer/Footer'
import PageHeader from '@/components/PageHeader/PageHeader'
import ProductDetail from '@/components/ProductDetail/ProductDetail'
import prisma from '@/lib/prisma'

export default async function ProductsPage() {
  const dbProduct = await prisma.product.findFirst({
    orderBy: { createdAt: 'desc' }
  });

  if (!dbProduct) return <div>상품 정보가 없습니다.</div>

  const image = (() => {
    try {
      const parsed = JSON.parse(dbProduct.images);
      return Array.isArray(parsed) ? parsed[0] : dbProduct.images;
    } catch (e) {
      return dbProduct.images || '/images/product2.png';
    }
  })();

  const product = {
    id: dbProduct.id,
    name: dbProduct.name,
    subName: dbProduct.category,
    price: dbProduct.price,
    image: image,
    capacity: '50ml'
  }

  return (
    <main style={{ background: '#121110' }}>
      <Navigation />
      <PageHeader 
        title="COLLECTION" 
        description="자연의 원료와 깊은 예술적 감성을 담은 아르보움의 시그니처 컬렉션"
      />
      <ProductDetail product={product} />
      <Footer />
    </main>
  )
}
