import { neon } from "@neondatabase/serverless";
import { firstEnv, DB_URL_KEYS } from "./env.js";

export function getSql() {
  const found = firstEnv(...DB_URL_KEYS);
  if (!found) {
    throw new Error(`Tidak ada env var database terisi (dicoba: ${DB_URL_KEYS.join(", ")})`);
  }
  return neon(found.value);
}
