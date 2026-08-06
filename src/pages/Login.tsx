import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import styles from "./Login.module.css";

export default function Login() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [setupLoading, setSetupLoading] = useState(false);
  const [setupMsg, setSetupMsg] = useState<string | null>(null);

  if (!loading && user) {
    const redirectTo = (location.state as { from?: string } | null)?.from ?? "/dashboard";
    return <Navigate to={redirectTo} replace />;
  }

  async function handleSetup() {
    setSetupLoading(true);
    setSetupMsg(null);
    try {
      const res = await fetch("/api/auth/seed", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Setup gagal");
      setSetupMsg(data.seeded ? "Akun awal berhasil dibuat. Silakan login." : "Akun sudah pernah di-setup sebelumnya — coba login.");
    } catch (err) {
      setSetupMsg(err instanceof Error ? err.message : String(err));
    } finally {
      setSetupLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(username.trim(), password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <img src="/bcu-logo-dark.png" alt="Bumitama Corporate University" className={styles.logo} />
        <div className={styles.brand}>BCU Analytics</div>
        <div className={styles.subtitle}>Masuk untuk mengakses dashboard monitoring program</div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span className={styles.label}>Username</span>
            <input
              className={styles.input}
              type="text"
              autoComplete="username"
              placeholder="mis. muhamad.adji"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              required
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Password</span>
            <input
              className={styles.input}
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <div className={styles.error}>{error}</div>}

          <button className={styles.submit} type="submit" disabled={submitting}>
            {submitting ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <div className={styles.setupRow}>
          {setupMsg && <div className={styles.setupMsg}>{setupMsg}</div>}
          <button className={styles.setupLink} onClick={handleSetup} disabled={setupLoading} type="button">
            {setupLoading ? "Menyiapkan akun awal..." : "Pertama kali? Setup akun awal"}
          </button>
        </div>
      </div>
    </div>
  );
}
