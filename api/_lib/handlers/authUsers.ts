import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSql } from "../db.js";
import { hashPassword, requireAuth } from "../auth.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const requester = await requireAuth(req, res);
  if (!requester) return;

  const sql = getSql();

  if (req.method === "GET") {
    const rows = await sql`SELECT username, created_at::text AS "createdAt" FROM bcu_users ORDER BY created_at ASC`;
    res.status(200).json({ users: rows });
    return;
  }

  if (req.method === "POST") {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const username = typeof body.username === "string" ? body.username.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!/^[a-z0-9._-]{3,40}$/.test(username)) {
      res.status(400).json({ error: "Username 3-40 karakter, huruf/angka/titik/underscore/strip saja" });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ error: "Password minimal 6 karakter" });
      return;
    }

    try {
      await sql`INSERT INTO bcu_users (username, password_hash) VALUES (${username}, ${hashPassword(password)})`;
      res.status(200).json({ ok: true, username });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes("duplicate key")) {
        res.status(409).json({ error: "Username sudah dipakai" });
        return;
      }
      res.status(500).json({ error: message });
    }
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}
