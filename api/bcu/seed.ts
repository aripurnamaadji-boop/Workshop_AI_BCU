import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSql } from "../_lib/db.js";
import { requireAuth } from "../_lib/auth.js";
import { SEED_ROWS, SEED_PERIOD } from "../_lib/bcuSeed.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  if (!(await requireAuth(req, res))) return;

  try {
    const sql = getSql();

    await sql`
      CREATE TABLE IF NOT EXISTS bcu_programs (
        id serial PRIMARY KEY,
        category text NOT NULL,
        row_type text NOT NULL,
        no_label text NOT NULL DEFAULT '',
        sasaran text NOT NULL DEFAULT '',
        approach text NOT NULL DEFAULT '',
        units text NOT NULL DEFAULT '',
        indent smallint NOT NULL DEFAULT 0,
        target_2026 numeric NOT NULL DEFAULT 0,
        sort_order integer NOT NULL DEFAULT 0
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS bcu_monthly_actuals (
        id serial PRIMARY KEY,
        program_id integer NOT NULL REFERENCES bcu_programs(id) ON DELETE CASCADE,
        period date NOT NULL,
        sdbi_target numeric,
        sdbi_aktual numeric,
        bi_target numeric,
        bi_aktual numeric,
        updated_at timestamptz NOT NULL DEFAULT now(),
        UNIQUE (program_id, period)
      )
    `;

    const [{ count }] = await sql`SELECT count(*)::int AS count FROM bcu_programs`;
    if (count > 0) {
      res.status(200).json({ seeded: false, detail: `Sudah ada ${count} baris program, seed dilewati (idempotent)` });
      return;
    }

    let sortOrder = 0;
    let inserted = 0;
    for (const row of SEED_ROWS) {
      sortOrder += 1;
      const [{ id }] = await sql`
        INSERT INTO bcu_programs (category, row_type, no_label, sasaran, approach, units, indent, target_2026, sort_order)
        VALUES (${row.category}, ${row.rowType}, ${row.no}, ${row.sasaran}, ${row.approach}, ${row.units}, ${row.indent}, ${row.target2026}, ${sortOrder})
        RETURNING id
      `;
      await sql`
        INSERT INTO bcu_monthly_actuals (program_id, period, sdbi_target, sdbi_aktual, bi_target, bi_aktual)
        VALUES (${id}, ${SEED_PERIOD}, ${row.sdbiTarget}, ${row.sdbiAktual}, ${row.biTarget}, ${row.biAktual})
        ON CONFLICT (program_id, period) DO NOTHING
      `;
      inserted += 1;
    }

    res.status(200).json({ seeded: true, rows: inserted, period: SEED_PERIOD });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
}
