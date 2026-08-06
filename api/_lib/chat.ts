import { getSql } from "./db.js";

export async function ensureChatTables() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS bcu_chat_conversations (
      id serial PRIMARY KEY,
      user_id integer NOT NULL REFERENCES bcu_users(id) ON DELETE CASCADE,
      title text NOT NULL DEFAULT 'Percakapan baru',
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS bcu_chat_messages (
      id serial PRIMARY KEY,
      conversation_id integer NOT NULL REFERENCES bcu_chat_conversations(id) ON DELETE CASCADE,
      role text NOT NULL,
      content text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `;
}

export function titleFromMessage(message: string): string {
  const clean = message.trim().replace(/\s+/g, " ");
  return clean.length > 48 ? `${clean.slice(0, 48)}...` : clean || "Percakapan baru";
}
