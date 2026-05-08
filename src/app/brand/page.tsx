import Navigation from '@/components/Navigation/Navigation'
import Footer from '@/components/Footer/Footer'
import PageHeader from '@/components/PageHeader/PageHeader'
import styles from './Brand.module.css'

export default function BrandPage() {
  return (
    <main style={{ background: '#121110', color: '#e8e2d9', minHeight: '100vh' }}>
      <Navigation />
      
      <div className={styles.container}>
        {/* Top Section */}
        <section className={styles.topSection}>
          <div className={styles.textSide}>
            <h2>ABOUT<br />ARTEVOOM</h2>
            <p>
              ARTEVOOM은 자연과 도시의 경계에서<br />
              영감을 받아, 시간이 지나도 잊히지 않는<br />
              향기를 창조하는 니치 퍼퓸 브랜드입니다.
            </p>
            <p>
              우리는 향을 단순한 제품이 아닌,<br />
              기억과 감정을 담는 예술로 생각합니다.
            </p>
            <p>
              모든 향은 자연의 원료와 정교한 조향을 통해<br />
              세심하게 완성되며, 당신의 일상에 특별한<br />
              순간을 선사합니다.
            </p>
          </div>
          <div className={styles.imageSide}>
            <img src="/images/brand_hero.png" alt="Artevoom Forest" />
            <h1>ARTEVOOM</h1>
          </div>
        </section>

        {/* Bottom Section */}
        <section className={styles.cardsGrid}>
          <div className={styles.card}>
            <div className={styles.cardImage}>
              <img src="/images/brand_nature.png" alt="Inspired by nature" />
            </div>
            <h3>INSPIRED BY NATURE</h3>
            <p>자연에서 영감을 받은 향</p>
          </div>
          
          <div className={styles.card}>
            <div className={styles.cardImage}>
              <img src="/images/brand_craft.png" alt="Artisanal craftsmanship" />
            </div>
            <h3>ARTISANAL CRAFTSMANSHIP</h3>
            <p>장인 정신으로 완성된 조향</p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardImage}>
              <img src="/images/product1.png" alt="Timeless elegance" />
            </div>
            <h3>TIMELESS ELEGANCE</h3>
            <p>시간이 지나도 변치 않는 우아함</p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardImage}>
              <img src="/images/story.png" alt="From forest to city" />
            </div>
            <h3>FROM FOREST TO CITY</h3>
            <p>숲과 도시를 잇는 향기</p>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
