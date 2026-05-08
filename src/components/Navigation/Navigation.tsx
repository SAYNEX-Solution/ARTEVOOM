'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession, signOut } from "next-auth/react"
import { useCartStore } from '@/lib/store/useCartStore'
import styles from './Navigation.module.css'

const Navigation = () => {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { toggleCart, items } = useCartStore()

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const baseLinks = [
    { name: 'HOME', href: '/' },
    { name: 'COLLECTION', href: '/products' },
    { name: 'BRAND', href: '/brand' },
  ]

  const navLinks = session 
    ? [...baseLinks, { name: 'MY PAGE', href: '/mypage' }, { name: 'LOGOUT', href: '#', onClick: () => signOut() }]
    : [...baseLinks, { name: 'LOGIN', href: '/login' }]


  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/" className="brand-font">ARTEVOOM</Link>
        </div>
        
        <ul className={styles.links}>
          {navLinks.map((link) => (
            <li key={link.name}>
              {link.onClick ? (
                <a href="#" onClick={(e) => { e.preventDefault(); link.onClick(); }}>{link.name}</a>
              ) : (
                <Link href={link.href}>{link.name}</Link>
              )}
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          <button className={styles.iconBtn} aria-label="Search"><Search size={20} strokeWidth={1.5} /></button>
          <Link href={session ? "/mypage" : "/login"} className={styles.iconBtn} aria-label="Profile">
            <User size={20} strokeWidth={1.5} />
          </Link>
          <button className={styles.iconBtn} aria-label="Cart" onClick={toggleCart}>
            <ShoppingCart size={20} strokeWidth={1.5} />
            {itemCount > 0 && <span className={styles.cartBadge}>{itemCount}</span>}
          </button>
          <button className={styles.menuBtn} onClick={() => setIsOpen(true)} aria-label="Menu">
            <Menu size={24} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.overlay}
            onClick={() => setIsOpen(false)}
          >
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={styles.mobileDrawer}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.drawerHeader}>
                <span className="brand-font">ARTEVOOM</span>
                <button onClick={() => setIsOpen(false)}><X size={24} /></button>
              </div>
              <ul className={styles.mobileLinks}>
                {navLinks.map((link) => (
                  <li key={link.name}>
                    {link.onClick ? (
                      <a href="#" onClick={(e) => { e.preventDefault(); link.onClick(); setIsOpen(false); }}>{link.name}</a>
                    ) : (
                      <Link href={link.href} onClick={() => setIsOpen(false)}>{link.name}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navigation

