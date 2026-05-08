'use client'

import { useState, useEffect } from 'react';
import { Bell } from "lucide-react";
import { useRouter } from 'next/navigation';
import styles from "./Admin.module.css";

export default function NotificationBell() {
  const [count, setCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkNewOrders = async () => {
      const lastChecked = localStorage.getItem('lastCheckedOrders') || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      try {
        const res = await fetch(`/api/orders/new-count?since=${lastChecked}`);
        const data = await res.json();
        setCount(data.count);
      } catch (err) {
        console.error(err);
      }
    };

    checkNewOrders();
    const interval = setInterval(checkNewOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleClear = () => {
    localStorage.setItem('lastCheckedOrders', new Date().toISOString());
    setCount(0);
    setIsOpen(false);
    router.push('/orders');
  };

  return (
    <div className={styles.notificationContainer}>
      <div className={styles.notification} onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }}>
        <Bell size={20} />
        {count > 0 && <span className={styles.notiBadge}>{count}</span>}
      </div>

      {isOpen && (
        <div className={styles.notiDropdown}>
          <div className={styles.notiHeader}>알림 센터</div>
          <div className={styles.notiBody}>
            {count > 0 ? (
              <div className={styles.notiItem} onClick={handleClear}>
                <div className={styles.notiIcon}><Bell size={14} /></div>
                <div className={styles.notiContent}>
                  <p>새로운 주문이 <strong>{count}건</strong> 접수되었습니다.</p>
                  <span>방금 전</span>
                </div>
              </div>
            ) : (
              <div className={styles.notiEmpty}>새로운 알림이 없습니다.</div>
            )}
          </div>
          {count > 0 && (
            <div className={styles.notiFooter} onClick={handleClear}>
              주문 관리 페이지로 이동
            </div>
          )}
        </div>
      )}
      
      {isOpen && <div className={styles.notiOverlay} onClick={() => setIsOpen(false)} />}
    </div>
  );
}
