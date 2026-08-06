import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAuth } from "../_lib/auth.js";
import { buildBcuDigest, latestPeriod } from "../_lib/bcuDigest.js";
import { callAi, type ChatMessage } from "../_lib/aiClient.js";

const MAX_HISTORY = 20;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const user = await requireAuth(req, res);
  if (!user) return;

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const rawMessages = Array.isArray(body.messages) ? body.messages : [];
  const messages: ChatMessage[] = rawMessages
    .filter((m: unknown): m is ChatMessage => {
      const mm = m as ChatMessage;
      return !!mm && (mm.role === "user" || mm.role === "assistant") && typeof mm.content === "string" && mm.content.trim().length > 0;
    })
    .slice(-MAX_HISTORY);

  if (messages.length === 0) {
    res.status(400).json({ error: "messages kosong" });
    return;
  }

  try {
    const period = await latestPeriod();
    const digest = period ? await buildBcuDigest(period) : "Belum ada data BCU Development Program di database.";

    const system = `Kamu adalah "Assistant AI", asisten virtual di dalam aplikasi BCU Analytics milik Bumitama Corporate University (BCU) — unit pengembangan SDM dari Bumitama Gunajaya Agro. Pengguna adalah tim internal BCU/HC.

Kamu bisa menjawab dua jenis pertanyaan:
1. Pertanyaan spesifik tentang data monitoring program pelatihan BCU (gunakan snapshot data di bawah sebagai konteks utama).
2. Pertanyaan umum seputar people development, training, HR analytics, atau topik lain yang wajar ditanyakan pengguna — jawab dengan pengetahuan umummu.

Jawab dalam Bahasa Indonesia (kecuali user menulis dalam bahasa lain), singkat, jelas, dan actionable. Boleh pakai poin-poin bila membantu. Kalau data yang ditanyakan tidak ada di snapshot, katakan terus terang bahwa datanya tidak tersedia, jangan mengarang angka.

Snapshot data BCU Development Program saat ini:
${digest}`;

    const { text } = await callAi(messages, { system, maxTokens: 700 });
    res.status(200).json({ reply: text });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
}
