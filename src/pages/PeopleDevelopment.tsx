import { useState } from "react";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import KpiCard from "../components/KpiCard";
import Badge from "../components/Badge";
import { getCell, getNinebox, kanban, pdKpis, succession, type CellId } from "../data/mockData";
import styles from "./PeopleDevelopment.module.css";

export default function PeopleDevelopment() {
  const [cell, setCell] = useState<CellId>("3-1");
  const ninebox = getNinebox(cell);
  const { cellTitle, cellCount, cellPeople } = getCell(cell);

  return (
    <div className={styles.page}>
      <PageHeader
        title="People Development"
        subtitle="Progres IDP, talent pool dan kesiapan suksesi posisi kunci kebun & mill"
        pills={["Q3 2026", "Hi-po + Core"]}
      />

      <div className={styles.kpiGrid}>
        {pdKpis.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>

      <div className={styles.grid3}>
        <Card className={styles.nineboxCard}>
          <div className={styles.cardTitle}>Matriks 9-box</div>
          <div className={styles.cardSub}>Kinerja (horizontal) × potensi (vertikal) · klik sel untuk daftar nama</div>
          <div className={styles.nineboxBody}>
            <div className={styles.axisY}>
              <span className={styles.axisYText}>POTENSI →</span>
            </div>
            <div className={styles.nineboxGrid}>
              <div className={styles.nineboxCells}>
                {ninebox.map((b) => (
                  <div
                    key={b.id}
                    className={styles.nineboxCell}
                    style={{ background: b.bg, borderColor: b.border }}
                    onClick={() => setCell(b.id)}
                  >
                    <div className={styles.nineboxCellLabel} style={{ color: b.fg }}>
                      {b.label}
                    </div>
                    <div className={styles.nineboxCellN}>
                      <span className={styles.nineboxCellNum} style={{ color: b.fg }}>
                        {b.n}
                      </span>
                      <span className={styles.nineboxCellUnit} style={{ color: b.fg }}>
                        orang
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.axisX}>KINERJA →</div>
            </div>
          </div>

          <div className={styles.cellPanel}>
            <div className={styles.cellPanelHead}>
              <span className={styles.cellPanelTitle}>{cellTitle}</span>
              <span className={styles.cellPanelCount}>{cellCount}</span>
            </div>
            <div className={styles.cellPeople}>
              {cellPeople.map((p) => (
                <div key={p.name} className={styles.person}>
                  <span className={styles.avatar} style={{ background: p.av }}>
                    {p.ini}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className={styles.personName}>{p.name}</div>
                    <div className={styles.personRole}>{p.role}</div>
                  </div>
                  <span className={styles.personUnit}>{p.unit}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className={styles.successionCard}>
          <div className={styles.successionHead}>
            <div>
              <div className={styles.cardTitle}>Papan kesiapan suksesi</div>
              <div className={styles.cardSub}>Posisi kunci kebun &amp; mill</div>
            </div>
            <div className={styles.successionLegend}>
              <span className={styles.legendItem}>
                <span className={styles.legendSwatch} style={{ background: "#1f6f4a" }} /> Ready now
              </span>
              <span className={styles.legendItem}>
                <span className={styles.legendSwatch} style={{ background: "#7fb79a" }} /> 1–2 thn
              </span>
              <span className={styles.legendItem}>
                <span className={styles.legendSwatch} style={{ background: "#d5ded8" }} /> 3+ thn
              </span>
            </div>
          </div>
          <div className={styles.successionList}>
            {succession.map((s) => (
              <div key={s.pos} className={styles.successionRow}>
                <div>
                  <div className={styles.successionPos}>{s.pos}</div>
                  <div className={styles.successionHolder}>{s.holder}</div>
                </div>
                <div className={styles.slots}>
                  {s.slots.map((slot, i) => (
                    <span key={i} title={slot.t} className={styles.slot} style={{ background: slot.c }} />
                  ))}
                </div>
                <div className={styles.riskCol}>
                  <Badge label={s.risk} bg={s.badgeBg} fg={s.badgeFg} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className={styles.profileCard}>
          <div className={styles.profileHead}>
            <span className={styles.profileAvatar}>AS</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className={styles.profileName}>Agus Setiawan</div>
              <div className={styles.profileRole}>Asisten Kepala · Estate Bukit Santuai</div>
            </div>
            <Badge label="Hi-po" bg="#e7f1eb" fg="#1f6f4a" />
          </div>
          <div className={styles.profileLabel}>PROFIL KOMPETENSI</div>
          <svg width="100%" viewBox="0 0 280 210" style={{ marginTop: 4, display: "block" }}>
            <polygon points="140,26 249,105 207,192 73,192 31,105" fill="none" stroke="#e7eae8" />
            <polygon points="140,66 194,105 173,148 107,148 86,105" fill="none" stroke="#e7eae8" />
            <line x1="140" y1="106" x2="140" y2="26" stroke="#edefee" />
            <line x1="140" y1="106" x2="249" y2="105" stroke="#edefee" />
            <line x1="140" y1="106" x2="207" y2="192" stroke="#edefee" />
            <line x1="140" y1="106" x2="73" y2="192" stroke="#edefee" />
            <line x1="140" y1="106" x2="31" y2="105" stroke="#edefee" />
            <polygon points="140,50 216,105 186,170 90,178 63,105" fill="#1f6f4a" fillOpacity=".16" stroke="#1f6f4a" strokeWidth="2" />
            <circle cx="140" cy="50" r="3" fill="#1f6f4a" />
            <circle cx="216" cy="105" r="3" fill="#1f6f4a" />
            <circle cx="186" cy="170" r="3" fill="#1f6f4a" />
            <circle cx="90" cy="178" r="3" fill="#1f6f4a" />
            <circle cx="63" cy="105" r="3" fill="#1f6f4a" />
            <text x="140" y="16" textAnchor="middle" fontFamily="Source Sans 3" fontSize="10.5" fill="#66716b">Agronomi</text>
            <text x="262" y="108" textAnchor="end" fontFamily="Source Sans 3" fontSize="10.5" fill="#66716b">Leadership</text>
            <text x="214" y="206" textAnchor="middle" fontFamily="Source Sans 3" fontSize="10.5" fill="#66716b">K3 / Safety</text>
            <text x="66" y="206" textAnchor="middle" fontFamily="Source Sans 3" fontSize="10.5" fill="#66716b">Operasional</text>
            <text x="18" y="108" fontFamily="Source Sans 3" fontSize="10.5" fill="#66716b">Analitik</text>
          </svg>
          <div className={styles.profileStats}>
            <div className={styles.profileStat}>
              <div className={styles.profileStatLabel}>Kesiapan</div>
              <div className={styles.profileStatValue} style={{ color: "#1f6f4a" }}>Ready now</div>
            </div>
            <div className={styles.profileStat}>
              <div className={styles.profileStatLabel}>IDP tuntas</div>
              <div className={styles.profileStatValue} style={{ color: "#16201b" }}>7 / 9</div>
            </div>
          </div>
        </Card>
      </div>

      <Card className={styles.kanbanCard}>
        <div className={styles.kanbanHead}>
          <div>
            <div className={styles.cardTitle}>Status aksi IDP</div>
            <div className={styles.cardSub}>Mentoring, penugasan &amp; pelatihan · 214 talent aktif</div>
          </div>
          <span className={styles.kanbanHeadNote}>Kuartal berjalan · 214 aksi</span>
        </div>
        <div className={styles.kanbanCols}>
          {kanban.map((col) => (
            <div key={col.title} className={styles.kanbanCol}>
              <div className={styles.kanbanColHead}>
                <span className={styles.kanbanColTitle} style={{ color: col.fg }}>{col.title}</span>
                <span className={styles.kanbanColN}>{col.n}</span>
              </div>
              <div className={styles.kanbanItems}>
                {col.items.map((c) => (
                  <div key={c.t} className={styles.kanbanItem}>
                    <div className={styles.kanbanItemTitle}>{c.t}</div>
                    <div className={styles.kanbanWho}>
                      <span className={styles.kanbanAvatar} style={{ background: c.av }}>
                        {c.ini}
                      </span>
                      <span className={styles.kanbanWhoName}>{c.who}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
