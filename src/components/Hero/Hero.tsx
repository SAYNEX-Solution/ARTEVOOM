'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import styles from './Hero.module.css'

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.background}>
        <img 
          src="/images/background.png" 
          alt="Premium Perfume"
          className={styles.image}
        />
        <div className={styles.overlay} />
      </div>

      <div className={styles.container}>
        <div className={styles.content}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className={styles.textWrapper}
          >
            <span className={styles.subtitle}>impasto monolith</span>
            <h1 className="brand-font">ARTEVOOM</h1>
            <p className={styles.description}>
              숲의 경계에서 태어난 향기, 도시의 밤을 만나다.
            </p>
            <div className={styles.cta}>
              <Link href="/products">
                <button className="btn-luxury">
                  DISCOVER COLLECTION
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

  )
}

export default Hero

