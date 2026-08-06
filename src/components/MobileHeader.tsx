import styles from "./MobileHeader.module.css";

export default function MobileHeader({
  title,
  chips,
  onMenuClick,
}: {
  title: string;
  chips: string[];
  onMenuClick: () => void;
}) {
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
        <div className={styles.avatar}>HS</div>
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
