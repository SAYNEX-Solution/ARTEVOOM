"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navigation from "@/components/Navigation/Navigation";
import styles from "./Login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("로그인 처리 중 오류가 발생했습니다.");
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
          <img src="/images/product1.png" alt="ARTEVOOM Perfume" />
        </div>
        
        <div className={styles.formSide}>
          <div className={styles.authBox}>
            <h1 className={styles.title}>LOGIN</h1>
            <p className={styles.subtitle}>ARTEVOOM 회원이 되시면 다양한 혜택을 누리실 수 있습니다.</p>
            
            <form className={styles.form} onSubmit={handleSubmit}>
              {error && <div className={styles.error}>{error}</div>}
              
              <input 
                type="email" 
                id="email" 
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일 주소"
                required
              />
              
              <input 
                type="password" 
                id="password" 
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호"
                required
              />

              <div className={styles.optionsRow}>
                <label className={styles.checkboxWrapper}>
                  <input type="checkbox" />
                  아이디 저장
                </label>
                <Link href="#" className={styles.forgotLink}>
                  비밀번호 찾기
                </Link>
              </div>

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? "처리 중..." : "로그인"}
              </button>
            </form>

            <div className={styles.divider}>또는</div>

            <div className={styles.footer}>
              아직 계정이 없으신가요? 
              <Link href="/register" className={styles.link}>
                회원가입
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
