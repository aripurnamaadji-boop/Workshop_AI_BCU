import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import KpiCard from "../components/KpiCard";
import Badge from "../components/Badge";
import { attention, kpis, progs, quicklinks, statusOf, waffle } from "../data/mockData";
import styles from "./Dashboard.module.css";

const TABS = [
  { id: "killer", label: "Killer" },
  { id: "regular", label: "Regular" },
  { id: "talent", label: "Talent Development" },
] as const;

const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

export default function Dashboard() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("killer");
  const navigate = useNavigate();
  const P = progs[tab];
  const maxPlan = Math.max(...P.timeline);

  return (
    <div className={styles.page}>
      <PageHeader
        title="Selamat pagi, Hendra."
        subtitle="Rabu, 5 Agustus 2026 · Data per kuartal berjalan (Q3 2026) · 11.482 karyawan target"
        pills={["Q3 2026", "Semua region", "Semua level"]}
      />

      <div className={styles.kpiGrid}>
        {kpis.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>

      <div className={styles.mainGrid}>
        <Card className={styles.programCard}>
          <div className={styles.programHead}>
            <div>
              <div className={styles.programTitle}>Monitoring Program BCU</div>
              <div className={styles.programSub}>Rencana vs realisasi tiga kategori program · klik program untuk detail kelas</div>
            </div>
            <div className={styles.tabs}>
              {TABS.map((t) => (
                <button
                  key={t.id}
                  className={`${styles.tab} ${tab === t.id ? styles.active : ""}`}
                  onClick={() => setTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.statsRow}>
            {P.stats.map(([label, value, sub]) => (
              <div key={label} className={styles.statCell}>
                <div className={styles.statLabel}>{label}</div>
                <div className={`${styles.statValue} tabular`}>{value}</div>
                <div className={styles.statSub}>{sub}</div>
              </div>
            ))}
          </div>

          <div className={styles.timelineBox}>
            <div className={styles.timelineHead}>
              <span className={styles.timelineTag}>LINIMASA REALISASI KELAS · JAN–DES 2026</span>
              <div className={styles.legend}>
                <span className={styles.legendItem}>
                  <span className={styles.legendSwatch} style={{ background: "#cfe3d8" }} /> Rencana
                </span>
                <span className={styles.legendItem}>
                  <span className={styles.legendSwatch} style={{ background: "#1f6f4a" }} /> Realisasi
                </span>
              </div>
            </div>
            <div className={styles.chart}>
              {P.timeline.map((plan, i) => {
                const actPct = Math.round(P.actual[i] * 100);
                const color = P.actual[i] >= 0.85 ? "#1f6f4a" : P.actual[i] >= 0.6 ? "#b77a12" : "#b3261e";
                const planH = Math.round((plan / maxPlan) * 62) + 6;
                return (
                  <div
                    key={i}
                    className={styles.month}
                    title={`Rencana ${plan} kelas · realisasi ${Math.round(plan * P.actual[i])} kelas`}
                  >
                    <div className={styles.planBar} style={{ height: planH }}>
                      <div className={styles.actBar} style={{ height: `${actPct}%`, background: color }} />
                    </div>
                    <div className={styles.monthLabel}>{MONTHS[i]}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.tableBox}>
            <div className={styles.tableHead}>
              <span className={styles.th}>PROGRAM</span>
              <span className={styles.th}>PESERTA</span>
              <span className={styles.th}>PLAN VS ACTUAL</span>
              <span className={`${styles.th} ${styles.thRight}`}>ANGGARAN</span>
              <span className={`${styles.th} ${styles.thRight}`}>STATUS</span>
            </div>
            {P.rows.map(([name, code, region, actual, plan, budget, window]) => {
              const pct = Math.round((actual / plan) * 100);
              const [status, badgeBg, badgeFg, color] = statusOf(pct);
              return (
                <div key={code} className={styles.tableRow}>
                  <div>
                    <div className={styles.progName}>{name}</div>
                    <div className={styles.progMeta}>
                      {code} · {region}
                    </div>
                  </div>
                  <div className={`${styles.progParticip} tabular`}>
                    {actual} <span>/ {plan}</span>
                  </div>
                  <div>
                    <div className={styles.progBarTrack}>
                      <div className={styles.progBarFill} style={{ width: `${pct}%`, background: color }} />
                    </div>
                    <div className={styles.progBarNote}>
                      {pct}% realisasi · {window}
                    </div>
                  </div>
                  <div className={`${styles.progBudget} tabular`}>{budget}</div>
                  <div className={styles.progStatus}>
                    <Badge label={status} bg={badgeBg} fg={badgeFg} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <div className={styles.sideCol}>
          <Card className={styles.sideCard}>
            <div className={styles.sideCardHead}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#b3261e" strokeWidth="1.5">
                <path d="M8 5.5v3.2M8 11h.01M7.1 2.4 1.6 12a1 1 0 0 0 .9 1.5h11a1 1 0 0 0 .9-1.5L8.9 2.4a1 1 0 0 0-1.8 0Z" />
              </svg>
              <span className={styles.sideCardTitle}>Perlu perhatian</span>
              <span className={styles.countPill}>{attention.length}</span>
            </div>
            <div className={styles.attentionList}>
              {attention.map((a) => (
                <div key={a.title} className={styles.attentionRow}>
                  <span className={styles.attentionBar} style={{ background: a.color }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className={styles.attentionTitle}>{a.title}</div>
                    <div className={styles.attentionBody}>{a.body}</div>
                  </div>
                  <span className={`${styles.attentionMetric} tabular`} style={{ color: a.color }}>
                    {a.metric}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className={styles.sideCard}>
            <div className={styles.popTitle}>Jangkauan populasi</div>
            <div className={styles.popSub}>1 ikon = 115 karyawan · target 11.482</div>
            <div className={styles.waffle}>
              {waffle.map((w, i) => (
                <svg key={i} width="100%" viewBox="0 0 10 14" fill={w.c}>
                  <circle cx="5" cy="3.4" r="2.6" />
                  <path d="M0 14v-3.2C0 8.6 2.2 7.4 5 7.4s5 1.2 5 3.4V14Z" />
                </svg>
              ))}
            </div>
            <div className={styles.popStats}>
              <div className={styles.popStat}>
                <div className={styles.popStatLabel}>Sudah dilatih</div>
                <div className={`${styles.popStatValue} tabular`} style={{ color: "#1f6f4a" }}>
                  8.521
                </div>
              </div>
              <div className={styles.popStat}>
                <div className={styles.popStatLabel}>Belum tersentuh</div>
                <div className={`${styles.popStatValue} tabular`} style={{ color: "#b3261e" }}>
                  2.961
                </div>
              </div>
              <div className={styles.popStat}>
                <div className={styles.popStatLabel}>Gap ke target 85%</div>
                <div className={`${styles.popStatValue} tabular`} style={{ color: "#16201b" }}>
                  1.239
                </div>
              </div>
            </div>
          </Card>

          <Card className={styles.sideCard}>
            <div className={styles.popTitle}>Drill-down cepat</div>
            <div className={styles.quickLinks}>
              {quicklinks.map((q) => (
                <button key={q.n} className={styles.quickLink} onClick={() => navigate(`/${q.screen}`)}>
                  <span className={styles.quickLinkNum}>{q.n}</span>
                  <span className={styles.quickLinkLabel}>{q.label}</span>
                  <span className={`${styles.quickLinkVal} tabular`}>{q.val}</span>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#a3aba6" strokeWidth="1.6">
                    <path d="m6 3 5 5-5 5" />
                  </svg>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
