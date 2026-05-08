'use client'

import { useState, useEffect } from 'react';
import styles from "../Admin.module.css";
import { Package, Save, RefreshCw, AlertCircle, ShoppingBag, Tag } from "lucide-react";

export default function SingleProductPage() {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', price: '', stock: '' });

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const p = data[0]; // 무조건 첫 번째 상품만 사용
        setProduct(p);
        setEditForm({ name: p.name, price: p.price.toString(), stock: p.stock.toString() });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleSave = async () => {
    if (!product) return;
    setSaving(true);
    try {
      const res = await fetch('/api/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: product.id, ...editForm })
      });
      if (res.ok) {
        const updated = await res.json();
        setProduct(updated);
        alert('상품 정보와 재고가 성공적으로 업데이트되었습니다.');
      }
    } catch (error) {
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className={styles.loading}>상품 정보를 불러오는 중...</div>;

  if (!product) return (
    <div className={styles.empty}>
      <AlertCircle size={48} />
      <p>등록된 상품이 없습니다. 데이터베이스를 확인해주세요.</p>
    </div>
  );

  return (
    <div className={styles.productsPage}>
      <header className={styles.dashboardHero}>
        <h2>단일 상품 관리</h2>
        <p>ARTEVOOM의 시그니처 상품 정보를 통합 관리합니다. 재고 상태와 가격을 실시간으로 제어하세요.</p>
      </header>

      <div className={styles.singleProductGrid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>대표 상품 정보 수정</h3>
            <button className={styles.actionBtn} onClick={fetchProduct}><RefreshCw size={14} /> 새로고침</button>
          </div>

          <div className={styles.productForm}>
            <div className={styles.formGroup}>
              <label>상품명</label>
              <input 
                type="text" 
                value={editForm.name} 
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className={styles.editInput}
                placeholder="상품명을 입력하세요"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>판매 가격 (₩)</label>
                <input 
                  type="number" 
                  value={editForm.price} 
                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                  className={styles.editInput}
                  placeholder="가격 입력"
                />
              </div>
              <div className={styles.formGroup}>
                <label>현재 재고 (개)</label>
                <input 
                  type="number" 
                  value={editForm.stock} 
                  onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                  className={styles.editInput}
                  placeholder="재고 수량"
                />
              </div>
            </div>

            <button 
              className={styles.saveBtn} 
              onClick={handleSave} 
              disabled={saving}
            >
              <Save size={18} /> {saving ? '저장 중...' : '변경사항 저장하기'}
            </button>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>실시간 판매 현황</h3>
          </div>
          <div className={styles.productStatusInfo}>
            <div className={styles.statusItem}>
              <div className={styles.statusIcon} style={{ background: 'rgba(197, 163, 104, 0.1)' }}><Tag size={20} color="#c5a368" /></div>
              <div className={styles.statusText}>
                <span>카테고리</span>
                <p>{product.category}</p>
              </div>
            </div>
            <div className={styles.statusItem}>
              <div className={styles.statusIcon} style={{ background: 'rgba(143, 179, 57, 0.1)' }}><Package size={20} color="#8fb339" /></div>
              <div className={styles.statusText}>
                <span>재고 상태</span>
                <p style={{ color: product.stock > 0 ? '#8fb339' : '#ff4444' }}>
                  {product.stock > 0 ? `${product.stock}개 남음` : '품절'}
                </p>
              </div>
            </div>
            <div className={styles.statusItem}>
              <div className={styles.statusIcon} style={{ background: 'rgba(255, 255, 255, 0.05)' }}><ShoppingBag size={20} /></div>
              <div className={styles.statusText}>
                <span>누적 주문</span>
                <p>실시간 연동 중</p>
              </div>
            </div>
          </div>
          
          <div className={styles.stockAlert}>
            {product.stock <= 10 && product.stock > 0 && (
              <div className={styles.alertBox}>
                <AlertCircle size={16} /> 재고가 10개 미만입니다. 보충이 필요합니다.
              </div>
            )}
            {product.stock === 0 && (
              <div className={styles.alertBox} style={{ background: 'rgba(255, 68, 68, 0.1)', color: '#ff4444', borderColor: 'rgba(255, 68, 68, 0.2)' }}>
                <AlertCircle size={16} /> 품절 상태입니다. 판매가 중단됩니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
