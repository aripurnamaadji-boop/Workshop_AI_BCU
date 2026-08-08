import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { filters } from "../data/mockData";
import { useAuth } from "../auth/AuthContext";
import { initialsOf } from "../auth/userDisplay";
import { useFilters, type ProgramFilter } from "../filters/FilterContext";
import { CATEGORY_LABELS, periodLabel, type BcuCategory } from "../data/bcuApi";
import styles from "./Topbar.module.css";

const PROGRAM_OPTIONS: ProgramFilter[] = ["all", "grand", "killer_staff", "killer_nonstaff", "reguler", "mandatory", "talent"];

function programLabel(p: ProgramFilter): string {
  return p === "all" ? "Semua program" : CATEGORY_LABELS[p as BcuCategory];
}

export default function Topbar({ title }: { title: string }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { program, setProgram, period, setPeriod, availablePeriods } = useFilters();

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className={styles.topbar}>
      <div className={styles.title}>{title}</div>
      <div className={styles.spacer} />
      <div className={styles.filters}>
        <label className={styles.filterLabel}>
          <span className={styles.filterTag}>PERIODE</span>
          {availablePeriods.length > 0 ? (
            <select
              className={styles.filterSelect}
              value={period ?? availablePeriods[0]}
              onChange={(e) => setPeriod(e.target.value)}
            >
              {availablePeriods.map((p) => (
                <option key={p} value={p}>
                  {periodLabel(p)}
                </option>
              ))}
            </select>
          ) : (
            <select className={styles.filterSelect} defaultValue={filters[0].options[0]}>
              {filters[0].options.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          )}
        </label>

        {filters.slice(1, 3).map((f) => (
          <label key={f.label} className={styles.filterLabel}>
            <span className={styles.filterTag}>{f.label}</span>
            <select className={styles.filterSelect} defaultValue={f.options[0]}>
              {f.options.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>
        ))}

        <label className={styles.filterLabel}>
          <span className={styles.filterTag}>PROGRAM</span>
          <select className={styles.filterSelect} value={program} onChange={(e) => setProgram(e.target.value as ProgramFilter)}>
            {PROGRAM_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {programLabel(p)}
              </option>
            ))}
          </select>
        </label>
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
