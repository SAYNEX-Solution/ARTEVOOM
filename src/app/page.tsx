import Hero from '@/components/Hero/Hero'
import FeatureBar from '@/components/FeatureBar/FeatureBar'
import Collection from '@/components/Collection/Collection'
import Story from '@/components/Story/Story'
import Footer from '@/components/Footer/Footer'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <Hero />
      <FeatureBar />
      <Collection />
      <Story />
      <Footer />
    </main>
  )
}
