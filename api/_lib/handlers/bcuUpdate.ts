import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSql } from "../db.js";
import { requireAuth } from "../auth.js";

type Entry = {
  programId: number;
  sdbiTarget: number | null;
  sdbiAktual: number | null;
  biTarget: number | null;
  biAktual: number | null;
};

function toNum(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  if (!(await requireAuth(req, res))) return;

  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const period: string | undefined = body?.period;
  const entries: Entry[] = Array.isArray(body?.entries) ? body.entries : [];

  if (!period || !/^\d{4}-\d{2}-01$/.test(period)) {
    res.status(400).json({ error: "period wajib diisi, format YYYY-MM-01" });
    return;
  }
  if (entries.length === 0) {
    res.status(400).json({ error: "entries kosong" });
    return;
  }

  try {
    const sql = getSql();
    let updated = 0;
    for (const e of entries) {
      const programId = Number(e.programId);
      if (!Number.isInteger(programId)) continue;
      await sql`
        INSERT INTO bcu_monthly_actuals (program_id, period, sdbi_target, sdbi_aktual, bi_target, bi_aktual, updated_at)
        VALUES (${programId}, ${period}, ${toNum(e.sdbiTarget)}, ${toNum(e.sdbiAktual)}, ${toNum(e.biTarget)}, ${toNum(e.biAktual)}, now())
        ON CONFLICT (program_id, period) DO UPDATE SET
          sdbi_target = EXCLUDED.sdbi_target,
          sdbi_aktual = EXCLUDED.sdbi_aktual,
          bi_target = EXCLUDED.bi_target,
          bi_aktual = EXCLUDED.bi_aktual,
          updated_at = now()
      `;
      updated += 1;
    }
    res.status(200).json({ ok: true, period, updated });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
}
