export function firstEnv(...names: string[]): { name: string; value: string } | null {
  for (const name of names) {
    const value = process.env[name];
    if (value) return { name, value };
  }
  return null;
}

export const DB_URL_KEYS = ["DATABASE_URL", "POSTGRES_URL", "NEON_DATABASE_URL", "DATABASE_URL_UNPOOLED"];
export const AI_KEY_KEYS = ["ANTHROPIC_API_KEY", "OPENAI_API_KEY"];
export const BLOB_TOKEN_KEY = "BLOB_READ_WRITE_TOKEN";
