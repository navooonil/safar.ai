#!/usr/bin/env node
/**
 * Run Neon schema (trip_intents + bookings).
 * Uses DATABASE_URL from .env.local or env.
 * Usage: node scripts/run-schema.mjs   or  npm run db:schema
 */

import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { neon } from "@neondatabase/serverless";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// Load .env.local into process.env
const envPath = join(root, ".env.local");
if (existsSync(envPath)) {
  const content = readFileSync(envPath, "utf8");
  for (const line of content.split(/\r?\n/)) { // Support CRLF endings
    const m = line.match(/^\s*([^#=]+)=(.*)$/);
    if (m) {
        let val = m[2].trim();
        // Remove surrounding quotes, but let regex correctly handle unquoted strings
        val = val.replace(/^["'](.*)["']$/, '$1');
        process.env[m[1].trim()] = val;
    }
  }
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is not set. Add it to frontend/.env.local");
  process.exit(1);
}

const schemaPath = join(root, "lib", "db", "schema.sql");
const schema = readFileSync(schemaPath, "utf8");

const sql = neon(databaseUrl);
// Split on semicolon at line end (avoid splitting inside CREATE TABLE)
const statements = schema
  .replace(/--[^\n]*/g, "")
  .split(/\s*;\s*\n/)
  .map((s) => s.trim())
  .filter((s) => s.length > 0);

try {
  for (const statement of statements) {
    await sql(statement + ";");
  }
  console.log("Neon schema applied: trip_intents and bookings ready.");
} catch (err) {
  console.error("Schema run failed:", err.message);
  process.exit(1);
}
