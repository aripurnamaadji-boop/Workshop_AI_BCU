// Mock data ported from the Claude Design mockup (BCU People Development.dc.html).
// All values are invented placeholders pending real LMS/HRIS/evaluation data.

export const G = "#1f6f4a";
export const A = "#b77a12";
export const R = "#b3261e";

export type ScreenId = "dashboard" | "coverage" | "people" | "hours" | "eval" | "analysis";

export const navDef: { id: ScreenId; label: string; num: string; path: string }[] = [
  { id: "dashboard", label: "Dashboard", num: "01", path: "M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z" },
  { id: "coverage", label: "Training Coverage", num: "02", path: "M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12zM8 2v6l4 2" },
  { id: "people", label: "People Development", num: "03", path: "M6 7.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM1.5 14c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4M11 3.2a2.4 2.4 0 0 1 0 4.6M12.5 13.9c0-2 .8-3.2 2-3.6" },
  { id: "hours", label: "Training Hours & Days", num: "04", path: "M3 13V6M6.5 13V3M10 13V8M13.5 13v-4" },
  { id: "eval", label: "Training Evaluation", num: "05", path: "M8 2.2l1.8 3.7 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4L2.2 6.5l4-.6z" },
  { id: "analysis", label: "Training Analysis", num: "06", path: "M2 13.5h12M4 11V7M7.3 11V4M10.6 11V8.5M13.9 11V5.5" },
];

export const titles: Record<ScreenId, string> = {
  dashboard: "Dashboard",
  coverage: "Training Coverage",
  people: "People Development",
  hours: "Training Hours & Days",
  eval: "Training Evaluation",
  analysis: "Training Analysis",
};

export const filters = [
  { label: "PERIODE", options: ["Q3 2026", "Q2 2026", "Semester 1 2026", "Tahun 2026"] },
  { label: "REGION", options: ["Semua region", "Kalteng", "Kalbar"] },
  { label: "LEVEL", options: ["Semua level", "Pemanen/Perawatan", "Mandor", "Asisten", "Askep", "Manager"] },
  { label: "PROGRAM", options: ["Semua program", "Killer", "Regular", "Talent Development"] },
];

export type ProgramRow = [name: string, code: string, region: string, actual: number, plan: number, budget: string, window: string];

export type ProgramTab = {
  stats: [label: string, value: string, sub: string][];
  rows: ProgramRow[];
  timeline: number[];
  actual: number[];
};

