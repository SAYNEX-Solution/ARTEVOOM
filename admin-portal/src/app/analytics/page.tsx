'use client'

import { useState, useEffect } from 'react';
import styles from "../Admin.module.css";
import { Calendar, TrendingUp, ShoppingBag, Users, RotateCcw } from "lucide-react";

export default function AnalyticsPage() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async (selectedDate: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics?date=${selectedDate}`);
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(date);
  }, [date]);

  return (
    <div className={styles.analyticsPage}>
      <header className={styles.dashboardHero}>
        <h2>통계 분석</h2>
        <p>일자별 판매 실적과 고객 유입 현황을 상세히 파악할 수 있습니다.</p>
      </header>

      <div className={styles.card} style={{ marginBottom: '30px' }}>
        <div className={styles.cardHeader}>
          <h3>일자 선택</h3>
          <div className={styles.datePicker}>
            <Calendar size={18} style={{ marginRight: '10px', opacity: 0.5 }} />
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              className={styles.dateInput}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>데이터를 불러오는 중입니다...</div>
      ) : (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'rgba(197, 163, 104, 0.1)', color: '#c5a368' }}>
              <TrendingUp size={24} />
            </div>
            <label>오늘의 매출</label>
            <h2>₩ {data?.revenue?.toLocaleString() || 0}</h2>
            <span className={styles.statSub}>결제 완료 기준</span>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'rgba(143, 179, 57, 0.1)', color: '#8fb339' }}>
              <ShoppingBag size={24} />
            </div>
            <label>판매 수량</label>
            <h2>{data?.quantity || 0} 개</h2>
            <span className={styles.statSub}>총 판매 아이템 수</span>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'rgba(255, 68, 68, 0.1)', color: '#ff4444' }}>
              <RotateCcw size={24} />
            </div>
            <label>환불 및 취소 건수</label>
            <h2>{data?.refunds || 0} 건</h2>
            <span className={styles.statSub}>전체 취소 요청 포함</span>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#fff' }}>
              <Users size={24} />
            </div>
            <label>신규 고객 수</label>
            <h2>{data?.newCustomers || 0} 명</h2>
            <span className={styles.statSub}>해당 일자 가입자</span>
          </div>
        </div>
      )}

      {/* Additional details could be added here */}
    </div>
  );
}
