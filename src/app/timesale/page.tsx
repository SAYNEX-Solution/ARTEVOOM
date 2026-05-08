'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation/Navigation'
import styles from './TimeSale.module.css'

const TimeSalePage = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 45,
    seconds: 30
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        return prev
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <main>
      <Navigation />
      <section className={styles.saleSection}>
        <div className={`${styles.saleBanner} glass-effect`}>
          <span className={styles.label}>LIMITED TIME OFFER</span>
          <h1 className="premium-serif">TIME SALE</h1>
          <p>오직 지금만 만날 수 있는 특별한 혜택</p>
          
          <div className={styles.countdown}>
            <div className={styles.timeBox}>
              <span>{String(timeLeft.hours).padStart(2, '0')}</span>
              <label>HOURS</label>
            </div>
            <div className={styles.timeBox}>
              <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
              <label>MINS</label>
            </div>
            <div className={styles.timeBox}>
              <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
              <label>SECS</label>
            </div>
          </div>
        </div>

        <div className={styles.grid}>
          {/* Example Sale Product */}
          <div className={`${styles.card} glass-effect`}>
            <div className={styles.badge}>30% OFF</div>
            <div className={styles.imageBox}>
              <div className={styles.placeholder}>Nuit Blanche</div>
            </div>
            <div className={styles.info}>
              <h3 className="premium-serif">Nuit Blanche</h3>
              <div className={styles.priceRow}>
                <span className={styles.originalPrice}>135,000원</span>
                <span className={styles.salePrice}>94,500원</span>
              </div>
              <button className="btn-premium btn-filled" style={{ width: '100%', marginTop: '20px' }}>지금 구매하기</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default TimeSalePage
