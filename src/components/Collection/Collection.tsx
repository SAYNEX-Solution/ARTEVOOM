'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/lib/store/useCartStore'
import styles from './Collection.module.css'

const Collection = () => {
  const { addItem, toggleCart } = useCartStore()
  const [dbProducts, setDbProducts] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/products', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setDbProducts(data.slice(0, 1)) // 메인에는 대표 1개만
      })
      .catch(err => console.error(err))
  }, [])

  const products = dbProducts.map(p => {
    let image = '/images/product1.png';
    try {
      const parsed = JSON.parse(p.images);
      image = Array.isArray(parsed) ? parsed[0] : p.images;
    } catch (e) {
      image = p.images || '/images/product1.png';
    }

    return {
      id: p.id,
      name: p.name,
      type: p.category || 'EAU DE PARFUM',
      price: `₩${p.price.toLocaleString()}`,
      rawPrice: p.price,
      image: image,
    };
  })

  const handleQuickAdd = (e: React.MouseEvent, product: any) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: product.id,
      name: 'ARTEVOOM',
      subName: product.name,
      price: product.rawPrice,
      image: product.image,
      quantity: 1
    })
    toggleCart()
  }

  return (
    <section className={styles.collection}>
      <div className={styles.background}>
        <div className={styles.bgOverlay} />
      </div>
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <div className={styles.header}>
            <h2 className="brand-font">{products[0]?.name || 'COLLECTION'}</h2>
            <div className={styles.line} />
            <p className={styles.description}>
              자연의 원료와 깊은 예술적 감성을 담은<br />
              {products[0]?.name || 'ARTEVOOM'}의 시그니처 컬렉션을 만나보세요.
            </p>
            <Link href="/products">
              <button className={styles.viewBtn}>VIEW ALL</button>
            </Link>
          </div>
        </div>

        <div className={styles.details}>
          <div className={styles.noteSection}>
            <span className={styles.noteLabel}>TOP NOTE</span>
            <p className={styles.noteText}>Bergamot</p>
          </div>
          <div className={styles.noteSection}>
            <span className={styles.noteLabel}>HEART NOTE</span>
            <p className={styles.noteText}>Lavender</p>
          </div>
          <div className={styles.noteSection}>
            <span className={styles.noteLabel}>BASE NOTE</span>
            <p className={styles.noteText}>Amber</p>
          </div>
        </div>

        <div className={styles.featuredProduct}>
          {products.map((product) => (
            <Link href={`/products`} key={product.id}>
              <motion.div 
                className={styles.productCard}
                whileHover={{ y: -5 }}
              >
                <div className={styles.imageWrapper}>
                  <img src={product.image} alt={product.name} />
                  <div className={styles.info}>
                    <h3 className={styles.name}>{product.name}</h3>
                    <span className={styles.type}>{product.type}</span>
                    <span className={styles.price}>{product.price}</span>
                  </div>
                  <button 
                    className={styles.quickAdd} 
                    onClick={(e) => handleQuickAdd(e, product)}
                  >
                    <ShoppingBag size={18} />
                    <span>ADD TO BAG</span>
                  </button>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Collection
