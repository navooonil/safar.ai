# Safar.AI Frontend

Next.js app for the trip planning flow: create intent → choose itinerary → book → confirmation.

## Structure

- **`app/`** – App Router: `page.tsx` (home), `layout.tsx`, `api/trips/route.ts`
- **`components/`** – TripCreation, ItineraryCandidates, BookingForm, BookingConfirmationDisplay
- **`hooks/`** – `useTrip` (createIntent, getBudget, getCandidates, createBooking)
- **`lib/db/`** – Neon client (`client.ts`), schema (`schema.sql`), re-exports (`index.ts`)
- **`types/`** – Trip, booking, candidate, and API types
- **`config/`** – `env.ts` (e.g. `getDatabaseUrl()`, `hasDatabase()`)
- **`constants/`** – Step labels, currency, default strings

## Prerequisites

- Node.js 20+

## Run

```bash
npm install
npm run dev
```

Runs at [http://localhost:3000](http://localhost:3000).

## Database (Neon)

1. Create a Neon project and run `lib/db/schema.sql` in the SQL Editor.
2. In `frontend`, add `.env.local`:
   ```env
   DATABASE_URL="postgresql://..."
   ```
3. Restart the dev server.

If `DATABASE_URL` is unset, the app still works; trip intents and bookings are not persisted to Postgres.

## Scripts

- `npm run dev` – Development server
- `npm run build` – Production build
- `npm run start` – Run production build
- `npm run lint` – ESLint

## API

The app calls **`POST /api/trips`** with body `{ action, ...payload }`:

- `createIntent` – Create trip intent (persisted to Neon when `DATABASE_URL` is set)
- `getBudget` – Budget prediction
- `getCandidates` – Three itinerary candidates
- `createBooking` – Create booking (persisted to Neon when `DATABASE_URL` is set)

All handled inside the Next.js app; no separate backend required for the main flow.
