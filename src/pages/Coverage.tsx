import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import { gaps, heat, levels, mandatory } from "../data/mockData";
import styles from "./Coverage.module.css";

export default function Coverage() {
  return (
    <div className={styles.page}>
      <PageHeader
        title="Training Coverage"
        subtitle="Karyawan unik yang dilatih ÷ headcount target · Q3 2026 · 11.482 karyawan"
        pills={["Q3 2026", "Semua region"]}
      />

      <div className={styles.grid}>
        <div className={styles.col}>
          <Card className={styles.gaugeCard}>
            <div className={styles.gaugeLabel}>COVERAGE RATE KESELURUHAN</div>
            <div className={styles.gaugeWrap}>
              <svg width="192" height="120" viewBox="0 0 192 120">
                <path d="M20 108a76 76 0 1 1 152 0" fill="none" stroke="#edefee" strokeWidth="16" strokeLinecap="round" />
                <path
                  d="M20 108a76 76 0 1 1 152 0"
                  fill="none"
                  stroke="#1f6f4a"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeDasharray="177 239"
                />
                <line x1="96" y1="18" x2="96" y2="42" stroke="#16201b" strokeWidth="2" transform="rotate(63 96 108)" />
                <text x="96" y="94" textAnchor="middle" fontFamily="Source Sans 3" fontSize="34" fontWeight="600" fill="#16201b">
                  74,2%
                </text>
                <text x="96" y="112" textAnchor="middle" fontFamily="Source Code Pro" fontSize="10" fill="#8a938c">
                  TARGET 85,0%
                </text>
              </svg>
            </div>
            <div className={styles.gaugeStats}>
              <div className={styles.gaugeStat}>
                <div className={styles.gaugeStatLabel}>vs Q2 2026</div>
                <div className={styles.gaugeStatValue} style={{ color: "#1f6f4a" }}>
                  +5,1 pt
                </div>
              </div>
              <div className={styles.gaugeStat}>
                <div className={styles.gaugeStatLabel}>Gap ke target</div>
                <div className={styles.gaugeStatValue} style={{ color: "#b77a12" }}>
                  −10,8 pt
                </div>
              </div>
            </div>
          </Card>

          <Card className={styles.mandCard}>
            <div className={styles.cardTitle}>Kepatuhan program wajib</div>
            <div className={styles.cardSub}>Sudut compliance — target 100%</div>
            <div className={styles.mandList}>
              {mandatory.map((m) => (
                <div key={m.label}>
                  <div className={styles.mandRow}>
                    <span className={styles.mandLabel}>{m.label}</span>
                    <span className={`${styles.mandPct} tabular`} style={{ color: m.color }}>
                      {m.pct}%
                    </span>
                  </div>
                  <div className={styles.mandTrack}>
                    <div className={styles.mandFill} style={{ width: `${m.pct}%`, background: m.color }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className={styles.col}>
          <Card className={styles.heatCard}>
            <div className={styles.heatHead}>
              <div>
                <div className={styles.cardTitle}>Heatmap coverage — unit × level jabatan</div>
                <div className={styles.cardSub}>Arahkan kursor untuk melihat headcount · klik sel untuk daftar karyawan</div>
              </div>
              <div className={styles.legendScale}>
                <span className={styles.legendScaleText}>0%</span>
                <div className={styles.legendGradient} />
                <span className={styles.legendScaleText}>100%</span>
              </div>
            </div>
            <div className={styles.heatScroll}>
              <div className={styles.heatGrid}>
                <div />
                {levels.map((l) => (
                  <div key={l} className={styles.heatColHead}>
                    {l}
                  </div>
                ))}
                {heat.map((row) => (
                  <div key={row.code} style={{ display: "contents" }}>
                    <div className={styles.heatRowLabel}>
                      <span className={styles.heatRowCode}>{row.code}</span>
                      <span className={styles.heatRowUnit}>{row.unit}</span>
                    </div>
                    {row.cells.map((c, i) => (
                      <div
                        key={i}
                        title={c.title}
                        className={styles.heatCell}
                        style={{ background: c.bg, color: c.fg }}
                      >
                        {c.v}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <div className={styles.twoCol}>
            <Card className={styles.trendCard}>
              <div className={styles.cardTitle}>Tren coverage per periode</div>
              <div className={styles.cardSub}>Aktual vs garis target 85%</div>
              <svg width="100%" viewBox="0 0 420 168" style={{ marginTop: 10, display: "block" }}>
                <line x1="34" y1="14" x2="412" y2="14" stroke="#edefee" />
                <line x1="34" y1="48" x2="412" y2="48" stroke="#edefee" />
                <line x1="34" y1="82" x2="412" y2="82" stroke="#edefee" />
                <line x1="34" y1="116" x2="412" y2="116" stroke="#edefee" />
                <line x1="34" y1="140" x2="412" y2="140" stroke="#d7dbd8" />
                <text x="26" y="18" textAnchor="end" fontFamily="Source Code Pro" fontSize="9" fill="#a3aba6">100</text>
                <text x="26" y="52" textAnchor="end" fontFamily="Source Code Pro" fontSize="9" fill="#a3aba6">80</text>
                <text x="26" y="86" textAnchor="end" fontFamily="Source Code Pro" fontSize="9" fill="#a3aba6">60</text>
                <text x="26" y="120" textAnchor="end" fontFamily="Source Code Pro" fontSize="9" fill="#a3aba6">40</text>
                <line x1="34" y1="39.5" x2="412" y2="39.5" stroke="#b77a12" strokeWidth="1.4" strokeDasharray="5 4" />
                <text x="408" y="34" textAnchor="end" fontFamily="Source Code Pro" fontSize="9" fill="#b77a12">TARGET 85%</text>
                <path d="M62 108 L120 100 L178 92 L236 84 L294 71 L352 62" fill="none" stroke="#1f6f4a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M352 62 L410 54" fill="none" stroke="#1f6f4a" strokeWidth="2.4" strokeDasharray="4 4" strokeLinecap="round" />
                <circle cx="62" cy="108" r="3.4" fill="#fff" stroke="#1f6f4a" strokeWidth="2" />
                <circle cx="120" cy="100" r="3.4" fill="#fff" stroke="#1f6f4a" strokeWidth="2" />
                <circle cx="178" cy="92" r="3.4" fill="#fff" stroke="#1f6f4a" strokeWidth="2" />
                <circle cx="236" cy="84" r="3.4" fill="#fff" stroke="#1f6f4a" strokeWidth="2" />
                <circle cx="294" cy="71" r="3.4" fill="#fff" stroke="#1f6f4a" strokeWidth="2" />
                <circle cx="352" cy="62" r="4.6" fill="#1f6f4a" />
                <text x="352" y="50" textAnchor="middle" fontFamily="Source Sans 3" fontSize="11" fontWeight="600" fill="#16201b">74,2</text>
                <text x="62" y="158" textAnchor="middle" fontFamily="Source Code Pro" fontSize="9" fill="#a3aba6">Q2/25</text>
                <text x="120" y="158" textAnchor="middle" fontFamily="Source Code Pro" fontSize="9" fill="#a3aba6">Q3/25</text>
                <text x="178" y="158" textAnchor="middle" fontFamily="Source Code Pro" fontSize="9" fill="#a3aba6">Q4/25</text>
                <text x="236" y="158" textAnchor="middle" fontFamily="Source Code Pro" fontSize="9" fill="#a3aba6">Q1/26</text>
                <text x="294" y="158" textAnchor="middle" fontFamily="Source Code Pro" fontSize="9" fill="#a3aba6">Q2/26</text>
                <text x="352" y="158" textAnchor="middle" fontFamily="Source Code Pro" fontSize="9" fill="#16201b">Q3/26</text>
                <text x="410" y="158" textAnchor="middle" fontFamily="Source Code Pro" fontSize="9" fill="#a3aba6">Q4/26</text>
              </svg>
            </Card>

            <Card className={styles.gapCard}>
              <div className={styles.gapHead}>
                <div>
                  <div className={styles.cardTitle}>Belum ter-cover</div>
                  <div className={styles.cardSub}>Diurutkan dari gap terbesar · 2.961 karyawan</div>
                </div>
                <div className={styles.exportBtn}>Ekspor daftar</div>
              </div>
              <div className={styles.gapScroll}>
                <div className={styles.gapTableHead}>
                  <span className={styles.gapTh}>UNIT / LEVEL</span>
                  <span className={`${styles.gapTh} ${styles.gapThRight}`}>HEADCOUNT</span>
                  <span className={`${styles.gapTh} ${styles.gapThRight}`}>GAP</span>
                  <span className={`${styles.gapTh} ${styles.gapThRight}`}>TERAKHIR DILATIH</span>
                </div>
                {gaps.map((g) => (
                  <div key={g.unit + g.level} className={styles.gapRow}>
                    <div>
                      <div className={styles.gapUnit}>{g.unit}</div>
                      <div className={styles.gapLevel}>{g.level}</div>
                    </div>
                    <span className={`${styles.gapHc} tabular`}>{g.hc}</span>
                    <span className={`${styles.gapGap} tabular`}>{g.gap}</span>
                    <span className={styles.gapLast}>{g.last}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
