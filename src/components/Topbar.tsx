import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { filters } from "../data/mockData";
import { useAuth } from "../auth/AuthContext";
import styles from "./Topbar.module.css";

function initialsOf(username: string): string {
  const parts = username.replace(/[._-]+/g, " ").trim().split(/\s+/);
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
}

export default function Topbar({ title }: { title: string }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className={styles.topbar}>
      <div className={styles.title}>{title}</div>
      <div className={styles.spacer} />
      <div className={styles.filters}>
        {filters.map((f) => (
          <label key={f.label} className={styles.filterLabel}>
            <span className={styles.filterTag}>{f.label}</span>
            <select className={styles.filterSelect} defaultValue={f.options[0]}>
              {f.options.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <div className={styles.divider} />
      <div className={styles.actions}>
        <div className={styles.exportBtn}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 2v8m0 0 3-3m-3 3L5 7M2.5 11.5v1a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-1" />
          </svg>
          Ekspor
        </div>
        <div className={styles.userMenu}>
          <button className={styles.avatar} onClick={() => setMenuOpen((v) => !v)} aria-label="Menu akun">
            {user ? initialsOf(user.username) : "?"}
          </button>
          {menuOpen && (
            <>
              <div className={styles.menuScrim} onClick={() => setMenuOpen(false)} />
              <div className={styles.menuPanel}>
                <div className={styles.menuUsername}>{user?.username}</div>
                <button className={styles.menuLogout} onClick={handleLogout}>
                  Keluar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
