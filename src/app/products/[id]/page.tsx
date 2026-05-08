import prisma from '@/lib/prisma'
import Navigation from '@/components/Navigation/Navigation'
import { ShoppingCart, Heart, ChevronDown, Minus, Plus } from 'lucide-react'
import styles from './ProductDetail.module.css'

export default async function ProductDetail(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params;
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  })

  if (!product) return <div>상품을 찾을 수 없습니다.</div>

  return (
    <main>
      <Navigation />
      <section className={styles.detailSection}>
        <div className={styles.breadcrumb}>
          홈 / 상품 / {product.name}
        </div>
        
        <div className={styles.container}>
          <div className={styles.imageArea}>
            <div className={styles.mainImage}>
              <div className={styles.placeholder}>{product.name}</div>
            </div>
          </div>
          
          <div className={styles.infoArea}>
            <h1 className="premium-serif">{product.name}</h1>
            <span className={styles.engName}>{product.category}</span>
            <p className={styles.price}>{product.price.toLocaleString()}원</p>
            
            <div className={styles.options}>
              <div className={styles.optionGroup}>
                <label>용량</label>
                <div className={styles.select}>
                  50ml <ChevronDown size={14} />
                </div>
              </div>
              
              <div className={styles.quantityGroup}>
                <button className={styles.qBtn}><Minus size={14} /></button>
                <span className={styles.qVal}>1</span>
                <button className={styles.qBtn}><Plus size={14} /></button>
              </div>
            </div>

            <div className={styles.mainActions}>
              <button className={styles.cartBtn}>장바구니</button>
              <button className={styles.wishBtn}><Heart size={20} /></button>
              <button className={styles.buyBtn}>바로구매</button>
            </div>

            <div className={styles.notesSection}>
              <h3>향 노트</h3>
              <div className={styles.noteGrid}>
                <div className={styles.noteItem}>
                  <div className={styles.noteIcon}>TOP</div>
                  <div className={styles.noteText}>
                    <strong>TOP</strong>
                    <p>{product.topNotes}</p>
                  </div>
                </div>
                <div className={styles.noteItem}>
                  <div className={styles.noteIcon}>MID</div>
                  <div className={styles.noteText}>
                    <strong>MIDDLE</strong>
                    <p>{product.middleNotes}</p>
                  </div>
                </div>
                <div className={styles.noteItem}>
                  <div className={styles.noteIcon}>BASE</div>
                  <div className={styles.noteText}>
                    <strong>BASE</strong>
                    <p>{product.baseNotes}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.productDesc}>
              <h3>제품 설명</h3>
              <p>{product.description}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
