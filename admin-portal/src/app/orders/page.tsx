"use client";

import { useState, useEffect } from "react";
import styles from "../Admin.module.css";
import { 
  ShoppingBag, Search, Filter, MoreHorizontal, 
  Truck, CheckCircle, Clock, Package, XCircle 
} from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({ carrier: "", trackingNumber: "" });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders/list"); // 리스트 API는 아직 없으므로 아래에서 생성 예정
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Fetch orders error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    if (newStatus === "SHIPPING") {
      const order = orders.find((o: any) => o.id === orderId);
      setSelectedOrder(order);
      setShowShippingModal(true);
      return;
    }

    updateOrder(orderId, newStatus);
  };

  const updateOrder = async (orderId: string, status: string, carrier?: string, trackingNumber?: string) => {
    try {
      const res = await fetch("/api/orders/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status, carrier, trackingNumber }),
      });

      if (res.ok) {
        alert("주문 상태가 업데이트되었습니다.");
        fetchOrders();
        setShowShippingModal(false);
      }
    } catch (error) {
      alert("업데이트 중 오류가 발생했습니다.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID": return <span style={{color: '#8fb339', background: 'rgba(143, 179, 57, 0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>결제완료</span>;
      case "PREPARING": return <span style={{color: '#c5a368', background: 'rgba(197, 163, 104, 0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>배송준비</span>;
      case "SHIPPING": return <span style={{color: '#3498db', background: 'rgba(52, 152, 219, 0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>배송중</span>;
      case "DELIVERED": return <span style={{color: '#2ecc71', background: 'rgba(46, 204, 113, 0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>배송완료</span>;
      case "REFUND_REQUESTED": return <span style={{color: '#e74c3c', background: 'rgba(231, 76, 60, 0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>환불요청</span>;
      case "REFUNDED": return <span style={{color: '#95a5a6', background: 'rgba(149, 165, 166, 0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>환불완료</span>;
      default: return <span>{status}</span>;
    }
  };


  return (
    <div className={styles.ordersPage}>
      <div className={styles.dashboardHero}>
        <h2>주문 관리</h2>
        <p>전체 주문 내역을 확인하고 배송 상태를 관리하세요.</p>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.headerActions}>
            <div className={styles.searchBar}>
              <Search size={16} />
              <input 
                type="text" 
                placeholder="주문자명, 연락처 검색..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className={styles.actionBtn}><Filter size={16} /> 필터</button>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <div className={styles.tableWrapper}>
            <table>
              <thead>
                <tr>
                  <th>주문번호 / 일시</th>
                  <th>주문자 정보</th>
                  <th>주문 상품</th>
                  <th>결제 금액</th>
                  <th>상태</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {orders.filter((o: any) => o.receiver.includes(searchTerm) || o.phone.includes(searchTerm)).map((order: any) => (
                  <tr key={order.id}>
                    <td data-label="주문번호/일시">
                      <div style={{fontWeight: 500}}>{order.id.substring(0, 10)}...</div>
                      <div style={{fontSize: '11px', opacity: 0.4}}>{new Date(order.createdAt).toLocaleString()}</div>
                    </td>
                    <td data-label="주문자 정보">
                      <div>{order.receiver}</div>
                      <div style={{fontSize: '12px', opacity: 0.5}}>{order.phone}</div>
                      <div style={{fontSize: '11px', opacity: 0.4}}>{order.address}</div>
                    </td>
                    <td data-label="주문 상품">
                      {order.orderItems?.length > 0 ? (
                        <div>
                          {order.orderItems[0].product?.name} 
                          {order.orderItems.length > 1 && ` 외 ${order.orderItems.length - 1}건`}
                        </div>
                      ) : '-'}
                    </td>
                    <td data-label="결제 금액">₩{order.totalAmount.toLocaleString()}</td>
                    <td data-label="상태">{getStatusBadge(order.status)}</td>
                    <td data-label="관리">
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: '#fff',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="PAID">결제완료</option>
                        <option value="PREPARING">배송준비</option>
                        <option value="SHIPPING">배송중</option>
                        <option value="DELIVERED">배송완료</option>
                        <option value="REFUND_REQUESTED">환불요청</option>
                        <option value="REFUNDED">환불완료</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 송장 입력 모달 */}
      {showShippingModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{background: '#161514', padding: '40px', borderRadius: '8px', width: 'min(400px, 90%)', border: '1px solid rgba(255,255,255,0.1)'}}>
            <h3 style={{marginBottom: '20px', color: '#c5a368'}}>배송 정보 입력</h3>
            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', fontSize: '12px', marginBottom: '8px', opacity: 0.6}}>택배사</label>
              <input 
                type="text" 
                value={shippingInfo.carrier}
                onChange={(e) => setShippingInfo({...shippingInfo, carrier: e.target.value})}
                style={{width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '12px', borderRadius: '4px'}}
                placeholder="CJ대한통운, 우체국 등"
              />
            </div>
            <div style={{marginBottom: '30px'}}>
              <label style={{display: 'block', fontSize: '12px', marginBottom: '8px', opacity: 0.6}}>송장 번호</label>
              <input 
                type="text" 
                value={shippingInfo.trackingNumber}
                onChange={(e) => setShippingInfo({...shippingInfo, trackingNumber: e.target.value})}
                style={{width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '12px', borderRadius: '4px'}}
                placeholder="송장 번호를 입력하세요"
              />
            </div>
            <div style={{display: 'flex', gap: '10px'}}>
              <button 
                onClick={() => updateOrder(selectedOrder.id, "SHIPPING", shippingInfo.carrier, shippingInfo.trackingNumber)}
                style={{flex: 1, background: '#c5a368', color: '#000', border: 'none', padding: '12px', borderRadius: '4px', fontWeight: 600, cursor: 'pointer'}}
              >
                저장 및 배송 시작
              </button>
              <button 
                onClick={() => setShowShippingModal(false)}
                style={{flex: 1, background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer'}}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
