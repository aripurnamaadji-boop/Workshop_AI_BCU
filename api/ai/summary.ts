import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSql } from "../_lib/db.js";
import { firstEnv, AI_KEY_KEYS } from "../_lib/env.js";
import { requireAuth } from "../_lib/auth.js";

function pct(aktual: number | null, target: number | null): string {
  if (!target) return "-";
  return `${Math.round(((aktual ?? 0) / target) * 100)}%`;
}

async function buildDataDigest(period: string) {
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
  lines.push(`Periode laporan: ${period}`);
  for (const t of totals as Array<{ category: string; target2026: number; sdbiTarget: number; sdbiAktual: number; biTarget: number; biAktual: number }>) {
    lines.push(
      `- ${t.category}: target tahunan ${t.target2026}, realisasi s.d. bulan ini ${t.sdbiAktual}/${t.sdbiTarget} (${pct(t.sdbiAktual, t.sdbiTarget)}), bulan ini ${t.biAktual}/${t.biTarget} (${pct(t.biAktual, t.biTarget)})`,
    );
  }
  lines.push("Program dengan realisasi paling tertinggal:");
  for (const g of gaps as Array<{ approach: string; category: string; sdbiTarget: number; sdbiAktual: number }>) {
    lines.push(`- ${g.approach} (${g.category}): ${g.sdbiAktual}/${g.sdbiTarget} (${pct(g.sdbiAktual, g.sdbiTarget)})`);
  }
  return lines.join("\n");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  if (!(await requireAuth(req, res))) return;

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const period: string | undefined = body.period;
  if (!period) {
    res.status(400).json({ error: "period wajib diisi" });
    return;
  }

  const found = firstEnv(...AI_KEY_KEYS);
  if (!found) {
    res.status(503).json({ error: `Tidak ada API key AI terkonfigurasi (dicoba: ${AI_KEY_KEYS.join(", ")})` });
    return;
  }

  try {
    const digest = await buildDataDigest(period);
    const prompt = `Kamu adalah analis People Development. Berdasarkan data monitoring program pelatihan BCU (Bumitama Corporate University) berikut, buat ringkasan eksekutif berbahasa Indonesia dalam 4-6 kalimat singkat dan padat: sebutkan capaian utama, area yang paling tertinggal/berisiko, dan satu rekomendasi fokus untuk sisa tahun. Jangan gunakan format markdown, tulis sebagai paragraf biasa.\n\nData:\n${digest}`;

    let summary: string;
    if (found.name === "ANTHROPIC_API_KEY") {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": found.value, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({
          model: "claude-sonnet-4-5",
          max_tokens: 500,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!r.ok) throw new Error(`Anthropic API HTTP ${r.status}: ${await r.text()}`);
      const data = (await r.json()) as { content: Array<{ text?: string }> };
      summary = data.content.map((c) => c.text ?? "").join("");
    } else {
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${found.value}` },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          max_tokens: 500,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!r.ok) throw new Error(`OpenAI API HTTP ${r.status}: ${await r.text()}`);
      const data = (await r.json()) as { choices: Array<{ message: { content: string } }> };
      summary = data.choices[0]?.message?.content ?? "";
    }

    res.status(200).json({ period, summary, provider: found.name, generatedAt: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
}
