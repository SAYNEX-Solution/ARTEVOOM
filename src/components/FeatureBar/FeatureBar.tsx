'use client'

import { Leaf, FlaskConical, Droplet, Gift } from 'lucide-react'
import styles from './FeatureBar.module.css'

const features = [
  {
    icon: <Leaf size={22} strokeWidth={1.5} />,
    title: 'INSPIRED BY NATURE',
    subtitle: '자연에서 영감을 받다',
  },
  {
    icon: <FlaskConical size={22} strokeWidth={1.5} />,
    title: 'EXCLUSIVE SCENTS',
    subtitle: 'ARTEVOOM만의 독창적인 향',
  },
  {
    icon: <Droplet size={22} strokeWidth={1.5} />,
    title: 'PREMIUM INGREDIENTS',
    subtitle: '엄선된 프리미엄 원료',
  },
  {
    icon: <Gift size={22} strokeWidth={1.5} />,
    title: 'SUSTAINABLE BEAUTY',
    subtitle: '지속 가능한 아름다움',
  },
]

const FeatureBar = () => {
  return (
    <section className={styles.featureBar}>
      <div className={styles.container}>
        {features.map((feature, index) => (
          <div key={index} className={styles.featureItem}>
            <div className={styles.icon}>{feature.icon}</div>
            <div className={styles.text}>
              <h3>{feature.title}</h3>
              <p>{feature.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FeatureBar
