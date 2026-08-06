import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSql } from "../db.js";
import { createSession, setSessionCookie, verifyPassword } from "../auth.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!username || !password) {
    res.status(400).json({ error: "Username dan password wajib diisi" });
    return;
  }

  try {
    const sql = getSql();
    const rows = await sql`SELECT id, username, password_hash FROM bcu_users WHERE username = ${username}`;
    const user = rows[0] as { id: number; username: string; password_hash: string } | undefined;

    if (!user || !verifyPassword(password, user.password_hash)) {
      res.status(401).json({ error: "Username atau password salah" });
      return;
    }

    const token = await createSession(user.id);
    setSessionCookie(res, token);
    res.status(200).json({ ok: true, user: { username: user.username } });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
}
