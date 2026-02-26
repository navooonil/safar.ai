import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { neon } from "@neondatabase/serverless";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const envPath = join(root, ".env.local");
if (existsSync(envPath)) {
  const content = readFileSync(envPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const m = line.match(/^\s*([^#=]+)=(.*)$/);
    if (m) {
        let val = m[2].trim();
        val = val.replace(/^["'](.*)["']$/, '$1');
        process.env[m[1].trim()] = val;
    }
  }
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const sql = neon(databaseUrl);

async function migrate() {
  try {
     console.log("Dropping existing tables for clean schema build...");
     await sql("DROP TABLE IF EXISTS bookings CASCADE;");
     await sql("DROP TABLE IF EXISTS saved_itineraries CASCADE;");
     await sql("DROP TABLE IF EXISTS trip_intents CASCADE;");
     await sql("DROP TABLE IF EXISTS user_traits CASCADE;");
     await sql("DROP TABLE IF EXISTS users CASCADE;");
     console.log("Existing tables dropped.");
  } catch(e) {
     console.warn("Could not drop tables:", e.message);
  }
}

migrate();
