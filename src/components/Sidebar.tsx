import { NavLink } from "react-router-dom";
import { navDef } from "../data/mockData";
import styles from "./Sidebar.module.css";

export default function Sidebar({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  return (
    <>
      <aside className={`${styles.sidebar} ${open ? styles.open : ""}`}>
        <div className={styles.logoRow}>
          <img src="/bcu-logo.png" alt="Bumitama Corporate University" className={styles.logoImg} />
        </div>
        <div className={styles.brandRow}>
          <div className={styles.brandMark}>B</div>
          <div>
            <div className={styles.brandName}>BCU Analytics</div>
            <div className={styles.brandOrg}>BUMITAMA GUNAJAYA AGRO</div>
          </div>
        </div>

        <nav className={styles.navWrap}>
          <div className={styles.navLabel}>MODUL ANALITIK</div>
          {navDef.map((item) => (
            <NavLink
              key={item.id}
              to={`/${item.id}`}
              onClick={onNavigate}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ""}`}
            >
              <span className={styles.navIcon}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d={item.path} />
                </svg>
              </span>
              <span className={styles.navText}>{item.label}</span>
              <span className={styles.navNum}>{item.num}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.sourceBox}>
          <div className={styles.sourceCard}>
            <div className={styles.sourceLabel}>SUMBER DATA</div>
            <div className={styles.sourceBody}>
              Unggahan terakhir
              <br />
              <strong>02 Agu 2026, 07:14</strong>
            </div>
            <div className={styles.sourceLive}>
              <span className={styles.liveDot} />
              <span className={styles.liveText}>LMS · HRIS · Form evaluasi</span>
            </div>
          </div>
        </div>
      </aside>
      {open && <div className={styles.scrim} onClick={onNavigate} />}
    </>
  );
}
