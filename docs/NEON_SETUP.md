# Neon DB setup – why there was no data, and how to fix it

## Why there was no data in Neon

1. **DB client was stubbed**  
   To fix an earlier “Module not found” build error, the Neon client in `frontend/lib/db/client.ts` was replaced with a stub (`sql = null`). So the app never connected to Neon and all data stayed in memory.

2. **Schema not created**  
   Even with a real client, Neon needs tables. The API writes to `trip_intents` and `bookings`. Those tables must exist in your Neon project (e.g. by running the schema SQL once).

3. **`DATABASE_URL` not set**  
   The client only connects when `DATABASE_URL` is set in the frontend env (e.g. `.env.local`). No env → no connection → no data in Neon.

---

## How to get data into Neon

### 1. Install dependencies

From the **frontend** folder (required before `db:schema` or dev):

```bash
cd frontend
npm install
```

This installs `@neondatabase/serverless` (already in `package.json`).

### 2. Create tables in Neon

**Option A – one command (recommended)**  
After `npm install` and with `DATABASE_URL` in `frontend/.env.local`, from the **frontend** folder run:

```bash
cd frontend
npm run db:schema
```

This applies `lib/db/schema.sql` to your Neon project (creates `trip_intents` and `bookings`).

**Option B – manual**  
- Open your [Neon console](https://console.neon.tech), select your project.
- Open **SQL Editor**, paste the contents of **`frontend/lib/db/schema.sql`**, and run it.

### 3. Set `DATABASE_URL` for the frontend

In `frontend/.env.local` (create if missing):

```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```

Use the connection string from Neon (Dashboard → your project → Connection string).

### 4. Restart the dev server

```bash
cd frontend
npm run dev
```

After that, when users create a trip intent or complete a mock booking, the API will write to Neon and you’ll see data in `trip_intents` and `bookings`.

---

## Summary

| Step | What to do |
|------|------------|
| 1 | `npm install` in `frontend/` (so `@neondatabase/serverless` is present) |
| 2 | Run `frontend/lib/db/schema.sql` in Neon (SQL Editor or psql) |
| 3 | Set `DATABASE_URL` in `frontend/.env.local` |
| 4 | Restart `npm run dev` |

The client in `frontend/lib/db/client.ts` is restored so that when `DATABASE_URL` is set and the schema exists, data is persisted to Neon.
