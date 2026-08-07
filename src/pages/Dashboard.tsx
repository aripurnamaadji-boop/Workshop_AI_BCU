import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import KpiCard from "../components/KpiCard";
import Badge from "../components/Badge";
import { attention, kpis, quicklinks, statusOf, waffle } from "../data/mockData";
import {
  CATEGORY_LABELS,
  fetchAiSummary,
  fetchBcuPrograms,
  periodLabel,
  type BcuCategory,
  type BcuProgramsResponse,
} from "../data/bcuApi";
import { useFilters } from "../filters/FilterContext";
import styles from "./Dashboard.module.css";

const TAB_CATEGORIES: BcuCategory[] = ["killer_staff", "killer_nonstaff", "reguler", "mandatory", "talent"];

function pct(aktual: number | null | undefined, target: number | null | undefined): number {
  if (!target) return 0;
  return Math.round(((aktual ?? 0) / target) * 100);
}

export default function Dashboard() {
  const [tab, setTabState] = useState<BcuCategory>("killer_staff");
  const navigate = useNavigate();
  const { program, setProgram, period, setPeriod, setAvailablePeriods } = useFilters();

  const [data, setData] = useState<BcuProgramsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);

  const [summary, setSummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  function setTab(cat: BcuCategory) {
    setTabState(cat);
    setProgram(cat);
  }

  useEffect(() => {
    if (program !== "all" && program !== tab) setTabState(program);
  }, [program]);

  async function load(p?: string) {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetchBcuPrograms(p);
      setData(res);
      setAvailablePeriods(res.periods);
      if (res.period && res.period !== period) setPeriod(res.period);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(period ?? undefined);
  }, [period]);

  async function handleSeed() {
    setSeeding(true);
    try {
      const res = await fetch("/api/bcu/seed", { method: "POST" });
      if (!res.ok) throw new Error(`Seed gagal (HTTP ${res.status})`);
      await load(period ?? undefined);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : String(err));
    } finally {
      setSeeding(false);
    }
  }

  async function handleGenerateSummary() {
    if (!data?.period) return;
    setSummaryLoading(true);
    setSummaryError(null);
    try {
      const res = await fetchAiSummary(data.period);
      setSummary(res.summary);
    } catch (err) {
      setSummaryError(err instanceof Error ? err.message : String(err));
    } finally {
      setSummaryLoading(false);
    }
  }

  const grandTotal = useMemo(() => data?.rows.find((r) => r.category === "grand"), [data]);
  const categoryTotal = useMemo(() => data?.rows.find((r) => r.category === tab && r.rowType === "category_total"), [data, tab]);
  const itemRows = useMemo(
    () => (data?.rows.filter((r) => r.category === tab && r.rowType === "item") ?? []).sort((a, b) => a.sortOrder - b.sortOrder),
    [data, tab],
  );
  const categoryHistory = useMemo(
    () => (data?.history.filter((h) => h.category === tab) ?? []).sort((a, b) => (a.period < b.period ? -1 : 1)),
    [data, tab],
  );
  const maxBiTarget = Math.max(1, ...categoryHistory.map((h) => h.biTarget ?? 0));

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

      {!loading && (loadError || (data && data.rows.length === 0)) && (
        <Card style={{ padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div style={{ font: "500 12.5px var(--font-sans)", color: loadError ? "var(--red)" : "var(--ink-muted)" }}>
            {loadError
              ? `${loadError} — kemungkinan tabel database belum di-seed. Coba klik "Muat data awal".`
              : "Belum ada data BCU Development Program di database. Muat data awal dari laporan SdBi Juni 2026 dulu."}
          </div>
          <button
            onClick={handleSeed}
            disabled={seeding}
            style={{
              height: 34,
              padding: "0 14px",
              borderRadius: 5,
              border: "none",
              background: "var(--green)",
              color: "#fff",
              font: "600 12.5px var(--font-sans)",
              cursor: "pointer",
              flex: "none",
            }}
          >
            {seeding ? "Memuat..." : "Muat data awal"}
          </button>
        </Card>
      )}

      <div className={styles.mainGrid}>
        <Card className={styles.programCard}>
          <div className={styles.programHead}>
            <div>
              <div className={styles.programTitle}>Monitoring Program BCU</div>
              <div className={styles.programSub}>
                {data?.period
                  ? `Data ${periodLabel(data.period)} · klik kategori untuk detail Sasaran Pelatihan`
                  : "Rencana vs realisasi lima kategori program · klik kategori untuk detail"}
              </div>
            </div>
            <div className={styles.tabs}>
              {TAB_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`${styles.tab} ${tab === cat ? styles.active : ""}`}
                  onClick={() => setTab(cat)}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          {categoryTotal && (
            <div className={styles.statsRow}>
              <div className={styles.statCell}>
                <div className={styles.statLabel}>REALISASI SdBi</div>
                <div className={`${styles.statValue} tabular`}>{categoryTotal.sdbiAktual ?? 0}</div>
                <div className={styles.statSub}>
                  dari target {categoryTotal.sdbiTarget ?? 0} ({pct(categoryTotal.sdbiAktual, categoryTotal.sdbiTarget)}%)
                </div>
              </div>
              <div className={styles.statCell}>
                <div className={styles.statLabel}>BULAN INI (BI)</div>
                <div className={`${styles.statValue} tabular`}>
                  {categoryTotal.biAktual ?? "-"} <span style={{ fontSize: 13, color: "var(--ink-faint-2)" }}>/ {categoryTotal.biTarget ?? "-"}</span>
                </div>
                <div className={styles.statSub}>{pct(categoryTotal.biAktual, categoryTotal.biTarget)}% bulan berjalan</div>
              </div>
              <div className={styles.statCell}>
                <div className={styles.statLabel}>TARGET 2026</div>
                <div className={`${styles.statValue} tabular`}>{categoryTotal.target2026}</div>
                <div className={styles.statSub}>{pct(categoryTotal.sdbiAktual, categoryTotal.target2026)}% tercapai dari FY</div>
              </div>
              <div className={styles.statCell} style={{ borderRight: "none" }}>
                <div className={styles.statLabel}>GAP SdBi</div>
                <div className={`${styles.statValue} tabular`}>
                  {Math.max((categoryTotal.sdbiTarget ?? 0) - (categoryTotal.sdbiAktual ?? 0), 0)}
                </div>
                <div className={styles.statSub}>tersisa dari target periode ini</div>
              </div>
            </div>
          )}

          {categoryHistory.length > 0 && (
            <div className={styles.timelineBox}>
              <div className={styles.timelineHead}>
                <span className={styles.timelineTag}>REALISASI BULANAN (BI) · {CATEGORY_LABELS[tab].toUpperCase()}</span>
                <div className={styles.legend}>
                  <span className={styles.legendItem}>
                    <span className={styles.legendSwatch} style={{ background: "#cfe3d8" }} /> Rencana
                  </span>
                  <span className={styles.legendItem}>
                    <span className={styles.legendSwatch} style={{ background: "#1f6f4a" }} /> Realisasi
                  </span>
                </div>
              </div>
              <div className={styles.chart} style={{ gridTemplateColumns: `repeat(${categoryHistory.length}, 1fr)` }}>
                {categoryHistory.map((h) => {
                  const p = pct(h.biAktual, h.biTarget) / 100;
                  const color = p >= 0.85 ? "#1f6f4a" : p >= 0.6 ? "#b77a12" : "#b3261e";
                  const planH = Math.round(((h.biTarget ?? 0) / maxBiTarget) * 62) + 6;
                  return (
                    <div
                      key={h.period}
                      className={styles.month}
                      title={`Rencana ${h.biTarget ?? 0} · realisasi ${h.biAktual ?? 0}`}
                    >
                      <div className={styles.planBar} style={{ height: planH }}>
                        <div className={styles.actBar} style={{ height: `${Math.min(p * 100, 100)}%`, background: color }} />
                      </div>
                      <div className={styles.monthLabel}>{periodLabel(h.period).split(" ")[0]}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className={styles.tableBox}>
            <div className={styles.tableHead}>
              <span className={styles.th}>SASARAN PELATIHAN</span>
              <span className={styles.th}>SdBi (AKTUAL/TARGET)</span>
              <span className={styles.th}>PLAN VS ACTUAL</span>
              <span className={`${styles.th} ${styles.thRight}`}>TARGET 2026</span>
              <span className={`${styles.th} ${styles.thRight}`}>STATUS</span>
            </div>
            {itemRows.map((row) => {
              const rowPct = pct(row.sdbiAktual, row.sdbiTarget);
              const [status, badgeBg, badgeFg, color] = statusOf(rowPct);
              return (
                <div key={row.id} className={styles.tableRow}>
                  <div>
                    <div className={styles.progName}>{row.approach}</div>
                    <div className={styles.progMeta}>
                      {row.no ? `${row.no} · ` : ""}
                      {row.sasaran || row.units || "-"}
                    </div>
                  </div>
                  <div className={`${styles.progParticip} tabular`}>
                    {row.sdbiAktual ?? 0} <span>/ {row.sdbiTarget ?? 0}</span>
                  </div>
                  <div>
                    <div className={styles.progBarTrack}>
                      <div className={styles.progBarFill} style={{ width: `${Math.min(rowPct, 100)}%`, background: color }} />
                    </div>
                    <div className={styles.progBarNote}>
                      {rowPct}% SdBi{row.units ? ` · ${row.units}` : ""}
                    </div>
                  </div>
                  <div className={`${styles.progBudget} tabular`}>{row.target2026}</div>
                  <div className={styles.progStatus}>
                    <Badge label={status} bg={badgeBg} fg={badgeFg} />
                  </div>
                </div>
              );
            })}
            {itemRows.length === 0 && !loading && (
              <div style={{ padding: "20px 0", font: "500 12.5px var(--font-sans)", color: "var(--ink-faint)" }}>
                Belum ada baris untuk kategori ini.
              </div>
            )}
          </div>
        </Card>

        <div className={styles.sideCol}>
          <Card className={styles.sideCard}>
            <div className={styles.sideCardHead}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="var(--green)" strokeWidth="1.5">
                <path d="M8 1.5 9.7 5l3.8.5-2.8 2.7.7 3.8L8 10.2l-3.4 1.8.7-3.8L2.5 5.5 6.3 5Z" />
              </svg>
              <span className={styles.sideCardTitle}>Ringkasan AI</span>
            </div>
            {grandTotal && (
              <div style={{ font: "400 11.5px/1.5 var(--font-sans)", color: "var(--ink-faint)", marginTop: 4 }}>
                Berdasarkan data {data?.period ? periodLabel(data.period) : ""}
              </div>
            )}
            {summary ? (
              <div style={{ font: "400 12.5px/1.55 var(--font-sans)", color: "var(--ink-mid)", marginTop: 10 }}>{summary}</div>
            ) : (
              <div style={{ font: "400 12px/1.5 var(--font-sans)", color: "var(--ink-faint)", marginTop: 10 }}>
                Klik tombol untuk membuat ringkasan eksekutif otomatis dari data program bulan ini.
              </div>
            )}
            {summaryError && (
              <div style={{ font: "500 11.5px var(--font-sans)", color: "var(--red)", marginTop: 8 }}>{summaryError}</div>
            )}
            <button
              onClick={handleGenerateSummary}
              disabled={summaryLoading || !data?.period}
              style={{
                marginTop: 12,
                height: 32,
                width: "100%",
                borderRadius: 5,
                border: "1px solid var(--border-input)",
                background: summaryLoading ? "var(--content-bg)" : "#fff",
                color: "var(--ink)",
                font: "600 12px var(--font-sans)",
                cursor: "pointer",
              }}
            >
              {summaryLoading ? "Membuat ringkasan..." : summary ? "Buat ulang ringkasan" : "Buat ringkasan AI"}
            </button>
          </Card>

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
