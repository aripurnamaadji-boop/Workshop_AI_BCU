import { getSql } from "./db.js";

function pct(aktual: number | null, target: number | null): string {
  if (!target) return "-";
  return `${Math.round(((aktual ?? 0) / target) * 100)}%`;
}

export async function latestPeriod(): Promise<string | null> {
  const sql = getSql();
  const rows = await sql`SELECT period::text AS period FROM bcu_monthly_actuals ORDER BY period DESC LIMIT 1`;
  return (rows[0] as { period: string } | undefined)?.period ?? null;
}

export async function buildBcuDigest(period: string): Promise<string> {
  const sql = getSql();

  const totals = await sql`
    SELECT category, target_2026::float AS "target2026",
      a.sdbi_target::float AS "sdbiTarget", a.sdbi_aktual::float AS "sdbiAktual",
      a.bi_target::float AS "biTarget", a.bi_aktual::float AS "biAktual"
    FROM bcu_programs p
    JOIN bcu_monthly_actuals a ON a.program_id = p.id AND a.period = ${period}
    WHERE p.row_type = 'category_total'
    ORDER BY p.sort_order ASC
  `;

  const gaps = await sql`
    SELECT p.approach, p.category, a.sdbi_target::float AS "sdbiTarget", a.sdbi_aktual::float AS "sdbiAktual"
    FROM bcu_programs p
    JOIN bcu_monthly_actuals a ON a.program_id = p.id AND a.period = ${period}
    WHERE p.row_type = 'item' AND a.sdbi_target > 0
    ORDER BY (a.sdbi_aktual::float / NULLIF(a.sdbi_target::float, 0)) ASC
    LIMIT 5
  `;

  const lines: string[] = [];
  lines.push(`Periode laporan BCU Development Program: ${period}`);
  for (const t of totals as Array<{ category: string; target2026: number; sdbiTarget: number; sdbiAktual: number; biTarget: number; biAktual: number }>) {
    lines.push(
      `- ${t.category}: target tahunan ${t.target2026}, realisasi s.d. bulan ini ${t.sdbiAktual}/${t.sdbiTarget} (${pct(t.sdbiAktual, t.sdbiTarget)}), bulan ini ${t.biAktual}/${t.biTarget} (${pct(t.biAktual, t.biTarget)})`,
    );
  }
  lines.push("Program dengan realisasi paling tertinggal (SdBi aktual/target):");
  for (const g of gaps as Array<{ approach: string; category: string; sdbiTarget: number; sdbiAktual: number }>) {
    lines.push(`- ${g.approach} (${g.category}): ${g.sdbiAktual}/${g.sdbiTarget} (${pct(g.sdbiAktual, g.sdbiTarget)})`);
  }
  return lines.join("\n");
}
