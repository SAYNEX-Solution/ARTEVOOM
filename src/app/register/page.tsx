"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Navigation from "@/components/Navigation/Navigation";
import styles from "./Register.module.css";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "회원가입 처리 중 오류가 발생했습니다.");
      } else {
        alert("회원가입이 완료되었습니다. 로그인해주세요.");
        router.push("/login");
      }
    } catch (err) {
      setError("서버와의 통신에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    signIn(provider, { callbackUrl: "/" });
  };


  return (
    <main style={{ background: "#1a1918", color: "#e8e2d9", minHeight: "100vh" }}>
      <Navigation />
      
      <div className={styles.splitLayout}>
        <div className={styles.imageSide}>
          <img src="/images/product2.png" alt="ARTEVOOM Perfume" />
        </div>
        
        <div className={styles.formSide}>
          <div className={styles.authBox}>
            <h1 className={styles.title}>SIGN UP</h1>
            <p className={styles.subtitle}>ARTEVOOM의 여정에 함께하세요.</p>
            
            <form className={styles.form} onSubmit={handleSubmit}>
              {error && <div className={styles.error}>{error}</div>}
              
              <input 
                type="text" 
                id="name" 
                className={styles.input}
                value={formData.name}
                onChange={handleChange}
                placeholder="이름"
                required
              />

              <input 
                type="email" 
                id="email" 
                className={styles.input}
                value={formData.email}
                onChange={handleChange}
                placeholder="이메일 주소"
                required
              />
              
              <input 
                type="password" 
                id="password" 
                className={styles.input}
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호 (8자 이상, 영문/숫자/특수문자 조합)"
                minLength={6}
                required
              />

              <input 
                type="password" 
                id="passwordConfirm" 
                className={styles.input}
                value={formData.passwordConfirm}
                onChange={handleChange}
                placeholder="비밀번호 확인"
                minLength={6}
                required
              />

              <div className={styles.optionsRow} style={{ marginTop: '10px', marginBottom: '15px' }}>
                <label className={styles.checkboxWrapper}>
                  <input type="checkbox" required />
                  이용약관, 개인정보 수집 및 이용에 동의합니다.
                </label>
                <Link href="#" className={styles.forgotLink}>
                  약관 보기
                </Link>
              </div>

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? "처리 중..." : "회원가입"}
              </button>
            </form>

            <div className={styles.divider}>또는</div>

            <div className={styles.socialBtns} style={{ flexDirection: 'row' }}>
              <button type="button" className={styles.socialBtn} onClick={() => handleSocialLogin("naver")}>
                <div className={`${styles.socialIcon} ${styles.naverIcon}`}>N</div>
                네이버로 회원가입
              </button>
            </div>



            <div className={styles.footer}>
              이미 계정이 있으신가요? 
              <Link href="/login" className={styles.link}>
                로그인
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