export const progs: Record<"killer" | "regular" | "talent", ProgramTab> = {
  killer: {
    stats: [
      ["PROGRAM AKTIF", "6", "2 flagship BOD"],
      ["PESERTA TARGET", "624", "se-BGA"],
      ["REALISASI", "487", "78,0% dari target"],
      ["ANGGARAN TERPAKAI", "Rp 3,1 M", "dari Rp 4,4 M"],
    ],
    rows: [
      ["Replanting School Batch 4", "KLR-01", "Kalteng", 186, 240, "Rp 1,2 M", "Jan–Nov 2026"],
      ["Agronomy Mastery Batch 3", "KLR-02", "Kalteng + Kalbar", 171, 180, "Rp 640 jt", "Mar–Sep 2026"],
      ["Mill Excellence Program", "KLR-03", "Kalbar", 96, 120, "Rp 780 jt", "Feb–Okt 2026"],
      ["Leadership Estate Head", "KLR-04", "Se-BGA", 34, 60, "Rp 420 jt", "Apr–Des 2026"],
      ["Sustainability & RSPO Lead", "KLR-05", "Se-BGA", 0, 24, "Rp 210 jt", "Okt–Des 2026"],
    ],
    timeline: [14, 22, 30, 26, 34, 40, 32, 28, 24, 30, 18, 10],
    actual: [1, 0.95, 0.92, 0.88, 0.9, 0.82, 0.74, 0.62, 0.48, 0.2, 0, 0],
  },
  regular: {
    stats: [
      ["PROGRAM AKTIF", "29", "rutin & wajib"],
      ["PESERTA TARGET", "8.710", "se-BGA"],
      ["REALISASI", "7.485", "85,9% dari target"],
      ["ANGGARAN TERPAKAI", "Rp 5,8 M", "dari Rp 6,9 M"],
    ],
    rows: [
      ["Safety Induction K3", "REG-04", "Se-BGA", 2977, 3100, "Rp 1,4 M", "Bulanan"],
      ["SOP Agronomi Panen", "REG-02", "Kalteng + Kalbar", 1786, 2400, "Rp 1,9 M", "Bulanan"],
      ["Refresh & SKM Mandor", "REG-01", "Se-BGA", 1512, 1840, "Rp 1,6 M", "Triwulanan"],
      ["Induction Karyawan Baru", "REG-03", "Se-BGA", 948, 960, "Rp 520 jt", "Bulanan"],
      ["Sertifikasi Operator Alat Berat", "REG-05", "Kalbar", 262, 410, "Rp 380 jt", "Semesteran"],
    ],
    timeline: [30, 34, 28, 36, 32, 38, 34, 30, 26, 28, 22, 16],
    actual: [1, 0.98, 1, 0.94, 0.96, 0.9, 0.88, 0.84, 0.72, 0.5, 0.14, 0],
  },
  talent: {
    stats: [
      ["PROGRAM AKTIF", "12", "pipeline kepemimpinan"],
      ["TALENT POOL", "214", "hi-po aktif"],
      ["REALISASI", "83", "76,1% dari target"],
      ["KONVERSI PROMOSI", "37", "12 bln terakhir"],
    ],
    rows: [
      ["Leadership Pipeline Askep", "TAL-01", "Se-BGA", 41, 48, "Rp 560 jt", "Jan–Des 2026"],
      ["Mentoring Estate Manager", "TAL-02", "Kalteng", 28, 32, "Rp 240 jt", "Feb–Nov 2026"],
      ["Cross-Assignment Program", "TAL-03", "Kalteng ↔ Kalbar", 14, 26, "Rp 310 jt", "Mar–Des 2026"],
      ["Successor Bootcamp PKS", "TAL-04", "Kalbar", 18, 22, "Rp 185 jt", "Mei–Sep 2026"],
      ["Coaching for Managers", "TAL-05", "Se-BGA", 26, 30, "Rp 140 jt", "Triwulanan"],
    ],
    timeline: [10, 16, 20, 24, 22, 26, 24, 20, 18, 20, 14, 8],
    actual: [1, 1, 0.94, 0.9, 0.86, 0.8, 0.7, 0.6, 0.42, 0.22, 0, 0],
  },
};

export function statusOf(pct: number): [label: string, bg: string, fg: string, color: string] {
  if (pct >= 85) return ["On-track", "#e7f1eb", G, G];
  if (pct >= 65) return ["At-risk", "#fbf0dc", A, A];
  return ["Delayed", "#fbe9e7", R, R];
}

export const kpis = [
  { label: "Coverage karyawan", value: "74,2", unit: "%", delta: "+5,1 pt", note: "vs Q2 2026", deltaColor: G, bar: 74 },
  { label: "Total training hours", value: "128.940", unit: "jam", delta: "+12,4%", note: "vs Q2 2026", deltaColor: G, bar: 68 },
  { label: "Rata-rata jam / karyawan", value: "11,2", unit: "jam", delta: "−4,8 jam", note: "dari target 16 jam", deltaColor: A, bar: 70 },
  { label: "Skor evaluasi rata-rata", value: "4,21", unit: "/ 5", delta: "+0,08", note: "vs Q2 2026", deltaColor: G, bar: 84 },
  { label: "Program aktif", value: "47", unit: "program", delta: "6 baru", note: "kuartal ini", deltaColor: G, bar: 56 },
];

export const attention = [
  { title: "Mill Excellence Program", body: "Batch 2 tertunda; 3 kelas belum dijadwalkan ulang.", metric: "−6 mgg", color: R },
  { title: "Estate Katingan Hilir", body: "Coverage terendah se-BGA, 412 karyawan belum tersentuh.", metric: "41%", color: R },
  { title: "Cross-Assignment Program", body: "Realisasi peserta jauh di bawah rencana kuartal.", metric: "54%", color: A },
  { title: "PKS Sanggau", body: "Tiga program wajib K3 belum berjalan tahun ini.", metric: "3 program", color: A },
];

