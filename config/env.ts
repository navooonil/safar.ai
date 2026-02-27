/**
 * Environment configuration.
 * Validates and exposes env vars; avoids scattering process.env across the app.
 */

/** Database URL for Neon (server-side only). When unset, API uses in-memory/backend fallback. */
export function getDatabaseUrl(): string | undefined {
  return process.env.DATABASE_URL;
}

/** Whether NeonDB is configured and should be used for persistence */
export function hasDatabase(): boolean {
  return Boolean(getDatabaseUrl());
}
