'use client'

import { useState, useEffect } from "react";
import { 
  LayoutDashboard, Package, ShoppingBag, Users, Clock, 
  MessageSquare, Settings, BarChart3, Star, Tag, Database, 
  FileEdit, ShieldCheck, Bell, Menu, User, LogOut 
} from "lucide-react";
import Link from "next/link";
import "./globals.css";
import styles from "./Admin.module.css";

import NotificationBell from "./NotificationBell";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="ko">
      <body>
        <div className={styles.adminContainer}>
          {/* Sidebar */}
          <aside className={`${styles.sidebar} ${mounted && isMobileMenuOpen ? styles.sidebarOpen : ''}`}>
            <div className={styles.logo}>
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                <h1>ARTEVOOM</h1>
                <span>ADMIN DASHBOARD</span>
              </Link>
            </div>

            <nav className={styles.nav}>
              <Link href="/" className={styles.navItem} onClick={() => setIsMobileMenuOpen(false)}>
                <LayoutDashboard size={18} /> 대시보드
              </Link>
              <Link href="/orders" className={styles.navItem} onClick={() => setIsMobileMenuOpen(false)}>
                <ShoppingBag size={18} /> 주문 관리
              </Link>
              <Link href="/products" className={styles.navItem} onClick={() => setIsMobileMenuOpen(false)}>
                <Package size={18} /> 상품 관리
              </Link>
              <Link href="/users" className={styles.navItem} onClick={() => setIsMobileMenuOpen(false)}>
                <Users size={18} /> 고객 관리
              </Link>
              <Link href="/analytics" className={styles.navItem} onClick={() => setIsMobileMenuOpen(false)}>
                <BarChart3 size={18} /> 통계 분석
              </Link>
              <Link href="/logs" className={styles.navItem} onClick={() => setIsMobileMenuOpen(false)}>
                <ShieldCheck size={18} /> 로그 관리
              </Link>
            </nav>

            <div className={styles.sidebarFooter}>
              <div className={styles.adminProfile}>
                <div className={styles.adminAvatar}>
                  <User size={20} />
                </div>
                <div className={styles.adminInfo}>
                  <p>관리자</p>
                  <span>super@artevoom.com</span>
                </div>
              </div>
              <button className={styles.logoutBtn}>
                로그아웃
              </button>
            </div>
          </aside>

          {/* Mobile Overlay */}
          {mounted && isMobileMenuOpen && (
            <div className={styles.sidebarOverlay} onClick={() => setIsMobileMenuOpen(false)} />
          )}

          {/* Main Wrapper */}
          <div className={styles.mainWrapper}>
            {/* Top Header */}
            <header className={styles.topHeader}>
              <div className={styles.headerLeft}>
                {mounted && (
                  <button 
                    className={styles.mobileMenuBtn} 
                    onClick={() => setIsMobileMenuOpen(true)}
                  >
                    <Menu size={20} />
                  </button>
                )}
              </div>
              <div className={styles.headerRight}>
                <NotificationBell />
                <p>오늘도 좋은 하루 되세요, <strong>관리자님</strong></p>
              </div>
            </header>

            {/* Content Area */}
            <main className={styles.content}>
              {children}
            </main>

            {/* Admin Footer */}
            <footer className={styles.adminFooter}>
              <div className={styles.footerContent}>
                <span className={styles.footerLogo}>ARTEVOOM</span>
                <p>&copy; 2024 ARTEVOOM. ALL RIGHTS RESERVED.</p>
                <span className={styles.version}>VERSION 1.0.0</span>
              </div>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