export const attentionMobile = [
  { title: "Mill Excellence Program", body: "Batch 2 tertunda 6 minggu", metric: "−6 mgg", color: R },
  { title: "Estate Katingan Hilir", body: "Coverage terendah se-BGA", metric: "41%", color: R },
  { title: "Cross-Assignment", body: "Realisasi di bawah rencana", metric: "54%", color: A },
];

export const quicklinks: { n: string; label: string; val: string; screen: ScreenId }[] = [
  { n: "02", label: "Unit coverage terendah", val: "41%", screen: "coverage" },
  { n: "03", label: "Talent siap promosi", val: "29", screen: "people" },
  { n: "04", label: "Jam pelatihan tertinggal", val: "−4,8 j", screen: "hours" },
  { n: "05", label: "Program skor evaluasi rendah", val: "5", screen: "eval" },
];

export const waffle = Array.from({ length: 100 }, (_, i) => ({
  c: i < 74 ? G : i < 85 ? "#b7cfc1" : "#e2e7e3",
}));

export const mandatory = [
  { label: "Safety Induction K3", pct: 96, color: G },
  { label: "SOP Agronomi Panen", pct: 74, color: A },
  { label: "Sertifikasi Operator", pct: 64, color: A },
  { label: "RSPO & Sustainability", pct: 41, color: R },
];

export const levels = ["PEMANEN", "MANDOR", "ASISTEN", "ASKEP", "MANAGER"];
const levelNames = ["Pemanen/Perawatan", "Mandor", "Asisten", "Askep", "Manager"];

const heatUnits: [code: string, unit: string, cells: number[]][] = [
  ["KTG-01", "Estate Bukit Santuai", [86, 79, 92, 88, 100]],
  ["KTG-02", "Estate Sungai Cempaga", [81, 74, 85, 90, 100]],
  ["KTG-03", "Estate Katingan Hilir", [38, 44, 52, 60, 67]],
  ["KTG-04", "Estate Seruyan Hulu", [62, 68, 71, 80, 100]],
  ["KTG-05", "PKS Kotawaringin", [74, 80, 88, 90, 100]],
  ["KBR-01", "Estate Ketapang Utara", [83, 86, 90, 95, 100]],
  ["KBR-02", "Estate Sanggau Barat", [70, 66, 78, 83, 100]],
  ["KBR-03", "PKS Sanggau", [49, 55, 58, 70, 75]],
  ["KBR-04", "Estate Sintang Raya", [77, 72, 81, 86, 100]],
];

function heatColor(v: number): [bg: string, fg: string] {
  if (v >= 85) return [G, "#fff"];
  if (v >= 75) return ["#5c9a7b", "#fff"];
  if (v >= 65) return ["#a9cbb9", "#16201b"];
  if (v >= 50) return ["#f0e2c4", "#6b5310"];
  return ["#f5cfc9", "#8c2018"];
}

export const heat = heatUnits.map(([code, unit, cells]) => ({
  code,
  unit,
  cells: cells.map((v, i) => {
    const [bg, fg] = heatColor(v);
    return { v: v + "%", bg, fg, title: `${unit} · ${levelNames[i]} — coverage ${v}%` };
  }),
}));

export const gaps = [
  { unit: "Estate Katingan Hilir", level: "Pemanen / Perawatan", hc: "668", gap: "412", last: "Nov 2025" },
  { unit: "PKS Sanggau", level: "Operator produksi", hc: "241", gap: "123", last: "Feb 2026" },
  { unit: "Estate Seruyan Hulu", level: "Pemanen / Perawatan", hc: "742", gap: "282", last: "Jan 2026" },
  { unit: "Estate Sanggau Barat", level: "Mandor", hc: "96", gap: "33", last: "Mar 2026" },
  { unit: "Estate Sungai Cempaga", level: "Pemanen / Perawatan", hc: "810", gap: "154", last: "Apr 2026" },
  { unit: "Estate Sintang Raya", level: "Mandor", hc: "88", gap: "25", last: "Mei 2026" },
];

