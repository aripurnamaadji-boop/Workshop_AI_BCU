import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSql } from "../../_lib/db.js";
import { requireAuth } from "../../_lib/auth.js";
import { ensureChatTables } from "../../_lib/chat.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user = await requireAuth(req, res);
  if (!user) return;

  try {
    await ensureChatTables();
    const sql = getSql();

    if (req.method === "GET") {
      const rows = await sql`
        SELECT id, title, updated_at::text AS "updatedAt"
        FROM bcu_chat_conversations
        WHERE user_id = ${user.id}
        ORDER BY updated_at DESC
      `;
      res.status(200).json({ conversations: rows });
      return;
    }

    if (req.method === "POST") {
      const [conversation] = await sql`
        INSERT INTO bcu_chat_conversations (user_id, title)
        VALUES (${user.id}, 'Percakapan baru')
        RETURNING id, title, updated_at::text AS "updatedAt"
      `;
      res.status(200).json({ conversation });
      return;
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
}
