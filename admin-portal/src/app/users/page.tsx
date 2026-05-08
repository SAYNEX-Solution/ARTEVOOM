import UserTable from "./UserTable";
import styles from "../Admin.module.css";

export const dynamic = 'force-dynamic';

export default function AdminUsers() {
  return (
    <div className={styles.usersPage}>
      <header className={styles.dashboardHero}>
        <h2>고객 관리</h2>
        <p>전체 회원의 상세 정보와 활동 내역을 관리합니다. 빈 계정은 필터링하여 정리할 수 있습니다.</p>
      </header>

      <UserTable />
    </div>
  );
}
