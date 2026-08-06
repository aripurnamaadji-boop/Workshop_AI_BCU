import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSql } from "../db.js";
import { ensureAuthTables, hashPassword } from "../auth.js";

const INITIAL_USERNAME = "muhamad.adji";
const INITIAL_PASSWORD = "Bumitama2027";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    await ensureAuthTables();
    const sql = getSql();

    const [{ count }] = await sql`SELECT count(*)::int AS count FROM bcu_users`;
    if (count > 0) {
      res.status(200).json({ seeded: false, detail: `Sudah ada ${count} user, seed dilewati (idempotent)` });
      return;
    }

    await sql`
      INSERT INTO bcu_users (username, password_hash)
      VALUES (${INITIAL_USERNAME}, ${hashPassword(INITIAL_PASSWORD)})
    `;

    res.status(200).json({ seeded: true, username: INITIAL_USERNAME });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
}