export const pdKpis = [
  { label: "IDP completion rate", value: "68", unit: "%", delta: "+9 pt", note: "vs Q2 2026", deltaColor: G },
  { label: "Talent pool aktif", value: "214", unit: "orang", delta: "+18", note: "hi-po baru", deltaColor: G },
  { label: "Ready now", value: "29", unit: "orang", delta: "11", note: "posisi kunci terisi", deltaColor: G },
  { label: "Competency gap", value: "−18", unit: "%", delta: "menyempit", note: "12 bln terakhir", deltaColor: G },
  { label: "Promosi internal", value: "37", unit: "orang", delta: "63%", note: "dari talent pool", deltaColor: G },
];

export type CellId = "1-1" | "1-2" | "1-3" | "2-1" | "2-2" | "2-3" | "3-1" | "3-2" | "3-3";

const avs = [G, "#2f5d7c", "#7c4a2f", "#4a3f7c", "#2f7c6b", "#7c2f4a"];

const cellData: Record<CellId, [title: string, people: [ini: string, name: string, role: string, unit: string][]]> = {
  "1-1": ["Risiko kinerja", [["BW", "Bambang W.", "Mandor Panen", "KTG-04"], ["RS", "Rudi S.", "Krani Produksi", "KBR-02"]]],
  "1-2": ["Pekerja solid", [["DH", "Dedi H.", "Mandor Rawat", "KTG-01"], ["AF", "Ahmad F.", "Mandor Panen", "KTG-03"], ["YP", "Yoga P.", "Krani Gudang", "KBR-01"]]],
  "1-3": ["Ahli teknis", [["SM", "Sri M.", "Asisten Agronomi", "KTG-02"], ["TW", "Taufik W.", "Asisten Pabrik", "KBR-03"]]],
  "2-1": ["Perlu perbaikan", [["HN", "Hendro N.", "Mandor Panen", "KBR-04"]]],
  "2-2": ["Inti organisasi", [["IK", "Indra K.", "Asisten Divisi", "KTG-05"], ["MR", "M. Ridwan", "Asisten Divisi", "KBR-02"], ["LS", "Lina S.", "Krani Kepala", "KTG-01"]]],
  "2-3": ["Kandidat kuat", [["AS", "Agus Setiawan", "Asisten Kepala", "KTG-01"], ["FR", "Fajar R.", "Asisten Kepala", "KBR-01"]]],
  "3-1": ["Potensi terpendam", [["NA", "Nur Aisyah", "Krani Kepala", "KTG-03"], ["BS", "Bayu S.", "Asisten Divisi", "KTG-06"], ["WP", "Wawan P.", "Asisten Pabrik", "KBR-03"]]],
  "3-2": ["Bintang berkembang", [["RH", "Rizky H.", "Asisten Kepala", "KBR-02"], ["DP", "Dwi P.", "Asisten Kepala", "KTG-04"], ["EK", "Eko K.", "Asisten Divisi", "KTG-02"], ["SN", "Siti N.", "Krani Kepala", "KBR-01"]]],
  "3-3": ["Talent teratas", [["AS", "Agus Setiawan", "Asisten Kepala", "KTG-01"], ["MH", "M. Hafiz", "Estate Manager", "KBR-04"], ["PW", "Putri W.", "Mill Manager", "KBR-03"]]],
};

export function getCell(id: CellId) {
  const [title, people] = cellData[id];
  return {
    cellTitle: title,
    cellCount: people.length + " orang",
    cellPeople: people.map(([ini, name, role, unit], i) => ({ ini, name, role, unit, av: avs[i % avs.length] })),
  };
}

const nineboxBase: [id: CellId, label: string, n: number][] = [
  ["3-1", "Potensi terpendam", 3], ["3-2", "Bintang berkembang", 4], ["3-3", "Talent teratas", 3],
  ["2-1", "Perlu perbaikan", 1], ["2-2", "Inti organisasi", 3], ["2-3", "Kandidat kuat", 2],
  ["1-1", "Risiko kinerja", 2], ["1-2", "Pekerja solid", 3], ["1-3", "Ahli teknis", 2],
];

