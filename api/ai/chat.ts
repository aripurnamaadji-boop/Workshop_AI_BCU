import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSql } from "../_lib/db.js";
import { requireAuth } from "../_lib/auth.js";
import { ensureChatTables, titleFromMessage } from "../_lib/chat.js";
import { buildBcuDigest, latestPeriod } from "../_lib/bcuDigest.js";
import { callAi, type ChatMessage } from "../_lib/aiClient.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const user = await requireAuth(req, res);
  if (!user) return;

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const conversationId = Number(body.conversationId);
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!Number.isInteger(conversationId)) {
    res.status(400).json({ error: "conversationId wajib diisi" });
    return;
  }
  if (!message) {
    res.status(400).json({ error: "message kosong" });
    return;
  }

  try {
    await ensureChatTables();
    const sql = getSql();

    const owned = await sql`SELECT id, title FROM bcu_chat_conversations WHERE id = ${conversationId} AND user_id = ${user.id}`;
    if (owned.length === 0) {
      res.status(404).json({ error: "Percakapan tidak ditemukan" });
      return;
    }
    const conversation = owned[0] as { id: number; title: string };

    await sql`INSERT INTO bcu_chat_messages (conversation_id, role, content) VALUES (${conversationId}, 'user', ${message})`;

    const history = await sql`
      SELECT role, content FROM bcu_chat_messages WHERE conversation_id = ${conversationId} ORDER BY id ASC
    `;
    const messages = history as ChatMessage[];

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

    await sql`INSERT INTO bcu_chat_messages (conversation_id, role, content) VALUES (${conversationId}, 'assistant', ${text})`;

    const newTitle = conversation.title === "Percakapan baru" ? titleFromMessage(message) : conversation.title;
    await sql`UPDATE bcu_chat_conversations SET updated_at = now(), title = ${newTitle} WHERE id = ${conversationId}`;

    res.status(200).json({ reply: text, title: newTitle });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
}
