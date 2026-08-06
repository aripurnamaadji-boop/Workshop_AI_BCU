import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";
import { put } from "@vercel/blob";
import { firstEnv, DB_URL_KEYS, AI_KEY_KEYS, BLOB_TOKEN_KEY } from "../env.js";

type CheckResult = { ok: boolean; detail: string; envVar?: string };

async function checkDb(): Promise<CheckResult> {
  const found = firstEnv(...DB_URL_KEYS);
  if (!found) return { ok: false, detail: `Tidak ada env var terisi (dicoba: ${DB_URL_KEYS.join(", ")})` };
  try {
    const sql = neon(found.value);
    await sql`CREATE TABLE IF NOT EXISTS _health_check (id serial primary key, checked_at timestamptz default now())`;
    const [{ id }] = await sql`INSERT INTO _health_check DEFAULT VALUES RETURNING id`;
    const [{ count }] = await sql`SELECT count(*)::int AS count FROM _health_check`;
    return { ok: true, detail: `Terhubung. Baris terakhir id=${id}, total baris=${count}`, envVar: found.name };
  } catch (err) {
    return { ok: false, detail: err instanceof Error ? err.message : String(err), envVar: found.name };
  }
}

async function checkBlob(): Promise<CheckResult> {
  const token = process.env[BLOB_TOKEN_KEY];
  if (!token) return { ok: false, detail: `Env var ${BLOB_TOKEN_KEY} tidak ditemukan` };
  try {
    const path = `health-checks/${Date.now()}.txt`;
    const blob = await put(path, `health check ${new Date().toISOString()}`, {
      access: "public",
      token,
      addRandomSuffix: false,
    });
    const res = await fetch(blob.url);
    if (!res.ok) throw new Error(`Gagal baca balik blob (HTTP ${res.status})`);
    return { ok: true, detail: `Upload & baca balik berhasil: ${blob.url}`, envVar: BLOB_TOKEN_KEY };
  } catch (err) {
    return { ok: false, detail: err instanceof Error ? err.message : String(err), envVar: BLOB_TOKEN_KEY };
  }
}

async function checkAi(): Promise<CheckResult> {
  const found = firstEnv(...AI_KEY_KEYS);
  if (!found) return { ok: false, detail: `Tidak ada env var terisi (dicoba: ${AI_KEY_KEYS.join(", ")})` };
  try {
    if (found.name === "ANTHROPIC_API_KEY") {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": found.value,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5",
          max_tokens: 8,
          messages: [{ role: "user", content: "Balas dengan satu kata: OK" }],
        }),
      });
      if (!res.ok) throw new Error(`Anthropic API HTTP ${res.status}: ${await res.text()}`);
      return { ok: true, detail: "Anthropic API key valid dan bisa dipanggil", envVar: found.name };
    }
    const res = await fetch("https://api.openai.com/v1/models", {
      headers: { authorization: `Bearer ${found.value}` },
    });
    if (!res.ok) throw new Error(`OpenAI API HTTP ${res.status}: ${await res.text()}`);
    return { ok: true, detail: "OpenAI API key valid dan bisa dipanggil", envVar: found.name };
  } catch (err) {
    return { ok: false, detail: err instanceof Error ? err.message : String(err), envVar: found.name };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const [db, blob, ai] = await Promise.all([checkDb(), checkBlob(), checkAi()]);
  const allOk = db.ok && blob.ok && ai.ok;

  res.status(allOk ? 200 : 503).json({
    timestamp: new Date().toISOString(),
    allOk,
    checks: { db, blob, ai },
  });
}
