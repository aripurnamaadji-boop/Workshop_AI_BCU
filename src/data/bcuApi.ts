export type BcuCategory = "grand" | "killer_staff" | "killer_nonstaff" | "reguler" | "mandatory" | "talent";

export type BcuRow = {
  id: number;
  category: BcuCategory;
  rowType: "category_total" | "item";
  no: string;
  sasaran: string;
  approach: string;
  units: string;
  indent: 0 | 1 | 2 | 3;
  target2026: number;
  sortOrder: number;
  sdbiTarget: number | null;
  sdbiAktual: number | null;
  biTarget: number | null;
  biAktual: number | null;
};

export type BcuHistoryPoint = {
  category: BcuCategory;
  period: string;
  biTarget: number | null;
  biAktual: number | null;
};

export type BcuProgramsResponse = {
  periods: string[];
  period: string | null;
  rows: BcuRow[];
  history: BcuHistoryPoint[];
};

export async function fetchBcuPrograms(period?: string): Promise<BcuProgramsResponse> {
  const qs = period ? `?period=${encodeURIComponent(period)}` : "";
  const res = await fetch(`/api/bcu/programs${qs}`);
  if (!res.ok) throw new Error(`Gagal memuat data program (HTTP ${res.status})`);
  return res.json();
}

export type UpdateEntry = {
  programId: number;
  sdbiTarget: number | null;
  sdbiAktual: number | null;
  biTarget: number | null;
  biAktual: number | null;
};

export async function saveBcuUpdate(period: string, entries: UpdateEntry[]) {
  const res = await fetch("/api/bcu/update", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ period, entries }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Gagal menyimpan (HTTP ${res.status})`);
  return data as { ok: true; period: string; updated: number };
}

export async function fetchAiSummary(period: string) {
  const res = await fetch("/api/ai/summary", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ period }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Gagal membuat ringkasan (HTTP ${res.status})`);
  return data as { period: string; summary: string; provider: string; generatedAt: string };
}

export const CATEGORY_LABELS: Record<BcuCategory, string> = {
  grand: "Total BCU",
  killer_staff: "Killer — Staff",
  killer_nonstaff: "Killer — Non-Staff",
  reguler: "Reguler",
  mandatory: "Mandatory",
  talent: "Talent Development",
};

export function periodLabel(period: string): string {
  const [y, m] = period.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  return `${months[Number(m) - 1] ?? m} ${y}`;
}

export function nextPeriod(period: string): string {
  const [y, m] = period.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + 1, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-01`;
}
