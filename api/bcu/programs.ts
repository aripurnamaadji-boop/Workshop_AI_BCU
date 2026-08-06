import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSql } from "../_lib/db.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const sql = getSql();

    const periodRows = await sql`
      SELECT DISTINCT period::text AS period FROM bcu_monthly_actuals ORDER BY period DESC
    `;
    const periods: string[] = periodRows.map((p) => (p as { period: string }).period);

    if (periods.length === 0) {
      res.status(200).json({ periods: [], period: null, rows: [] });
      return;
    }

    const requestedPeriod = typeof req.query.period === "string" ? req.query.period : undefined;
    const period = requestedPeriod && periods.includes(requestedPeriod) ? requestedPeriod : periods[0];

    const rows = await sql`
      SELECT
        p.id, p.category, p.row_type AS "rowType", p.no_label AS "no", p.sasaran, p.approach,
        p.units, p.indent, p.target_2026::float AS "target2026", p.sort_order AS "sortOrder",
        a.sdbi_target::float AS "sdbiTarget", a.sdbi_aktual::float AS "sdbiAktual",
        a.bi_target::float AS "biTarget", a.bi_aktual::float AS "biAktual"
      FROM bcu_programs p
      LEFT JOIN bcu_monthly_actuals a ON a.program_id = p.id AND a.period = ${period}
      ORDER BY p.sort_order ASC
    `;

    // Monthly history per category (bi_target vs bi_aktual across all periods), for the timeline chart.
    const history = await sql`
      SELECT p.category, a.period::text AS period,
        sum(a.bi_target)::float AS "biTarget", sum(a.bi_aktual)::float AS "biAktual"
      FROM bcu_monthly_actuals a
      JOIN bcu_programs p ON p.id = a.program_id
      WHERE p.row_type = 'item'
      GROUP BY p.category, a.period
      ORDER BY a.period ASC
    `;

    res.status(200).json({ periods, period, rows, history });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
}
