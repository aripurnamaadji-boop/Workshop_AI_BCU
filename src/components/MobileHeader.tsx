import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import styles from "./MobileHeader.module.css";

function initialsOf(username: string): string {
  const parts = username.replace(/[._-]+/g, " ").trim().split(/\s+/);
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
}

export default function MobileHeader({
  title,
  chips,
  onMenuClick,
}: {
  title: string;
  chips: string[];
  onMenuClick: () => void;
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleAvatarClick() {
    if (window.confirm("Keluar dari akun?")) {
      await logout();
      navigate("/login", { replace: true });
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.bar}>
        <button className={styles.menuBtn} onClick={onMenuClick} aria-label="Buka menu">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M3 6h14M3 10h14M3 14h14" />
          </svg>
        </button>
        <div className={styles.titleBlock}>
          <div className={styles.title}>{title}</div>
          <div className={styles.subtitle}>BCU ANALYTICS · Q3 2026</div>
        </div>
        <button className={styles.avatar} onClick={handleAvatarClick} aria-label="Keluar">
          {user ? initialsOf(user.username) : "?"}
        </button>
      </div>
      {chips.length > 0 && (
        <div className={styles.chips}>
          {chips.map((c, i) => (
            <span key={c} className={`${styles.chip} ${i === 0 ? styles.active : ""}`}>
              {c}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
