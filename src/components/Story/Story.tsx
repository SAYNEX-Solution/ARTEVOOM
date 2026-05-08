'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import styles from './Story.module.css'

const Story = () => {
  return (
    <section className={styles.story}>
      <div className={styles.container}>
        <div className={styles.imageSection}>
          <img 
            src="/images/story.png" 
            alt="ARTEVOOM Story" 
          />
        </div>
        
        <div className={styles.contentSection}>
          <div className={styles.textWrapper}>
            <h2 className="brand-font">STORY</h2>
            <div className={styles.line} />
            <p className={styles.description}>
              경계에 선 나무, 손끝으로 빚어낸 향기,<br />
              그 안에 담긴 ARTEVOOM의 이야기를 전합니다.
            </p>
            <Link href="/brand">
              <button className={styles.readBtn}>READ MORE</button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Story
