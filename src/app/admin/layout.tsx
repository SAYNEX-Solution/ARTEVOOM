import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, Package, ShoppingBag, Users, Clock, 
  MessageSquare, Settings, BarChart3, Star, Tag, Database, 
  FileEdit, ShieldCheck, Bell, Menu, User, LogOut 
} from "lucide-react";
import styles from "./Admin.module.css";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className={styles.adminContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <Link href="/admin">
            <h1>ARTEVOOM</h1>
            <span>ADMIN DASHBOARD</span>
          </Link>
        </div>

        <nav className={styles.nav}>
          <Link href="/admin" className={styles.navItem}>
            <LayoutDashboard size={18} /> 대시보드
          </Link>
          <Link href="/admin/orders" className={styles.navItem}>
            <ShoppingBag size={18} /> 주문 관리
          </Link>
          <Link href="/admin/products" className={styles.navItem}>
            <Package size={18} /> 상품 관리
          </Link>
          <Link href="/admin/users" className={styles.navItem}>
            <Users size={18} /> 고객 관리
          </Link>
          <Link href="/admin/inventory" className={styles.navItem}>
            <Database size={18} /> 재고 관리
          </Link>
          <Link href="/admin/reviews" className={styles.navItem}>
            <Star size={18} /> 리뷰 관리
          </Link>
          <Link href="/admin/inquiry" className={styles.navItem}>
            <MessageSquare size={18} /> 문의 관리
          </Link>
          <Link href="/admin/promotion" className={styles.navItem}>
            <Tag size={18} /> 프로모션
          </Link>
          <Link href="/admin/analytics" className={styles.navItem}>
            <BarChart3 size={18} /> 통계 분석
          </Link>
          <Link href="/admin/content" className={styles.navItem}>
            <FileEdit size={18} /> 콘텐츠 관리
          </Link>
          <Link href="/admin/settings" className={styles.navItem}>
            <Settings size={18} /> 사이트 설정
          </Link>
          <Link href="/admin/logs" className={styles.navItem}>
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

      {/* Main Wrapper */}
      <div className={styles.mainWrapper}>
        {/* Top Header */}
        <header className={styles.topHeader}>
          <div className={styles.headerLeft}>
            <button className={styles.iconBtn}><Menu size={20} /></button>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.notification}>
              <Bell size={20} />
              <span className={styles.notiBadge}>4</span>
            </div>
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
  );
}

