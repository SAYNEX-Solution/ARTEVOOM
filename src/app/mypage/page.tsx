'use client'

import { useState, useEffect } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight,
  ChevronRight,
  Truck,
  RotateCcw,
  ShoppingBag,
  User,
  Settings,
  MapPin,
  LogOut
} from 'lucide-react'
import styles from './MyPage.module.css'

export default function MyPage() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('DASHBOARD')
  const [showRefundModal, setShowRefundModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showTrackingModal, setShowTrackingModal] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [refundReason, setRefundReason] = useState('')
  const [refundBank, setRefundBank] = useState('')
  const [refundAccount, setRefundAccount] = useState('')
  const [refundPhone, setRefundPhone] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/user/orders')
      const data = await res.json()
      setOrders(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRefundRequest = async () => {
    if (!refundReason || !refundBank || !refundAccount || !refundPhone) {
      return alert('모든 정보를 입력해주세요 (환불 사유, 은행, 계좌번호, 전화번호).')
    }
    
    const fullReason = `[환불 사유] ${refundReason} | [은행] ${refundBank} | [계좌] ${refundAccount} | [연락처] ${refundPhone}`
    
    try {
      const res = await fetch('/api/user/orders/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: selectedOrderId, reason: fullReason })
      })
      if (res.ok) {
        alert('환불 요청이 접수되었습니다.')
        setShowRefundModal(false)
        setRefundReason('')
        setRefundBank('')
        setRefundAccount('')
        setRefundPhone('')
        fetchOrders()
      }
    } catch (err) {
      alert('오류가 발생했습니다.')
    }
  }

  const getStatusText = (status: string) => {
    const statuses: any = {
      'PAID': '결제완료',
      'PREPARING': '상품준비중',
      'SHIPPING': '배송중',
      'DELIVERED': '배송완료',
      'REFUND_REQUESTED': '환불요청중',
      'REFUNDED': '환불완료',
      'CANCELLED': '주문취소'
    }
    return statuses[status] || status
  }

  const stats = {
    paid: orders.filter(o => o.status === 'PAID').length,
    shipping: orders.filter(o => ['PREPARING', 'SHIPPING'].includes(o.status)).length,
    delivered: orders.filter(o => o.status === 'DELIVERED').length,
    refund: orders.filter(o => ['REFUND_REQUESTED', 'REFUNDED'].includes(o.status)).length
  }

  const filteredOrders = activeTab === 'DASHBOARD' 
    ? orders.slice(0, 3) 
    : activeTab === 'ORDERS' 
    ? orders 
    : activeTab === 'SHIPPING' 
    ? orders.filter(o => ['PREPARING', 'SHIPPING', 'DELIVERED'].includes(o.status))
    : activeTab === 'REFUND'
    ? orders.filter(o => ['REFUND_REQUESTED', 'REFUNDED', 'CANCELLED'].includes(o.status))
    : []

  if (!session) return <div className={styles.empty}>로그인이 필요한 서비스입니다.</div>

  const menuItems = [
    { id: 'DASHBOARD', label: '나의 아르보움', icon: <User size={18} strokeWidth={1.5} /> },
    { id: 'ORDERS', label: '주문내역', icon: <ShoppingBag size={18} strokeWidth={1.5} /> },
    { id: 'SHIPPING', label: '배송조회', icon: <Truck size={18} strokeWidth={1.5} /> },
    { id: 'REFUND', label: '취소/반품', icon: <RotateCcw size={18} strokeWidth={1.5} /> },
    { id: 'LOGOUT', label: '로그아웃', icon: <LogOut size={18} strokeWidth={1.5} />, color: '#a33' },
  ]

  return (
    <main className={styles.main}>
      {/* 1. 고정 배너 */}
      <section className={styles.hero} style={{ backgroundImage: 'url("/images/mypage-hero.png")' }}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroTitle}>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="brand-font"
          >
            MY PAGE
          </motion.h1>
          <p>나의 쇼핑 정보와 혜택을 한눈에 확인하세요.</p>
        </div>
      </section>

      {/* 2. 상단 카테고리 네비게이션 (그리드형) */}
      <nav className={styles.categoryNav}>
        <ul className={styles.categoryList}>
          {menuItems.map(item => (
            <li 
              key={item.id}
              className={`${styles.categoryItem} ${activeTab === item.id ? styles.active : ''}`}
              style={item.color ? { color: item.color } : {}}
              onClick={() => item.id === 'LOGOUT' ? signOut({ callbackUrl: '/' }) : setActiveTab(item.id)}
            >
              <div className={styles.categoryIcon}>{item.icon}</div>
              <span className={styles.categoryLabel}>{item.label}</span>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.container}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* 3. 대시보드 요약 (DASHBOARD 탭에서만 표시) */}
            {activeTab === 'DASHBOARD' && (
              <>
                <div className={styles.userSummary}>
                  <h2 className={styles.userName}>{session.user?.name}님, 환영합니다.</h2>
                  <div className={styles.userMeta}>
                    가입일: {session.user && (session.user as any).createdAt ? new Date((session.user as any).createdAt).toLocaleDateString() : '2024.01.15'}
                  </div>
                </div>

                <div className={styles.statsGrid}>
                  <div className={styles.statCard}>
                    <span className={styles.statLabel}>주문 완료</span>
                    <span className={styles.statValue}>{stats.paid}</span>
                  </div>
                  <div className={styles.statCard}>
                    <span className={styles.statLabel}>배송 중</span>
                    <span className={styles.statValue}>{stats.shipping}</span>
                  </div>
                  <div className={styles.statCard}>
                    <span className={styles.statLabel}>배송 완료</span>
                    <span className={styles.statValue}>{stats.delivered}</span>
                  </div>
                  <div className={styles.statCard}>
                    <span className={styles.statLabel}>취소/환불</span>
                    <span className={styles.statValue}>{stats.refund}</span>
                  </div>
                </div>
              </>
            )}

            {/* 4. 컨텐츠 리스트 */}
            {['DASHBOARD', 'ORDERS', 'SHIPPING', 'REFUND'].includes(activeTab) && (
              <>
                <div className={styles.sectionTitle}>
                  {activeTab === 'DASHBOARD' ? '최근 주문 내역' : menuItems.find(m => m.id === activeTab)?.label}
                  {activeTab === 'DASHBOARD' && (
                    <button className={styles.btn} style={{ border: 'none' }} onClick={() => setActiveTab('ORDERS')}>
                      전체보기 <ChevronRight size={14} />
                    </button>
                  )}
                </div>

                {loading ? (
                  <div className={styles.empty}>데이터를 불러오는 중입니다...</div>
                ) : filteredOrders.length === 0 ? (
                  <div className={styles.empty}>내역이 존재하지 않습니다.</div>
                ) : (
                  <div className={styles.orderList}>
                    {filteredOrders.map(order => (
                      <div key={order.id} className={styles.orderItem}>
                        <div className={styles.orderThumb}>
                          <img src={order.orderItems[0]?.product?.images || '/images/product1.png'} alt="product" />
                        </div>
                        <div className={styles.orderInfo}>
                          <div className={styles.orderStatus}>{getStatusText(order.status)}</div>
                          <h4 className={styles.orderName}>
                            {order.orderItems[0]?.product?.name}
                            {order.orderItems.length > 1 && ` 외 ${order.orderItems.length - 1}건`}
                          </h4>
                          <div className={styles.orderPrice}>₩{order.totalAmount.toLocaleString()}</div>
                          <div className={styles.orderDate}>주문일: {new Date(order.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div className={styles.actionArea}>
                          <button 
                            className={styles.btn}
                            onClick={() => { setSelectedOrder(order); setShowDetailsModal(true); }}
                          >
                            상세보기
                          </button>
                          {['PAID', 'PREPARING'].includes(order.status) ? (
                            <>
                              <button 
                                className={styles.btn}
                                onClick={() => { setSelectedOrderId(order.id); setShowRefundModal(true); }}
                              >
                                환불요청
                              </button>
                              <button 
                                className={`${styles.btn} ${styles.btnPrimary}`}
                                onClick={() => { setSelectedOrder(order); setShowTrackingModal(true); }}
                              >
                                배송조회
                              </button>
                            </>
                          ) : ['SHIPPING', 'DELIVERED'].includes(order.status) ? (
                            <button 
                              className={`${styles.btn} ${styles.btnPrimary}`}
                              onClick={() => { setSelectedOrder(order); setShowTrackingModal(true); }}
                            >
                              배송조회
                            </button>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* 회원정보/배송지관리 섹션 (생략 가능하지만 틀 유지를 위해 구조만) */}
            {activeTab === 'PROFILE' && (
              <div className={styles.empty}>회원 정보 수정 페이지 준비 중입니다.</div>
            )}
            {activeTab === 'ADDRESS' && (
              <div className={styles.empty}>배송지 관리 페이지 준비 중입니다.</div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 배송 조회 모달 */}
      <AnimatePresence>
        {showTrackingModal && selectedOrder && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.modalOverlay}
            onClick={() => setShowTrackingModal(false)}
          >
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className={styles.modalTitle}>배송 조회</h3>
              
              <div className={styles.detailGrid}>
                {['PAID', 'PREPARING'].includes(selectedOrder.status) ? (
                  <div className={styles.emptyTracking}>
                    <Truck size={48} strokeWidth={1} style={{ marginBottom: '20px', opacity: 0.3 }} />
                    <p>배송이 아직 시작되지 않았습니다.</p>
                    <span>상품이 준비되는 대로 송장 번호를 안내해 드리겠습니다.</span>
                  </div>
                ) : (
                  <>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>택배사</span>
                      <span className={styles.detailValue}>{selectedOrder.carrier || 'CJ대한통운'}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>운송장 번호</span>
                      <span className={styles.detailValue}>{selectedOrder.trackingNumber || '1234-5678-9012'}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>현재 상태</span>
                      <span className={`${styles.detailValue} ${styles.statusHighlight}`}>
                        {getStatusText(selectedOrder.status)}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className={styles.modalActions}>
                <button 
                  className={`${styles.btn} ${styles.btnPrimary}`} 
                  style={{ width: '100%' }} 
                  onClick={() => setShowTrackingModal(false)}
                >
                  확인
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 주문 상세 모달 */}
      <AnimatePresence>
        {showDetailsModal && selectedOrder && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.modalOverlay}
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className={styles.modalTitle}>주문 상세 정보</h3>
              
              <div className={styles.detailGrid}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>주문번호</span>
                  <span className={styles.detailValue}>{selectedOrder.id}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>구매확정일</span>
                  <span className={styles.detailValue}>
                    {selectedOrder.status === 'DELIVERED' 
                      ? new Date(selectedOrder.updatedAt).toLocaleDateString() 
                      : '-'}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>구매자 성함</span>
                  <span className={styles.detailValue}>{selectedOrder.receiver || session.user?.name}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>전화번호</span>
                  <span className={styles.detailValue}>{selectedOrder.phone || '-'}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>배송지</span>
                  <span className={styles.detailValue}>{selectedOrder.address || '-'}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>상품상태</span>
                  <span className={`${styles.detailValue} ${styles.statusHighlight}`}>
                    {getStatusText(selectedOrder.status)}
                  </span>
                </div>
              </div>

              <div className={styles.modalActions}>
                <button 
                  className={`${styles.btn} ${styles.btnPrimary}`} 
                  style={{ width: '100%' }} 
                  onClick={() => setShowDetailsModal(false)}
                >
                  확인
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 환불 모달 */}
      <AnimatePresence>
        {showRefundModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.modalOverlay}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={styles.modalContent}
            >
              <h3 className={styles.modalTitle}>환불 요청</h3>
              <p style={{ opacity: 0.5, marginBottom: '40px' }}>환불 받으실 정보를 정확히 입력해주세요.</p>
              
              <div className={styles.refundInputs}>
                <input 
                  type="text" 
                  className={styles.input} 
                  placeholder="환불 은행사 (예: 신한은행)" 
                  value={refundBank}
                  onChange={(e) => setRefundBank(e.target.value)}
                />
                <input 
                  type="text" 
                  className={styles.input} 
                  placeholder="환불 계좌번호" 
                  value={refundAccount}
                  onChange={(e) => setRefundAccount(e.target.value)}
                />
                <input 
                  type="text" 
                  className={styles.input} 
                  placeholder="연락처" 
                  value={refundPhone}
                  onChange={(e) => setRefundPhone(e.target.value)}
                />
                <textarea 
                  className={styles.textarea} 
                  placeholder="상세 환불 사유를 입력하세요..."
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                />
              </div>

              <div className={styles.modalActions}>
                <button className={styles.btn} style={{ flex: 1 }} onClick={() => setShowRefundModal(false)}>취소</button>
                <button className={`${styles.btn} ${styles.btnPrimary}`} style={{ flex: 1 }} onClick={handleRefundRequest}>요청하기</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
