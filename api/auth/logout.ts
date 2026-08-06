import type { VercelRequest, VercelResponse } from "@vercel/node";
import { clearSessionCookie, deleteSession } from "../_lib/auth.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  try {
    await deleteSession(req);
  } finally {
    clearSessionCookie(res);
  }
  res.status(200).json({ ok: true });
}
