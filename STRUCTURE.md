# Safar.ai – Project structure

Clean, functional layout for the MVP.

---

## Root

```
safar.ai/
├── frontend/          # Next.js app (UI + Next.js API Routes)
├── ml/                # Python ML models and datasets
├── docs/              # All project documentation
├── _archive/          # Discarded unused legacy files
├── package.json       # Root scripts
├── PRESENTATION_GUIDE.md # Interview / Presentation logic
└── README.md
```

---

## Frontend (`frontend/`)

| Path | Purpose |
|------|--------|
| `app/` | Next.js App Router: `page.tsx`, `layout.tsx`, API Routes (`api/discovery`, `api/trips`) |
| `components/` | React UI: Core screens components and editorial styling |
| `hooks/` | React Hooks for trip logic (`useTripContext`, `useTrip`) |
| `types/` | TypeScript interfaces (TripIntent, MVPDestination) |

**Run:** `npm run dev` from `frontend/` → http://localhost:3000

---

## Machine Learning Engine (`ml/`)

| Path | Purpose |
|------|--------|
| `predict.py` | Sync inference script called directly by Next.js |
| `train_models.py` | Random Forest script used to bake `.pkl` binaries |
| `models/` | Serialized `.pkl` exports for model A (Destinations) and C (Budget) |
| `clean_data/` | Geography knowledge graphs and budget baselines |

Frontend executes the ML scripts via Node `child_process` sync shell execution, passing valid JSON payloads to predictions and keeping the web app Monolithic.

---

## Docs (recommended: move into `docs/`)

To keep the root clean, move these into `docs/`:

- `API_SCHEMA.md`
- `COMPLETE_ARCHITECTURE_GUIDE.md`
- `DATA_PERSISTENCE_GUIDE.md`
- `FRONTEND_IMPLEMENTATION_COMPLETE.md`
- `FRONTEND_QUICK_START.md`
- `MVP_README.md`
- `PERSISTENCE_COMPLETION_REPORT.md`
- `QUICK_REFERENCE.md`
- (Keep `README.md` at root.)

---

## Data flow

1. **Browser** → `frontend` (Next.js) → `app/page.tsx` + components.
2. **API** → `POST /api/trips` (`app/api/trips/route.ts`) → `lib/db` (Neon) or in-memory.
3. **Neon** (optional): set `DATABASE_URL`, run `frontend/lib/db/schema.sql` in Neon, run `npm install` in frontend so `@neondatabase/serverless` is present. Then intents and bookings are stored in Neon.

See **`docs/NEON_SETUP.md`** for why there was no data in Neon and how to enable it.
