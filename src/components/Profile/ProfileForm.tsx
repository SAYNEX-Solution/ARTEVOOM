"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./ProfileForm.module.css";
import { User, Mail, Phone, MapPin, Lock, ShieldCheck, AlertCircle } from "lucide-react";

interface ProfileFormProps {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
  };
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    address: user.address || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/user/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        }),
      });

      if (res.ok) {
        setSuccess("프로필 정보가 수정되었습니다.");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.message || "오류가 발생했습니다.");
      }
    } catch (err) {
      setError("서버와의 통신에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      if (res.ok) {
        setSuccess("비밀번호가 성공적으로 변경되었습니다.");
        setFormData({ ...formData, currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        const data = await res.json();
        setError(data.message || "오류가 발생했습니다.");
      }
    } catch (err) {
      setError("서버와의 통신에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Success/Error Alerts */}
      {success && (
        <div className={styles.alertSuccess}>
          <ShieldCheck size={20} /> {success}
        </div>
      )}
      {error && (
        <div className={styles.alertError}>
          <AlertCircle size={20} /> {error}
        </div>
      )}

      <div className={styles.grid}>
        {/* Basic Info Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <User size={20} />
            <h3>기본 정보 수정</h3>
          </div>
          <form onSubmit={handleUpdateProfile} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>이름 (닉네임)</label>
              <div className={styles.inputWrapper}>
                <User size={18} className={styles.icon} />
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="이름을 입력하세요"
                  required
                />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label>이메일</label>
              <div className={styles.inputWrapper}>
                <Mail size={18} className={styles.icon} />
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="이메일을 입력하세요"
                  required
                />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label>전화번호</label>
              <div className={styles.inputWrapper}>
                <Phone size={18} className={styles.icon} />
                <input 
                  type="text" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  placeholder="010-0000-0000"
                />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label>주소</label>
              <div className={styles.inputWrapper}>
                <MapPin size={18} className={styles.icon} />
                <input 
                  type="text" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange} 
                  placeholder="주소를 입력하세요"
                />
              </div>
            </div>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? "처리 중..." : "프로필 저장"}
            </button>
          </form>
        </section>

        {/* Password Change Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Lock size={20} />
            <h3>비밀번호 변경</h3>
          </div>
          <form onSubmit={handleChangePassword} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>현재 비밀번호</label>
              <div className={styles.inputWrapper}>
                <Lock size={18} className={styles.icon} />
                <input 
                  type="password" 
                  name="currentPassword" 
                  value={formData.currentPassword} 
                  onChange={handleChange} 
                  placeholder="현재 비밀번호를 입력하세요"
                  required
                />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label>새 비밀번호</label>
              <div className={styles.inputWrapper}>
                <Lock size={18} className={styles.icon} />
                <input 
                  type="password" 
                  name="newPassword" 
                  value={formData.newPassword} 
                  onChange={handleChange} 
                  placeholder="새 비밀번호를 입력하세요"
                  required
                />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label>새 비밀번호 확인</label>
              <div className={styles.inputWrapper}>
                <Lock size={18} className={styles.icon} />
                <input 
                  type="password" 
                  name="confirmPassword" 
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  placeholder="새 비밀번호를 다시 입력하세요"
                  required
                />
              </div>
            </div>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? "처리 중..." : "비밀번호 변경"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
