import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAuth } from "../auth.js";
import { buildBcuDigest } from "../bcuDigest.js";
import { callAi } from "../aiClient.js";

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

  try {
    const digest = await buildBcuDigest(period);
    const prompt = `Kamu adalah analis People Development. Berdasarkan data monitoring program pelatihan BCU (Bumitama Corporate University) berikut, buat ringkasan eksekutif berbahasa Indonesia dalam 4-6 kalimat singkat dan padat: sebutkan capaian utama, area yang paling tertinggal/berisiko, dan satu rekomendasi fokus untuk sisa tahun. Jangan gunakan format markdown, tulis sebagai paragraf biasa.\n\nData:\n${digest}`;

    const { text, provider } = await callAi([{ role: "user", content: prompt }], { maxTokens: 500 });
    res.status(200).json({ period, summary: text, provider, generatedAt: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
}
