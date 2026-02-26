# Safar.AI

AI-powered travel planning: personalized itineraries, ML budget prediction, and explainable scoring.

## Project structure

```
safar.ai/
├── frontend/          # Next.js 14+ app (App Router)
│   ├── app/           # Routes, layout, API (e.g. /api/trips)
│   ├── components/    # TripCreation, ItineraryCandidates, BookingForm, BookingConfirmationDisplay
│   ├── hooks/         # useTrip
│   ├── lib/           # DB client (Neon), schema
│   ├── types/         # Shared TypeScript types
│   ├── config/        # Env (e.g. DATABASE_URL)
│   └── constants/     # Step labels, currency, etc.
├── backend/           # Optional Express plan-trip API (rules + ML + LLM)
│   └── src/           # server.ts, db.ts, config/, types/
├── COMPLETE_ARCHITECTURE_GUIDE.md
└── README.md
```

## Quick start

### Frontend (main app)

1. **Install and run**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   App: [http://localhost:3000](http://localhost:3000).

2. **Database (optional)**  
   To persist trip intents and bookings to [Neon](https://neon.tech) (Postgres):

   - Create a project in Neon and get the connection string.
   - Add to `frontend/.env.local`:
     ```env
     DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/DB?sslmode=require"
     ```
   - From `frontend/` run: **`npm run db:schema`** (creates tables in Neon).
   - Restart the dev server (`npm run dev`).

   Without `DATABASE_URL`, the app still runs; intents/bookings are not persisted to Neon.  
   **No data in Neon?** See **`docs/NEON_SETUP.md`** for causes and step-by-step setup.

### Backend (optional)

Used for the full plan-trip flow (rules + ML budget + optional LLM itinerary). Not required for the main Next.js flow.

```bash
cd backend/src
npm install
npm start
```

Runs on port **3001**. Set `OPENAI_API_KEY` for live LLM; otherwise mock data is used.

## Environment

| Variable              | Where    | Purpose |
|-----------------------|----------|---------|
| `DATABASE_URL`        | frontend | Neon Postgres connection (optional) |
| `PORT`                | backend  | Server port (default 3001) |
| `OPENAI_API_KEY`      | backend  | Live LLM orchestration (optional) |

## Tech stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS, Neon serverless driver
- **Backend:** Express, TypeScript, Zod, AI SDK (OpenAI), local JSON store

## Docs

- [COMPLETE_ARCHITECTURE_GUIDE.md](./COMPLETE_ARCHITECTURE_GUIDE.md) – Architecture, data flow, and API behavior.
