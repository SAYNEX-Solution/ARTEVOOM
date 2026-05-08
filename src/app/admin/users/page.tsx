import prisma from "@/lib/prisma";
import styles from "../Admin.module.css";
import { Search, Filter, Download, MoreVertical } from "lucide-react";

export default async function AdminUsers() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className={styles.usersPage}>
      <header className={styles.dashboardHero}>
        <h2>고객 관리</h2>
        <p>전체 회원의 상세 정보와 활동 내역을 관리합니다.</p>
      </header>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.headerActions}>
            <div className={styles.searchBar}>
              <Search size={18} />
              <input type="text" placeholder="이름, 이메일, 전화번호 검색..." />
            </div>
          </div>
          <div className={styles.rightActions}>
            <button className={styles.actionBtn}><Filter size={16} /> 필터</button>
            <button className={styles.actionBtn}><Download size={16} /> 엑셀 다운로드</button>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th>이름</th>
                <th>아이디 (이메일)</th>
                <th>비밀번호 (해시)</th>
                <th>전화번호</th>
                <th>주소</th>
                <th>가입일</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td><strong>{user.name}</strong></td>
                  <td>{user.email}</td>
                  <td style={{ opacity: 0.3, fontSize: '0.7rem' }}>
                    {user.password ? 'ENCRYPTED_SHA256' : 'OAUTH_LOGIN'}
                  </td>
                  <td>{user.phone || '-'}</td>
                  <td>{user.address || '-'}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className={styles.iconBtn}><MoreVertical size={16} /></button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={7} style={{textAlign: 'center', padding: '60px', opacity: 0.3}}>
                    등록된 회원이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
