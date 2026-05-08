'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Minus, Truck, Package, RotateCcw } from 'lucide-react'
import { useCartStore } from '@/lib/store/useCartStore'
import styles from './ProductDetail.module.css'

interface ProductProps {
  product: {
    id: string;
    name: string;
    subName?: string;
    price: number;
    image: string;
    capacity: string;
  }
}

const ProductDetail = ({ product }: ProductProps) => {
  const [quantity, setQuantity] = useState(1)
  const { addItem, toggleCart } = useCartStore()

  const handleAddToCart = () => {
    addItem({
      ...product,
      quantity
    })
    toggleCart()
  }

  return (
    <div className={styles.productDetail}>
      {/* 1. Main Product Section */}
      <div className={styles.mainSection}>
        <div className={styles.productImage}>
          <img src="/images/product2.png" alt="impasto monolith" />
        </div>
          <div className={styles.productBuyBox}>
          <div className={styles.buyBoxContent}>
            <span className={styles.subName}>{product.subName}</span>
            <h2 className="brand-font">{product.name}</h2>
            <p className={styles.shortDesc}>
              깊이 있는 우디, 섬세한 여운<br />
              나만의 공간을 채우는 프리미엄 섬유 향수<br />
              옷깃에 스며든 가장 자연스러운 향기
            </p>
            
            <div className={styles.priceRow}>
              <span className={styles.price}>₩{product.price.toLocaleString()}</span>
              <div className={styles.metaInfo}>
                <p>용량: 50ml / Eau de Parfum</p>
                <p>타입: 스프레이</p>
              </div>
            </div>

            <div className={styles.actions}>
              <div className={styles.quantitySelector}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus size={16} />
                </button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>
                  <Plus size={16} />
                </button>
              </div>
              <button className={styles.addBtn} onClick={handleAddToCart}>
                ADD TO BAG
              </button>
            </div>

            <div className={styles.benefits}>
              <div className={styles.benefitItem}>
                <Truck size={20} />
                <div>
                  <p>무료 배송</p>
                  <span>50,000원 이상 구매 시</span>
                </div>
              </div>
              <div className={styles.benefitItem}>
                <Package size={20} />
                <div>
                  <p>프리미엄 패키지</p>
                  <span>전용 박스 & 쇼핑백 제공</span>
                </div>
              </div>
              <div className={styles.benefitItem}>
                <RotateCcw size={20} />
                <div>
                  <p>간편한 교환/반품</p>
                  <span>7일 이내 교환/반품 가능</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Story Section */}
      <div className={styles.storySection}>
        <div className={styles.storyText}>
          <h3 className="brand-font">Born at the edge of the forest,<br />it lingers through the city night.</h3>
          <div className={styles.line} />
          <p>
            거칠게 발린 유화의 질감인 임파스토기법으로 겹겹이 쌓인 나무 블록의 형태에서 영감을 받은 향.<br />
            거친 붓터치 속에, 숨겨진 부드러운 향을 찾는 여정.<br />
            한 번에 완성되지 않는 작품과 같이 한 번에 완성되지 않는 향.
          </p>
        </div>
        <div className={styles.storyImage}>
          <img src="/images/story.png" alt="Forest perfume" />
        </div>
      </div>

      {/* 3. Fragrance Notes Section */}
      <div className={styles.notesSection}>
        <div className={styles.notesContainer}>
          <div className={styles.notesList}>
            <h3 className="brand-font">FRAGRANCE NOTES</h3>
            <div className={styles.noteItem}>
              <div className={styles.dot} />
              <div>
                <h4>TOP</h4>
                <p>Bergamot</p>
              </div>
            </div>
            <div className={styles.noteItem}>
              <div className={styles.dot} />
              <div>
                <h4>HEART</h4>
                <p>Lavender</p>
              </div>
            </div>
            <div className={styles.noteItem}>
              <div className={styles.dot} />
              <div>
                <h4>BASE</h4>
                <p>Amber</p>
              </div>
            </div>
          </div>
          <div className={styles.notesGallery}>
            <div className={styles.galleryItem}>
              <img src="/images/bergamot.png" alt="Bergamot" />
              <span>TOP</span>
            </div>
            <div className={styles.galleryItem}>
              <img src="/images/lavender.png" alt="Lavender" />
              <span>HEART</span>
            </div>
            <div className={styles.galleryItem}>
              <img src="/images/amber.png" alt="Amber" />
              <span>BASE</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Product Info Section */}
      <div className={styles.infoSection}>
        <div className={styles.infoContainer}>
          <div className={styles.infoImage}>
            <img src="/images/product2.png" alt="Package" />
          </div>
          <div className={styles.infoTable}>
            <h3 className="brand-font">PRODUCT INFORMATION</h3>
            <table className={styles.table}>
              <tbody>
                <tr><th>신고번호</th><td>CB23-12-1115</td></tr>
                <tr><th>품목</th><td>방향제</td></tr>
                <tr><th>제품명</th><td>데일리엔롱스프레이_임파스토 모노리스</td></tr>
                <tr><th>용도</th><td>일반용</td></tr>
                <tr><th>제형</th><td>분무기형</td></tr>
                <tr><th>제조연월</th><td>별도표기</td></tr>
                <tr><th>유통기한</th><td>제조일로부터 10개월</td></tr>
                <tr><th>용량</th><td>50ml</td></tr>
                <tr><th>제조자, 주소, 연락처</th><td>아로마팰리스(AROMA PALACE), (18271) 경기도 화성시 남양읍 역골동로 48-10, 1층, 101호. 0507-1479-1266</td></tr>
                <tr><th>주요물질</th><td>향수베이스(에탄올 등), 향료(아이소프로필 미리스테이트 등)</td></tr>
                <tr><th>알레르기 물질</th><td>리날로올, 리모넨, 신남알, 제라니올, 쿠마린</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
