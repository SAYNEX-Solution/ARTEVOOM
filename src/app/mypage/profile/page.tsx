import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navigation from "@/components/Navigation/Navigation";
import Footer from "@/components/Footer/Footer";
import PageHeader from "@/components/PageHeader/PageHeader";
import ProfileForm from "@/components/Profile/ProfileForm";
import styles from "../MyPage.module.css";
import { 
  User, ShoppingBag, Truck, RotateCcw, Settings, MapPin, 
  MessageSquare, LogOut, ArrowRight 
} from "lucide-react";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = session.user as any;

  return (
    <main style={{ background: '#121110', color: '#e8e2d9', minHeight: '100vh' }}>
      <Navigation />
      <PageHeader 
        title="회원정보 관리" 
        description="회원님의 소중한 정보를 안전하게 관리하세요."
      />

      <div className={styles.container}>
        {/* Left Sidebar Menu */}
        <aside className={styles.sidebar}>
          <Link href="/mypage" className={styles.menuItem}>
            <User className={styles.menuIcon} /> 마이페이지
          </Link>
          <button className={styles.menuItem}>
            <ShoppingBag className={styles.menuIcon} /> 주문내역
          </button>
          <button className={styles.menuItem}>
            <Truck className={styles.menuIcon} /> 배송조회
          </button>
          <button className={styles.menuItem}>
            <RotateCcw className={styles.menuIcon} /> 취소/교환/반품 내역
          </button>
          <Link href="/mypage/profile" className={`${styles.menuItem} ${styles.active}`}>
            <Settings className={styles.menuIcon} /> 회원정보 관리
          </Link>
          <button className={styles.menuItem}>
            <MapPin className={styles.menuIcon} /> 배송지 관리
          </button>
          <button className={styles.menuItem}>
            <MessageSquare className={styles.menuIcon} /> 1:1 문의
          </button>
          <button className={`${styles.menuItem} ${styles.logoutBtn}`}>
            <LogOut className={styles.menuIcon} /> 로그아웃
          </button>
        </aside>

        {/* Main Content Area */}
        <div className={styles.mainContent}>
          <div className={styles.sectionHeader}>
            <h3>프로필 수정</h3>
          </div>
          
          <ProfileForm user={user} />
        </div>
      </div>

      <Footer />
    </main>
  );
}
