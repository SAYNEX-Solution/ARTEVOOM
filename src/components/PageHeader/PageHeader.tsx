'use client'

import { motion } from 'framer-motion'
import styles from './PageHeader.module.css'

interface PageHeaderProps {
  title: string
  description: string
}

const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <section className={styles.header}>
      <div className={styles.background}>
        <img 
          src="/images/background.png" 
          alt="Page Background" 
          className={styles.bgImage}
        />
        <div className={styles.overlay} />
      </div>
      
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className={styles.content}
        >
          <h1 className="brand-font">{title}</h1>
          <p className={styles.description}>{description}</p>
        </motion.div>
      </div>
    </section>
  )
}

export default PageHeader
