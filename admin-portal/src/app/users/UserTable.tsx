'use client'

import { useState, useEffect } from 'react';
import { Search, Filter, Download, MoreVertical, Trash2, Shield, User as UserIcon } from "lucide-react";
import * as XLSX from 'xlsx';
import styles from "../Admin.module.css";

export default function UserTable() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // ALL, ADMIN, USER, EMPTY

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDownloadExcel = () => {
    if (filteredUsers.length === 0) return alert('다운로드할 데이터가 없습니다.');

    // 엑셀에 들어갈 데이터 가공
    const excelData = filteredUsers.map(user => ({
      '구분': user.role === 'ADMIN' ? '관리자' : '고객',
      '이름': user.name || '(이름 없음)',
      '아이디(이메일)': user.email || '(이메일 없음)',
      '비밀번호(해시)': user.password || 'SOCIAL_LOGIN',
      '전화번호': user.phone || '-',
      '가입일': user.createdAt ? new Date(user.createdAt).toLocaleDateString('ko-KR') : '-'
    }));

    // 시트 생성
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

    // 컬럼 너비 설정
    const maxWidths = [10, 15, 30, 40, 15, 15];
    worksheet['!cols'] = maxWidths.map(w => ({ wch: w }));

    // 파일 다운로드
    XLSX.writeFile(workbook, `ARTEVOOM_고객리스트_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말로 이 계정을 삭제하시겠습니까?')) return;
    try {
      const res = await fetch('/api/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== id));
      }
    } catch (err) {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.phone?.includes(searchTerm));
    
    if (filterType === 'ADMIN') return matchesSearch && user.role === 'ADMIN';
    if (filterType === 'USER') return matchesSearch && user.role === 'USER';
    if (filterType === 'EMPTY') return matchesSearch && (!user.email || !user.name);
    
    return matchesSearch;
  });

  if (loading) return <div className={styles.empty}>로딩 중...</div>;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.headerActions}>
          <div className={styles.searchBar}>
            <Search size={18} />
            <input 
              type="text" 
              placeholder="이름, 이메일, 전화번호 검색..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.rightActions}>
          <select 
            className={styles.filterDropdown}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{ marginRight: '10px', height: '38px' }}
          >
            <option value="ALL">전체 고객</option>
            <option value="ADMIN">관리자</option>
            <option value="USER">일반 고객</option>
            <option value="EMPTY">빈 계정 (정리용)</option>
          </select>
          <button className={styles.actionBtn} onClick={handleDownloadExcel}>
            <Download size={16} /> 엑셀 다운로드
          </button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th>구분</th>
                <th>이름</th>
                <th>아이디(이메일)</th>
                <th>비밀번호(해시)</th>
                <th>전화번호</th>
                <th>가입일</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '100px 0', opacity: 0.3 }}>
                    검색 결과가 없습니다.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td data-label="구분">
                      {user.role === 'ADMIN' ? (
                        <span className={styles.statusBadge} data-status="PAID" style={{ display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}>
                          <Shield size={12} /> 관리자
                        </span>
                      ) : (
                        <span className={styles.statusBadge} data-status="DELIVERED" style={{ display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}>
                          <UserIcon size={12} /> 고객
                        </span>
                      )}
                    </td>
                    <td data-label="이름"><strong>{user.name || '(이름 없음)'}</strong></td>
                    <td data-label="이메일" style={{ color: user.email ? 'inherit' : '#a33' }}>{user.email || '(이메일 없음)'}</td>
                    <td data-label="비밀번호" style={{ opacity: 0.3, fontSize: '0.65rem', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.password || 'SOCIAL_LOGIN'}
                    </td>
                    <td data-label="전화번호">{user.phone || '-'}</td>
                    <td data-label="가입일" style={{ opacity: 0.5 }}>
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\.$/, '') : '-'}
                    </td>
                    <td data-label="관리">
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                          className={styles.iconBtn} 
                          onClick={() => handleDelete(user.id)}
                          title="삭제"
                          style={{ color: '#ff4444' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
