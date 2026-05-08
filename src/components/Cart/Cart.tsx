'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, ShoppingBag, Search, User } from 'lucide-react'
import { useCartStore } from '@/lib/store/useCartStore'
import styles from './Cart.module.css'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const Cart = () => {

  const router = useRouter()
  const { items, isOpen, toggleCart, removeItem, updateQuantity, syncItems } = useCartStore()
  const [mounted, setMounted] = useState(false)

  const handleCheckout = () => {
    toggleCart()
    router.push('/checkout')
  }

  useEffect(() => {
    setMounted(true)
    
    // 장바구니 데이터 실시간 동기화 (가격, 이름 등)
    const syncCart = async () => {
      if (items.length === 0) return;
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        const dbProducts = await res.json();
        if (Array.isArray(dbProducts)) {
          syncItems(dbProducts);
        }
      } catch (e) {
        console.error("Cart sync failed", e);
      }
    };
    
    if (isOpen) syncCart();
  }, [isOpen])

  if (!mounted) return null

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={styles.overlay}
          onClick={toggleCart}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={styles.drawer}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.header}>
              <div className={styles.headerTop}>
                <div className={styles.headerIcons}>
                  <Search size={20} strokeWidth={1.5} />
                  <User size={20} strokeWidth={1.5} />
                  <div className={styles.cartIconWrapper}>
                    <ShoppingBag size={20} strokeWidth={1.5} />
                    <span className={styles.iconBadge}>{items.length}</span>
                  </div>
                </div>
                <button className={styles.closeBtn} onClick={toggleCart}>
                  <X size={24} strokeWidth={1.5} />
                </button>
              </div>
              <div className={styles.headerTitle}>
                <h2 className="brand-font">MY CART <span className={styles.countBadge}>{items.length}</span></h2>
                <p>장바구니에 담긴 상품</p>
              </div>
            </div>

            <div className={styles.items}>
              {items.length === 0 ? (
                <div className={styles.emptyCart}>
                  <ShoppingBag size={48} strokeWidth={1} />
                  <p>Your bag is empty</p>
                  <button onClick={toggleCart} className={styles.removeBtn}>
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className={styles.item}>
                    <div className={styles.itemImage}>
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className={styles.itemInfo}>
                      <div className={styles.itemHeader}>
                        <div>
                          <h3>{item.subName || item.name}</h3>
                          <span className={styles.itemType}>EAU DE PARFUM 50ml</span>
                        </div>
                        <button className={styles.itemRemove} onClick={() => removeItem(item.id)}>
                          <X size={16} />
                        </button>
                      </div>
                      <div className={styles.itemBottom}>
                        <span className={styles.price}>₩{item.price.toLocaleString()}</span>
                        <div className={styles.quantity}>
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                            <Minus size={12} />
                          </button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className={styles.footer}>
                <div className={styles.summary}>
                  <div className={styles.summaryRow}>
                    <span>상품 {items.length}개</span>
                    <span>₩{total.toLocaleString()}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>배송비</span>
                    <span>₩0</span>
                  </div>
                </div>
                <div className={styles.totalRow}>
                  <span className={styles.totalLabel}>합계</span>
                  <span className={styles.totalAmount}>₩{total.toLocaleString()}</span>
                </div>
                <div className={styles.footerButtons}>
                  <button className={styles.orderBtn} onClick={handleCheckout}>주문하기</button>
                  <button className={styles.viewCartBtn}>장바구니 보기</button>
                </div>

                <div className={styles.freeShippingInfo}>
                  <div className={styles.infoIcon}>ⓘ</div>
                  <span>10만원 이상 구매 시 무료배송</span>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Cart
