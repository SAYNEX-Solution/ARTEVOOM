import prisma from "@/lib/prisma";
import styles from "./Admin.module.css";
import { ChevronRight, TrendingUp } from "lucide-react";
import RevenueChart from "./RevenueChart";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const productCount = await prisma.product.count();
  const userCount = await prisma.user.count();
  
  // 주문 관련 통계
  const allOrders = await prisma.order.findMany({
    include: { orderItems: { include: { product: true } }, user: true }
  });

  const totalAmount = allOrders
    .filter(o => !['CANCELLED', 'REFUNDED'].includes(o.status))
    .reduce((acc, o) => acc + o.totalAmount, 0);
  
  const orderCount = allOrders.length;

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: true, orderItems: { include: { product: true } } }
  });

  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { id: 'desc' },
  });

  // 주문 상태 현황 통계
  const statusCounts = {
    PAID: allOrders.filter(o => o.status === 'PAID').length,
    SHIPPING: allOrders.filter(o => ['PREPARING', 'SHIPPING'].includes(o.status)).length,
    DELIVERED: allOrders.filter(o => o.status === 'DELIVERED').length,
    REFUND: allOrders.filter(o => ['REFUND_REQUESTED', 'REFUNDED', 'CANCELLED'].includes(o.status)).length,
  };

  const getStatusText = (status: string) => {
    const statuses: any = {
      'PAID': '결제완료',
      'PREPARING': '상품준비중',
      'SHIPPING': '배송중',
      'DELIVERED': '배송완료',
      'REFUND_REQUESTED': '환불요청',
      'REFUNDED': '환불완료',
      'CANCELLED': '주문취소'
    };
    return statuses[status] || status;
  };

  // 매출 추이 (최근 7일)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const dailyRevenue = last7Days.map(date => {
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);
    
    const dayOrders = allOrders
      .filter(o => {
        const oDate = new Date(o.createdAt);
        return oDate >= date && oDate < nextDate;
      });
    
    const validOrders = dayOrders.filter(o => !['CANCELLED', 'REFUNDED'].includes(o.status));
    const dayTotal = validOrders.reduce((acc, o) => acc + o.totalAmount, 0);
    const dayRefunds = dayOrders.filter(o => ['REFUND_REQUESTED', 'REFUNDED', 'CANCELLED'].includes(o.status)).length;
    
    return {
      date: `${date.getMonth() + 1}.${date.getDate()}`,
      amount: dayTotal,
      count: validOrders.length,
      refundCount: dayRefunds
    };
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
          <h2>₩ {totalAmount.toLocaleString()}</h2>
          <div className={styles.statTrend}>
            <span className={styles.trendLabel}>누적 데이터</span>
            <span className={styles.trendValue}><TrendingUp size={14} /> 전체</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <label>주문 건수</label>
          <h2>{orderCount} 건</h2>
          <div className={styles.statTrend}>
            <span className={styles.trendLabel}>누적 데이터</span>
            <span className={styles.trendValue}><TrendingUp size={14} /> 전체</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <label>신규 고객</label>
          <h2>{userCount} 명</h2>
          <div className={styles.statTrend}>
            <span className={styles.trendLabel}>전체 가입자</span>
            <span className={styles.trendValue}><TrendingUp size={14} /> 전체</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <label>총 판매 상품 수</label>
          <h2>{productCount} 개</h2>
          <div className={styles.statTrend}>
            <span className={styles.trendLabel}>등록 상품</span>
            <span className={styles.trendValue}><TrendingUp size={14} /> 전체</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className={styles.contentGrid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>매출 추이 (최근 7일)</h3>
          </div>
          <RevenueChart data={dailyRevenue} />
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>주문 상태 현황</h3>
          </div>
          <div className={styles.donutContainer}>
            <svg viewBox="0 0 200 200" className={styles.donutChart}>
              <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="20" />
              {/* Simple representation of donut chart segments */}
              <circle cx="100" cy="100" r="70" fill="none" stroke="#c5a368" strokeWidth="20" 
                strokeDasharray={`${(statusCounts.PAID / (orderCount || 1)) * 440} 440`} 
                strokeDashoffset="0" transform="rotate(-90 100 100)" />
              <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(197, 163, 104, 0.6)" strokeWidth="20" 
                strokeDasharray={`${(statusCounts.SHIPPING / (orderCount || 1)) * 440} 440`} 
                strokeDashoffset={`-${(statusCounts.PAID / (orderCount || 1)) * 440}`} transform="rotate(-90 100 100)" />
              
              <text x="100" y="95" textAnchor="middle" className={styles.donutCenterLabel}>총 주문</text>
              <text x="100" y="120" textAnchor="middle" className={styles.donutCenterValue}>{orderCount} 건</text>
            </svg>
            <div className={styles.donutLegend}>
              <div className={styles.legendItem}>
                <span className={styles.dot} style={{background: '#c5a368'}}></span>
                <span className={styles.label}>결제완료</span>
                <span className={styles.val}>{statusCounts.PAID} ({((statusCounts.PAID / (orderCount || 1)) * 100).toFixed(1)}%)</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.dot} style={{background: 'rgba(197, 163, 104, 0.6)'}}></span>
                <span className={styles.label}>배송 중</span>
                <span className={styles.val}>{statusCounts.SHIPPING} ({((statusCounts.SHIPPING / (orderCount || 1)) * 100).toFixed(1)}%)</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.dot} style={{background: 'rgba(197, 163, 104, 0.3)'}}></span>
                <span className={styles.label}>배송 완료</span>
                <span className={styles.val}>{statusCounts.DELIVERED} ({((statusCounts.DELIVERED / (orderCount || 1)) * 100).toFixed(1)}%)</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.dot} style={{background: 'rgba(255,255,255,0.1)'}}></span>
                <span className={styles.label}>취소 / 환불</span>
                <span className={styles.val}>{statusCounts.REFUND} ({((statusCounts.REFUND / (orderCount || 1)) * 100).toFixed(1)}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>최근 주문 내역</h3>
            <span className={styles.viewAll}>전체 보기 <ChevronRight size={14} /></span>
          </div>
          <div className={styles.tableContainer}>
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
                      <td data-label="주문번호">{order.id.substring(0, 10)}</td>
                      <td data-label="고객명">{order.user?.name || '익명'}</td>
                      <td data-label="상품">
                        {order.orderItems[0]?.product?.name || '삭제된 상품'}
                        {order.orderItems.length > 1 ? ` 외 ${order.orderItems.length - 1}건` : ''}
                      </td>
                      <td data-label="주문 금액">₩{order.totalAmount.toLocaleString()}</td>
                      <td data-label="상태"><span className={styles.statusBadge} data-status={order.status}>{getStatusText(order.status)}</span></td>
                    </tr>
                  ))}
                  {recentOrders.length === 0 && (
                    <tr><td colSpan={5} style={{textAlign: 'center', padding: '40px', opacity: 0.3}}>내역이 없습니다.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>신규 고객 가입</h3>
            <span className={styles.viewAll}>전체 보기 <ChevronRight size={14} /></span>
          </div>
          <div className={styles.tableContainer}>
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
                      <td data-label="이름">{user.name}</td>
                      <td data-label="이메일">{user.email}</td>
                      <td data-label="가입일" style={{opacity: 0.5}}>
                        {((user as any).createdAt ? new Date((user as any).createdAt) : new Date()).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\.$/, '')}
                      </td>
                    </tr>
                  ))}
                  {recentUsers.length === 0 && (
                    <tr><td colSpan={3} style={{textAlign: 'center', padding: '40px', opacity: 0.3}}>가입자가 없습니다.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

