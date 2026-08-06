import { filters } from "../data/mockData";
import styles from "./Topbar.module.css";

export default function Topbar({ title }: { title: string }) {
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
        <div className={styles.avatar}>HS</div>
      </div>
    </header>
  );
}
