import prisma from "@/lib/prisma";
import styles from "../Admin.module.css";
import { Plus } from "lucide-react";

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className={styles.adminPage}>
      <header className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>상품 관리</h1>
          <p>등록된 향수 리스트를 관리하세요.</p>
        </div>
        <button className="btn-premium btn-filled"><Plus size={18} style={{ marginRight: '8px' }} /> 상품 등록</button>
      </header>

      <div className={styles.recentOrders}>
        <div className={styles.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th>이미지</th>
                <th>상품명</th>
                <th>카테고리</th>
                <th>가격</th>
                <th>재고</th>
                <th>상태</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td><div className={styles.tableThumb}>{product.name[0]}</div></td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.price.toLocaleString()}원</td>
                  <td>{product.stock}</td>
                  <td><span className={styles.statusBadge}>{product.stock > 0 ? '판매중' : '품절'}</span></td>
                  <td>
                    <button className={styles.textBtn}>수정</button>
                    <button className={styles.textBtn} style={{ color: '#ff6b6b', marginLeft: '10px' }}>삭제</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
