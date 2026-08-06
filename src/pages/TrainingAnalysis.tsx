import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import KpiCard from "../components/KpiCard";
import { analysisKpis, actingReadiness, talentDev, jobCompetency, G, A, R } from "../data/mockData";
import styles from "./TrainingAnalysis.module.css";

const maxCategory = Math.max(...talentDev.categories.map((c) => c.n));
const maxMonthly = Math.max(...talentDev.monthly.map((m) => m.n));

export default function TrainingAnalysis() {
  return (
    <div className={styles.page}>
      <PageHeader
        title="Training Analysis"
        subtitle="KPI 5 Acting Readiness · KPI 6 Talent Development · KPI 7 Job-based Competency Fulfillment · Juni 2026"
        pills={["Q3 2026", "Se-BGA"]}
      />

      <div className={styles.kpiGrid}>
        {analysisKpis.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>

      <div className={styles.twoCol}>
        <Card className={styles.panelCard}>
          <div className={styles.cardTitle}>KPI 5 — Acting Readiness to Definitive Roles</div>
          <div className={styles.cardSub}>Total populasi staf acting: {actingReadiness.totalStaf} orang</div>

          <div className={styles.batchRow}>
            <div className={styles.batchCell}>
              <div className={styles.batchLabel}>BATCH 1</div>
              <div className={`${styles.batchValue} tabular`}>{actingReadiness.batch1}</div>
              <div className={styles.batchWindow}>{actingReadiness.batch1Window}</div>
            </div>
            <div className={styles.batchCell}>
              <div className={styles.batchLabel}>BATCH 2</div>
              <div className={`${styles.batchValue} tabular`} style={{ color: A }}>
                {actingReadiness.batch2}
              </div>
              <div className={styles.batchWindow}>{actingReadiness.batch2Window}</div>
            </div>
          </div>

          <div className={styles.outcomeTitle}>Outcome Batch 1 — {actingReadiness.outcomeTotal} peserta prajabatan</div>
          <div className={styles.outcomeBar}>
            {actingReadiness.outcomes.map((o) => (
              <div key={o.label} style={{ width: `${o.pct}%`, background: o.color }} title={`${o.label}: ${o.n} (${o.pct}%)`} />
            ))}
          </div>
          <div className={styles.outcomeList}>
            {actingReadiness.outcomes.map((o) => (
              <div key={o.label} className={styles.outcomeRow}>
                <span className={styles.outcomeDot} style={{ background: o.color }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className={styles.outcomeLabel}>
                    {o.label} <span className="tabular">· {o.n} peserta</span>
                  </div>
                  <div className={styles.outcomeNote}>{o.note}</div>
                </div>
                <span className={`${styles.outcomePct} tabular`} style={{ color: o.color }}>
                  {o.pct}%
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className={styles.panelCard}>
          <div className={styles.cardTitle}>KPI 6 — Talent Development Program</div>
          <div className={styles.cardSub}>
            {talentDev.developed}/{talentDev.total} talent telah dikembangkan ({talentDev.pct}%)
          </div>

          {talentDev.groups.map((g) => (
            <div key={g.label} className={styles.groupBlock}>
              <div className={styles.groupHead}>
                <span className={styles.groupLabel}>{g.label}</span>
                <span className={`${styles.groupPct} tabular`}>{g.pct}%</span>
              </div>
              {g.rows.map((r) => (
                <div key={r.role} className={styles.roleRow}>
                  <span className={styles.roleLabel}>{r.role}</span>
                  <div className={styles.roleTrack}>
                    <div
                      className={styles.roleFill}
                      style={{ width: `${r.pct}%`, background: r.pct >= 65 ? G : r.pct >= 45 ? A : R }}
                    />
                  </div>
                  <span className={`${styles.roleVal} tabular`}>
                    {r.n}/{r.total}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </Card>
      </div>

      <div className={styles.twoCol}>
        <Card className={styles.panelCard}>
          <div className={styles.cardTitle}>Kategori pengembangan talent</div>
          <div className={styles.cardSub}>Jumlah talent per jenis program pengembangan</div>
          <div className={styles.catList}>
            {talentDev.categories.map((c) => (
              <div key={c.label} className={styles.catRow}>
                <span className={styles.catLabel}>{c.label}</span>
                <div className={styles.catTrack}>
                  <div className={styles.catFill} style={{ width: `${(c.n / maxCategory) * 100}%` }} />
                </div>
                <span className={`${styles.catN} tabular`}>{c.n}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className={styles.panelCard}>
          <div className={styles.cardTitle}>Sebaran realisasi per bulan</div>
          <div className={styles.cardSub}>Jan – Jul 2026</div>
          <div className={styles.monthlyChart}>
            {talentDev.monthly.map((m) => (
              <div key={m.m} className={styles.monthlyBar}>
                <div className={styles.monthlyN}>{m.n}</div>
                <div className={styles.monthlyTrack} style={{ height: `${(m.n / maxMonthly) * 100}%` }} />
                <div className={styles.monthlyLabel}>{m.m}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className={styles.panelCard}>
        <div className={styles.cardTitle}>KPI 7 — Job-based Competency Fulfillment (Block Curriculum Program)</div>
        <div className={styles.cardSub}>
          Realisasi peserta {jobCompetency.realisasiPeserta}% ({jobCompetency.pesertaAktual}/{jobCompetency.pesertaTarget}) · realisasi
          batch {jobCompetency.realisasiBatch}% ({jobCompetency.batchAktual}/{jobCompetency.batchTarget})
        </div>
        <div className={styles.blokGrid}>
          {jobCompetency.bloks.map((b) => (
            <div key={b.label} className={styles.blokCell}>
              <div className={styles.blokLabel}>{b.label}</div>
              <div className={styles.blokSub}>{b.sub}</div>
              <div className={styles.blokTrack}>
                <div
                  className={styles.blokFill}
                  style={{ width: `${b.pct}%`, background: b.pct >= 70 ? G : b.pct >= 40 ? A : R }}
                />
              </div>
              <div className={styles.blokVal}>
                <span className="tabular">
                  {b.aktual}/{b.target}
                </span>{" "}
                · {b.pct}%
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className={styles.tableCard}>
        <div className={styles.cardTitle}>Issue & action plan</div>
        <div className={styles.cardSub}>Kendala pelaksanaan Block Curriculum Program dan rencana tindak lanjut</div>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.thLeft}>No</th>
                <th className={styles.thLeft}>Issue</th>
                <th className={styles.thLeft}>Problem identification</th>
                <th className={styles.thLeft}>Action plan</th>
                <th>s.d Q2</th>
                <th>Q3</th>
                <th>Q4</th>
              </tr>
            </thead>
            <tbody>
              {jobCompetency.issues.map((i) => (
                <tr key={i.no}>
                  <td className={styles.thLeft}>{i.no}</td>
                  <td className={`${styles.thLeft} ${styles.issueCell}`}>{i.issue}</td>
                  <td className={`${styles.thLeft} ${styles.wrapCell}`}>{i.problem}</td>
                  <td className={`${styles.thLeft} ${styles.wrapCell}`}>{i.action}</td>
                  <td>{i.q2}</td>
                  <td>{i.q3}</td>
                  <td>{i.q4 || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