export function getNinebox(activeCell: CellId) {
  return nineboxBase.map(([id, label, n]) => {
    const rank = Number(id[0]) + Number(id[2]);
    const active = activeCell === id;
    const [bg, fg] = rank >= 5 ? ["#e7f1eb", G] : rank >= 4 ? ["#f1f6f3", "#3e4a43"] : ["#f7f8f7", "#66716b"];
    return { id, label, n, bg, fg, border: active ? "#16201b" : "transparent" };
  });
}

export const succession = ([
  ["Estate Manager — Bukit Santuai", "Saat ini: Suryanto (pensiun 2028)", [2, 1, 1, 0, 0], "Aman"],
  ["Estate Manager — Katingan Hilir", "Saat ini: kosong sejak Mei 2026", [0, 1, 0, 0, 0], "Kritis"],
  ["Mill Manager — PKS Sanggau", "Saat ini: Handoko (rotasi 2027)", [1, 1, 1, 0, 0], "Waspada"],
  ["Askep — Sungai Cempaga", "Saat ini: Bagus P.", [2, 2, 1, 0, 0], "Aman"],
  ["Askep — Sintang Raya", "Saat ini: Widodo", [1, 2, 0, 0, 0], "Waspada"],
  ["Head of Agronomy — Kalteng", "Saat ini: Nugroho A.", [0, 2, 1, 0, 0], "Waspada"],
] as [pos: string, holder: string, mix: number[], risk: string][]).map(([pos, holder, mix, risk]) => {
  const cols = [G, "#7fb79a", "#d5ded8"];
  const labels = ["Ready now", "1–2 tahun", "3+ tahun"];
  const slots: { c: string; t: string }[] = [];
  mix.forEach((count, i) => {
    for (let j = 0; j < count; j++) slots.push({ c: cols[i] ?? "#edefee", t: labels[i] });
  });
  while (slots.length < 5) slots.push({ c: "#f2f3f2", t: "Slot kosong" });
  const badge: [string, string] = risk === "Aman" ? ["#e7f1eb", G] : risk === "Waspada" ? ["#fbf0dc", A] : ["#fbe9e7", R];
  return { pos, holder, slots, risk, badgeBg: badge[0], badgeFg: badge[1] };
});

export const kanban = [
  {
    title: "To-do", n: "62", fg: "#66716b",
    items: [
      { t: "Penugasan lintas estate", who: "Bayu S.", ini: "BS", av: "#7c4a2f" },
      { t: "Pelatihan RSPO Lead Auditor", who: "Nur Aisyah", ini: "NA", av: "#4a3f7c" },
      { t: "Coaching bulanan", who: "Wawan P.", ini: "WP", av: "#2f5d7c" },
    ],
  },
  {
    title: "On-progress", n: "97", fg: A,
    items: [
      { t: "Mentoring Estate Manager", who: "Rizky H.", ini: "RH", av: "#2f7c6b" },
      { t: "Proyek efisiensi panen", who: "Dwi P.", ini: "DP", av: "#7c2f4a" },
      { t: "Leadership Pipeline Askep", who: "Eko K.", ini: "EK", av: G },
    ],
  },
  {
    title: "Done", n: "55", fg: G,
    items: [
      { t: "Replanting School Batch 3", who: "Agus Setiawan", ini: "AS", av: G },
      { t: "Sertifikasi K3 Umum", who: "M. Hafiz", ini: "MH", av: "#2f5d7c" },
      { t: "Successor Bootcamp PKS", who: "Putri W.", ini: "PW", av: "#7c4a2f" },
    ],
  },
];

export function mobilePrograms(tab: "killer" | "regular" | "talent") {
  return progs[tab].rows.slice(0, 3).map(([name, , , actual, plan]) => {
    const pct = Math.round((actual / plan) * 100);
    return { name, actual, plan, pct, color: statusOf(pct)[3] };
  });
}
