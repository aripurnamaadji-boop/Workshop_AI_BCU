import crypto from "node:crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSql } from "./db.js";

const COOKIE_NAME = "bcu_session";
const SESSION_DAYS = 14;

export async function ensureAuthTables() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS bcu_users (
      id serial PRIMARY KEY,
      username text NOT NULL UNIQUE,
      password_hash text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS bcu_sessions (
      token text PRIMARY KEY,
      user_id integer NOT NULL REFERENCES bcu_users(id) ON DELETE CASCADE,
      created_at timestamptz NOT NULL DEFAULT now(),
      expires_at timestamptz NOT NULL
    )
  `;
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const check = crypto.scryptSync(password, salt, 64).toString("hex");
  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(check, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function createSession(userId: number): Promise<string> {
  const sql = getSql();
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString();
  await sql`INSERT INTO bcu_sessions (token, user_id, expires_at) VALUES (${token}, ${userId}, ${expiresAt})`;
  return token;
}

export async function getSessionUser(req: VercelRequest): Promise<{ id: number; username: string } | null> {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return null;
  const sql = getSql();
  const rows = await sql`
    SELECT u.id, u.username FROM bcu_sessions s
    JOIN bcu_users u ON u.id = s.user_id
    WHERE s.token = ${token} AND s.expires_at > now()
  `;
  return (rows[0] as { id: number; username: string } | undefined) ?? null;
}

export async function requireAuth(req: VercelRequest, res: VercelResponse): Promise<{ id: number; username: string } | null> {
  const user = await getSessionUser(req);
  if (!user) {
    res.status(401).json({ error: "Belum login" });
    return null;
  }
  return user;
}

export function setSessionCookie(res: VercelResponse, token: string) {
  const maxAge = SESSION_DAYS * 24 * 60 * 60;
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax; Secure`);
}

export function clearSessionCookie(res: VercelResponse) {
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; Secure`);
}

export async function deleteSession(req: VercelRequest) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return;
  const sql = getSql();
  await sql`DELETE FROM bcu_sessions WHERE token = ${token}`;
}
