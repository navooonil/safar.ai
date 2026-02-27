/**
 * Neon serverless Postgres client.
 * Used only in API routes (server-side). Requires DATABASE_URL and @neondatabase/serverless.
 * If DATABASE_URL is unset, sql is null and the API uses in-memory fallback.
 */

import { neon } from "@neondatabase/serverless";
import { getDatabaseUrl } from "@/config/env";

const databaseUrl = getDatabaseUrl();

if (!databaseUrl) {
  console.warn(
    "[db] DATABASE_URL is not set. Trip intents and bookings will not be persisted to Neon."
  );
}

/** Tagged-template SQL client. Null when DATABASE_URL is unset. */
export const sql = databaseUrl ? neon(databaseUrl) : null;

/** Whether the app is connected to Neon (for conditional persistence). */
export function hasDb(): boolean {
  return Boolean(databaseUrl && sql);
}
