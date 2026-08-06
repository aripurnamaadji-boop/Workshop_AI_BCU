import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import KpiCard from "../components/KpiCard";
import {
  hoursKpis,
  hoursHeadline,
  hoursByCategory,
  hoursTrend,
  hoursByLevel,
  hoursByRegion,
  hoursRecommendations,
  G,
  A,
  R,
} from "../data/mockData";
import styles from "./TrainingHours.module.css";

const maxCategoryHours = Math.max(...hoursByCategory.map((c) => c.hours));
const maxTrend = Math.max(...hoursTrend.map((t) => Math.max(t.target, t.actual)));
const sortedRegion = [...hoursByRegion].sort((a, b) => a.actual - b.actual);

function levelColor(actual: number, target: number): string {
  const pct = actual / target;
  if (pct >= 0.95) return G;
  if (pct >= 0.75) return A;
  return R;
}

export default function TrainingHours() {
  return (
    <div className={styles.page}>
      <PageHeader
        title="Training Hours & Days"
        subtitle="Volume, distribusi, dan kedalaman waktu pelatihan · Juni 2026"
        pills={["Q3 2026", "Semua region"]}
      />

      <div className={styles.headline}>
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="1.4" className={styles.headlineIcon}>
          <path d="M8 1.5a4.5 4.5 0 0 0-2.6 8.2c.4.3.6.7.6 1.2v.6h4v-.6c0-.5.2-.9.6-1.2A4.5 4.5 0 0 0 8 1.5ZM6.2 14h3.6M6.7 12.5h2.6" />
        </svg>
        <div>
          <div className={styles.headlineTag}>KEY INSIGHT</div>
          <div className={styles.headlineText}>{hoursHeadline}</div>
        </div>
      </div>

      <div className={styles.kpiGrid}>
        {hoursKpis.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>

      <div className={styles.twoCol}>
        <Card className={styles.panelCard}>
          <div className={styles.cardTitle}>Distribusi jam pelatihan per kategori program</div>
          <div className={styles.cardSub}>Total 128.940 jam · 3.226 hari</div>
          <div className={styles.catList}>
            {hoursByCategory.map((c) => (
              <div key={c.label} className={styles.catRow}>
                <div className={styles.catHead}>
                  <span className={styles.catLabel}>{c.label}</span>
                  <span className={`${styles.catVal} tabular`}>
                    {c.hours.toLocaleString("id-ID")} jam <span className={styles.catValMuted}>· {c.days} hari</span>
                  </span>
                </div>
                <div className={styles.catTrack}>
                  <div className={styles.catFill} style={{ width: `${(c.hours / maxCategoryHours) * 100}%`, background: c.color }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className={styles.panelCard}>
          <div className={styles.cardTitle}>Tren realisasi vs target bulanan</div>
          <div className={styles.cardSub}>Jam pelatihan · Jan–Jun 2026</div>
          <svg width="100%" viewBox="0 0 420 180" style={{ marginTop: 10, display: "block" }}>
            {[0, 1, 2, 3].map((i) => (
              <line key={i} x1="34" y1={14 + i * 34} x2="412" y2={14 + i * 34} stroke="#edefee" />
            ))}
            {hoursTrend.map((t, i) => (
              <text key={t.m} x={62 + i * 70} y="168" textAnchor="middle" fontFamily="Source Code Pro" fontSize="9.5" fill="#a3aba6">
                {t.m}
              </text>
            ))}
            <path
              d={`M ${hoursTrend.map((t, i) => `${62 + i * 70} ${150 - (t.target / maxTrend) * 136}`).join(" L ")}`}
              fill="none"
              stroke="#b77a12"
              strokeWidth="1.6"
              strokeDasharray="5 4"
            />
            <path
              d={`M ${hoursTrend.map((t, i) => `${62 + i * 70} ${150 - (t.actual / maxTrend) * 136}`).join(" L ")}`}
              fill="none"
              stroke="#1f6f4a"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {hoursTrend.map((t, i) => (
              <circle key={t.m} cx={62 + i * 70} cy={150 - (t.actual / maxTrend) * 136} r="3.4" fill="#fff" stroke="#1f6f4a" strokeWidth="2" />
            ))}
          </svg>
          <div className={styles.trendLegend}>
            <span className={styles.legendItem}>
              <span className={styles.legendSwatch} style={{ background: G }} /> Aktual
            </span>
            <span className={styles.legendItem}>
              <span className={styles.legendSwatch} style={{ background: A }} /> Target
            </span>
          </div>
        </Card>
      </div>

      <div className={styles.twoCol}>
        <Card className={styles.panelCard}>
          <div className={styles.cardTitle}>Rata-rata jam pelatihan per level jabatan</div>
          <div className={styles.cardSub}>Garis putus-putus = target 16 jam/karyawan</div>
          <div className={styles.levelChart}>
            {hoursByLevel.map((l) => (
              <div key={l.level} className={styles.levelBarWrap}>
                <div className={styles.levelTrack}>
                  <div className={styles.levelTarget} style={{ left: `${(l.target / 18) * 100}%` }} />
                  <div
                    className={styles.levelFill}
                    style={{ width: `${(l.actual / 18) * 100}%`, background: levelColor(l.actual, l.target) }}
                  />
                </div>
                <div className={styles.levelFoot}>
                  <span className={styles.levelLabel}>{l.level}</span>
                  <span className={`${styles.levelVal} tabular`}>{l.actual.toFixed(1)} jam</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className={styles.tableCardCompact}>
          <div className={styles.cardTitle}>Unit dengan gap terbesar</div>
          <div className={styles.cardSub}>Diurutkan dari realisasi jam/karyawan terendah</div>
          <div className={styles.gapList}>
            {sortedRegion.slice(0, 6).map((u) => {
              const gap = u.actual - u.target;
              return (
                <div key={u.unit} className={styles.gapRow}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className={styles.gapUnit}>{u.unit}</div>
                    <div className={styles.gapHours}>{u.hours.toLocaleString("id-ID")} jam terealisasi</div>
                  </div>
                  <span className={`${styles.gapVal} tabular`} style={{ color: levelColor(u.actual, u.target) }}>
                    {u.actual.toFixed(1)} <span className={styles.gapUnitLabel}>jam</span>
                  </span>
                  <span className={`${styles.gapDelta} tabular`} style={{ color: gap < 0 ? R : G }}>
                    {gap >= 0 ? "+" : ""}
                    {gap.toFixed(1)}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className={styles.recoSection}>
        <div className={styles.recoHead}>
          <div className={styles.cardTitle}>Rekomendasi — 3 horizon</div>
          <div className={styles.cardSub}>Prioritas tindak lanjut berdasarkan urgensi dan dampak</div>
        </div>
        <div className={styles.recoGrid}>
          {hoursRecommendations.map((r, i) => (
            <div key={r.title} className={styles.recoCard}>
              <div className={styles.recoNum}>{i + 1}</div>
              <div className={styles.recoHorizon}>{r.horizon}</div>
              <div className={styles.recoTitle}>{r.title}</div>
              <div className={styles.recoRationale}>{r.rationale}</div>
              <div className={styles.recoOwner}>{r.owner}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
