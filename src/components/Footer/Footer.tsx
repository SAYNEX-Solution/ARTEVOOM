'use client'

import Link from 'next/link'
import { Camera, MessageSquare } from 'lucide-react'
import styles from './Footer.module.css'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.topSection}>
        <h2 className="brand-font">ARTEVOOM</h2>
        <p className={styles.tagline}>Born at the edge of the forest, it lingers through the city night.</p>
      </div>

      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.column}>
            <h3>SHOP</h3>
            <ul>
              <li><Link href="/products">ALL PRODUCTS</Link></li>
            </ul>
          </div>

          <div className={styles.column}>
            <h3>BRAND</h3>
            <ul>
              <li><Link href="/brand">ABOUT US</Link></li>
              <li><Link href="/brand">OUR STORY</Link></li>
            </ul>
          </div>
          <div className={styles.column}>
            <h3>CONTACT</h3>
            <ul>
              <li><a href="mailto:griffin930505@naver.com">GRIFFIN930505@NAVER.COM</a></li>
              <li className={styles.socials}>
                <button 
                  aria-label="Instagram" 
                  onClick={() => alert('인스타그램은 곧 오픈 예정입니다.')}
                >
                  <Camera size={20} />
                </button>
                <button 
                  aria-label="Kakao"
                  onClick={() => window.open('https://pf.kakao.com', '_blank')}
                >
                  <MessageSquare size={20} />
                </button>
              </li>
            </ul>
          </div>
        </div>

      </div>

      <div className={styles.bottomBar}>
        <div className={styles.copyright}>
          &copy; 2026 ARTEVOOM. ALL RIGHTS RESERVED.
        </div>
        <div className={styles.region}>
          KOREA (KRW) ∨
        </div>
      </div>
    </footer>
  )
}

export default Footer
