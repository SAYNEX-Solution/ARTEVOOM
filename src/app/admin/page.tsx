import prisma from "@/lib/prisma";
import styles from "./Admin.module.css";
import { ChevronRight, ArrowUpRight, TrendingUp } from "lucide-react";

export default async function AdminDashboard() {
  const productCount = await prisma.product.count();
  const orderCount = await prisma.order.count();
  const userCount = await prisma.user.count();
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  });

  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className={styles.dashboard}>
      <section className={styles.dashboardHero}>
        <h2>안녕하세요, 관리자님</h2>
        <p>오늘의 쇼핑몰 현황을 확인해보세요.</p>
      </section>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <label>총 주문 금액</label>
          <h2>₩ 18,920,000</h2>
          <div className={styles.statTrend}>
            <span className={styles.trendLabel}>지난 주 대비</span>
            <span className={styles.trendValue}><TrendingUp size={14} /> 12.5%</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <label>주문 건수</label>
          <h2>162 건</h2>
          <div className={styles.statTrend}>
            <span className={styles.trendLabel}>지난 주 대비</span>
            <span className={styles.trendValue}><TrendingUp size={14} /> 8.3%</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <label>신규 고객</label>
          <h2>{userCount} 명</h2>
          <div className={styles.statTrend}>
            <span className={styles.trendLabel}>지난 주 대비</span>
            <span className={styles.trendValue}><TrendingUp size={14} /> 15.7%</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <label>총 판매 상품 수</label>
          <h2>{productCount} 개</h2>
          <div className={styles.statTrend}>
            <span className={styles.trendLabel}>지난 주 대비</span>
            <span className={styles.trendValue}><TrendingUp size={14} /> 10.2%</span>
          </div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>최근 주문 내역</h3>
            <span className={styles.viewAll}>전체 보기 <ChevronRight size={14} /></span>
          </div>
          <div className={styles.tableWrapper}>
            <table>
              <thead>
                <tr>
                  <th>주문번호</th>
                  <th>고객명</th>
                  <th>상품</th>
                  <th>주문 금액</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id.substring(0, 10)}</td>
                    <td>{order.user?.name || '익명'}</td>
                    <td>La Mémoire 외</td>
                    <td>₩{order.totalAmount.toLocaleString()}</td>
                    <td>배송완료</td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr><td colSpan={5} style={{textAlign: 'center', padding: '40px', opacity: 0.3}}>내역이 없습니다.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>신규 고객 가입</h3>
            <span className={styles.viewAll}>전체 보기 <ChevronRight size={14} /></span>
          </div>
          <div className={styles.tableWrapper}>
            <table>
              <thead>
                <tr>
                  <th>이름</th>
                  <th>이메일</th>
                  <th>가입일</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

