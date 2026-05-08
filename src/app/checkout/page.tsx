"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/useCartStore";
import Footer from "@/components/Footer/Footer";
import PageHeader from "@/components/PageHeader/PageHeader";
import styles from "./CheckoutPage.module.css";
import { Package, CreditCard, Truck, User, MapPin, Phone } from "lucide-react";

declare global {
  interface Window {
    PortOne: any;
  }
}

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    receiver: "",
    phone: "",
    address: "",
    detailAddress: "",
  });

  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        receiver: session.user.name || "",
        phone: (session.user as any).phone || "",
        address: (session.user as any).address || "",
      }));
    }
  }, [session]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal >= 100000 ? 0 : 3000;
  const total = subtotal + shippingFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handlePayment = async () => {
    const receiver = formData.receiver.trim();
    const phone = formData.phone.trim();
    const address = formData.address.trim();
    const detailAddress = formData.detailAddress.trim() || " ";

    if (!receiver || !phone || !address) {
      alert("배송 정보를 모두 정확히 입력해주세요.");
      return;
    }

    if (items.length === 0) {
      alert("주문할 상품이 없습니다.");
      return;
    }

    setLoading(true);

    try {
      const paymentId = `mock_pay_${new Date().getTime()}`;
      const merchantUid = `order_${new Date().getTime()}`;

      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId: paymentId,
          merchantUid: merchantUid,
          totalAmount: Number(total),
          address: address + " " + detailAddress,
          phone: phone,
          receiver: receiver,
          items: items.map(item => ({
            productId: item.id,
            quantity: Number(item.quantity),
            price: Number(item.price)
          }))
        }),
      });

      if (res.ok) {
        alert("가상 결제가 완료되었습니다. (테스트 모드)");
        clearCart();
        router.push("/mypage");
      } else {
        const errData = await res.json();
        alert(`주문 저장 중 오류가 발생했습니다: ${errData.error || errData.message}`);
      }
    } catch (error: any) {
      console.error("Mock Payment error:", error);
      alert(`처리 중 오류가 발생했습니다: ${error.message || "알 수 없는 오류"}`);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <main style={{ background: "#121110", color: "#e8e2d9", minHeight: "100vh", paddingTop: "80px" }}>
        <div style={{ padding: '100px 20px', textAlign: 'center' }}>
          <h2>장바구니가 비어있습니다.</h2>
          <button onClick={() => router.push('/products')} className={styles.checkoutBtn} style={{ maxWidth: '300px', margin: '20px auto' }}>상품 보러가기</button>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main style={{ background: "#121110", color: "#e8e2d9", minHeight: "100vh", paddingTop: "80px" }}>
      <PageHeader title="주문 / 결제" description="선택하신 상품을 안전하게 배송해 드립니다." />
      <div className={styles.container}>
        <div className={styles.leftSide}>
          <section>
            <h3 className={styles.sectionTitle}><User style={{marginRight: 10, verticalAlign: 'middle'}} size={20} /> 배송 정보</h3>
            <div className={styles.formGroup}>
              <label className={styles.label}>받는 사람</label>
              <input 
                type="text" id="receiver" className={styles.input} 
                value={formData.receiver} onChange={handleChange} placeholder="성함을 입력하세요"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>연락처</label>
              <input 
                type="text" id="phone" className={styles.input} 
                value={formData.phone} onChange={handleChange} placeholder="010-0000-0000"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>주소</label>
              <input 
                type="text" id="address" className={styles.input} 
                value={formData.address} onChange={handleChange} placeholder="배송지 주소를 입력하세요"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>상세 주소</label>
              <input 
                type="text" id="detailAddress" className={styles.input} 
                value={formData.detailAddress} onChange={handleChange} placeholder="나머지 주소를 입력하세요"
              />
            </div>
          </section>
          <section style={{marginTop: 50}}>
            <h3 className={styles.sectionTitle}><CreditCard style={{marginRight: 10, verticalAlign: 'middle'}} size={20} /> 결제 수단</h3>
            <div style={{
              padding: '20px', background: 'rgba(212, 175, 55, 0.1)', border: '1px solid #d4af37',
              borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '12px'
            }}>
              <div style={{width: 10, height: 10, borderRadius: '50%', background: '#d4af37'}}></div>
              <span>신용 / 체크카드</span>
            </div>
          </section>
        </div>
        <div className={styles.rightSide}>
          <div className={styles.orderSummary}>
            <h3 style={{fontSize: 20, marginBottom: 25}}>주문 요약</h3>
            <div className={styles.itemsList}>
              {items.map((item) => (
                <div key={item.id} className={styles.orderItem}>
                  <div className={styles.itemInfo}>
                    <img src={item.image} alt={item.name} className={styles.itemImage} />
                    <div>
                      <div className={styles.itemName}>{item.name}</div>
                      <div className={styles.itemQty}>{item.quantity}개</div>
                    </div>
                  </div>
                  <div className={styles.itemPrice}>
                    ₩{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <div style={{marginTop: 30}}>
              <div className={styles.priceRow}>
                <span>상품 합계</span>
                <span>₩{subtotal.toLocaleString()}</span>
              </div>
              <div className={styles.priceRow}>
                <span>배송비</span>
                <span>{shippingFee === 0 ? '무료' : `₩${shippingFee.toLocaleString()}`}</span>
              </div>
              <div className={styles.totalRow}>
                <span>총 결제 금액</span>
                <span>₩{total.toLocaleString()}</span>
              </div>
            </div>
            <button className={styles.checkoutBtn} onClick={handlePayment} disabled={loading}>
              {loading ? '처리 중...' : `₩${total.toLocaleString()} 결제하기`}
            </button>
            <p style={{fontSize: 12, opacity: 0.5, textAlign: 'center', marginTop: 15}}>
              주문 내용을 확인하였으며 결제에 동의합니다.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
