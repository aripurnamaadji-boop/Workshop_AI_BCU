import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import KpiCard from "../components/KpiCard";
import Badge from "../components/Badge";
import { evalKpis, sikuPrograms, sikuTotal, sikuDistribution, reactionEval, sikuCriteriaLabels, G, type SikuCriteria } from "../data/mockData";
import styles from "./TrainingEvaluation.module.css";

const CRITERIA: SikuCriteria[] = ["adaptasi", "resiliensi", "analitik", "skala", "need", "komunikasi", "teamwork"];
const PROGRAM_COLORS: Record<string, string> = { BDPE: "#2f5d7c", BDPA: G, BDPK: "#c99a2e" };

export default function TrainingEvaluation() {
  return (
    <div className={styles.page}>
      <PageHeader
        title="Training Evaluation"
        subtitle="Kepuasan mentor lulusan BDP (SIKU) & evaluasi pasca pelatihan Level 1 (Reaction) · Juni 2026"
        pills={["Q3 2026", "Kalteng + Kalbar"]}
      />

      <div className={styles.kpiGrid}>
        {evalKpis.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>

      <div className={styles.twoCol}>
        <Card className={styles.panelCard}>
          <div className={styles.cardTitle}>Penilaian SIKU per kompetensi</div>
          <div className={styles.cardSub}>User Satisfaction on Graduation Trainee · BDPE, BDPA, BDPK</div>
          <div className={styles.legendRow}>
            {Object.entries(PROGRAM_COLORS).map(([p, c]) => (
              <span key={p} className={styles.legendItem}>
                <span className={styles.legendSwatch} style={{ background: c }} /> {p}
              </span>
            ))}
          </div>
          <div className={styles.critList}>
            {CRITERIA.map((crit) => (
              <div key={crit} className={styles.critRow}>
                <div className={styles.critLabel}>{sikuCriteriaLabels[crit]}</div>
                <div className={styles.critBars}>
                  {sikuPrograms.map((p) => (
                    <div key={p.program} className={styles.critBarTrack} title={`${p.program}: ${p.scores[crit].toFixed(1)}`}>
                      <div
                        className={styles.critBarFill}
                        style={{ width: `${p.scores[crit]}%`, background: PROGRAM_COLORS[p.program] }}
                      />
                    </div>
                  ))}
                </div>
                <div className={`${styles.critAvg} tabular`}>{sikuTotal.scores[crit].toFixed(1)}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className={styles.panelCard}>
          <div className={styles.cardTitle}>Distribusi kepuasan mentor</div>
          <div className={styles.cardSub}>Total {sikuTotal.dinilai} lulusan dinilai · skor SIKU 7,68</div>
          <div className={styles.distBar}>
            {sikuDistribution
              .filter((d) => d.pct > 0)
              .map((d) => (
                <div key={d.label} style={{ width: `${d.pct}%`, background: d.color }} title={`${d.label}: ${d.n} (${d.pct}%)`} />
              ))}
          </div>
          <div className={styles.distList}>
            {sikuDistribution.map((d) => (
              <div key={d.label} className={styles.distRow}>
                <span className={styles.distDot} style={{ background: d.color }} />
                <span className={styles.distLabel}>{d.label}</span>
                <span className={`${styles.distN} tabular`}>{d.n}</span>
                <span className={`${styles.distPct} tabular`}>{d.pct}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className={styles.panelCard}>
        <div className={styles.cardTitle}>Evaluasi Level 1 (Reaction) — pasca pelatihan</div>
        <div className={styles.cardSub}>267 feedback submitted · skor rata-rata kepuasan 95,9</div>
        <div className={styles.reactionGrid}>
          {reactionEval.map((r) => (
            <div key={r.label} className={styles.reactionCell}>
              <div className={styles.reactionLabel}>{r.label.toUpperCase()}</div>
              <div className={`${styles.reactionValue} tabular`}>
                {r.score.toFixed(2).replace(".", ",")}
                <span className={styles.reactionUnit}>/ 5</span>
              </div>
              <div className={styles.reactionTrack}>
                <div className={styles.reactionFill} style={{ width: `${r.pct}%` }} />
              </div>
              <div className={styles.reactionPct}>{r.pct.toFixed(1)}%</div>
            </div>
          ))}
        </div>
      </Card>

      <Card className={styles.tableCard}>
        <div className={styles.cardTitle}>Rincian penilaian SIKU per program</div>
        <div className={styles.cardSub}>Skala 1–100 · standar minimum "Puas" ≥ 70</div>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.thLeft}>Program</th>
                <th>Total Lulusan</th>
                <th>Dinilai</th>
                <th>Mentor Puas</th>
                {CRITERIA.map((c) => (
                  <th key={c}>{sikuCriteriaLabels[c]}</th>
                ))}
                <th>Nilai</th>
                <th className={styles.thLeft}>Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {sikuPrograms.map((p) => (
                <tr key={p.program}>
                  <td className={styles.thLeft}>
                    <span className={styles.progBadge} style={{ background: PROGRAM_COLORS[p.program] }}>
                      {p.program}
                    </span>
                  </td>
                  <td className="tabular">{p.totalLulusan}</td>
                  <td className="tabular">{p.dinilai}</td>
                  <td className="tabular">{p.puas}</td>
                  {CRITERIA.map((c) => (
                    <td key={c} className="tabular">
                      {p.scores[c].toFixed(1)}
                    </td>
                  ))}
                  <td className={`tabular ${styles.nilaiCell}`}>{p.nilai.toFixed(1)}</td>
                  <td className={styles.thLeft}>
                    <Badge label={p.ket} bg="#e7f1eb" fg={G} />
                  </td>
                </tr>
              ))}
              <tr className={styles.totalRow}>
                <td className={styles.thLeft}>Total</td>
                <td className="tabular">{sikuTotal.totalLulusan}</td>
                <td className="tabular">{sikuTotal.dinilai}</td>
                <td className="tabular">{sikuTotal.puas}</td>
                {CRITERIA.map((c) => (
                  <td key={c} className="tabular">
                    {sikuTotal.scores[c].toFixed(1)}
                  </td>
                ))}
                <td className={`tabular ${styles.nilaiCell}`}>{sikuTotal.nilai.toFixed(1)}</td>
                <td className={styles.thLeft}>
                  <Badge label="Memenuhi Standar" bg="#e7f1eb" fg={G} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
