import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSql } from "../../_lib/db.js";
import { requireAuth } from "../../_lib/auth.js";
import { ensureChatTables } from "../../_lib/chat.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user = await requireAuth(req, res);
  if (!user) return;

  const id = Number(req.query.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "id tidak valid" });
    return;
  }

  try {
    await ensureChatTables();
    const sql = getSql();

    const owned = await sql`SELECT id FROM bcu_chat_conversations WHERE id = ${id} AND user_id = ${user.id}`;
    if (owned.length === 0) {
      res.status(404).json({ error: "Percakapan tidak ditemukan" });
      return;
    }

    if (req.method === "GET") {
      const messages = await sql`
        SELECT role, content FROM bcu_chat_messages WHERE conversation_id = ${id} ORDER BY id ASC
      `;
      res.status(200).json({ messages });
      return;
    }

    if (req.method === "DELETE") {
      await sql`DELETE FROM bcu_chat_conversations WHERE id = ${id}`;
      res.status(200).json({ ok: true });
      return;
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
}
