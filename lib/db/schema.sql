-- Safar MVP – Neon schema
-- Run this once in your Neon project (SQL Editor or psql) so trip_intents and bookings exist.

-- Users (Auth)
CREATE TABLE IF NOT EXISTS users (
  user_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT, -- Nullable for OAuth
  auth_provider TEXT DEFAULT 'email', -- 'email' or 'google'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- User Traits (Onboarding & Behavioral)
CREATE TABLE IF NOT EXISTS user_traits (
  user_id TEXT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
  travel_style TEXT, -- relaxed / balanced / adventure
  budget_comfort TEXT, -- budget / mid / premium
  group_type TEXT, -- solo / couple / friends / family
  interests JSONB, -- array of strings: nature, food, culture, history etc.
  inferred_pace TEXT, -- Slow / Fast
  inferred_bias TEXT, -- Comfort / Experience
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trip intents (step 1)
CREATE TABLE IF NOT EXISTS trip_intents (
  trip_id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(user_id) ON DELETE SET NULL, -- Track who made it
  destination TEXT NOT NULL,
  num_days INTEGER NOT NULL,
  num_people INTEGER NOT NULL,
  season TEXT,
  comfort_level TEXT,
  trip_type TEXT,
  predicted_budget_inr INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved Itineraries (Behavioral history)
CREATE TABLE IF NOT EXISTS saved_itineraries (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES users(user_id) ON DELETE CASCADE,
  trip_id TEXT REFERENCES trip_intents(trip_id) ON DELETE CASCADE,
  destination TEXT NOT NULL,
  itinerary_data JSONB NOT NULL,
  saved_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings (mock confirmations)
CREATE TABLE IF NOT EXISTS bookings (
  booking_id TEXT PRIMARY KEY,
  confirmation_number TEXT NOT NULL,
  trip_id TEXT NOT NULL,
  status TEXT NOT NULL,
  payment_status TEXT NOT NULL,
  locked_budget INTEGER NOT NULL,
  user_contact JSONB NOT NULL,
  itinerary JSONB NOT NULL,
  next_steps JSONB NOT NULL,
  booked_at TIMESTAMPTZ NOT NULL,
  valid_until TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optional: index for listing by trip
CREATE INDEX IF NOT EXISTS idx_bookings_trip_id ON bookings (trip_id);
CREATE INDEX IF NOT EXISTS idx_saved_user_id ON saved_itineraries (user_id);
CREATE INDEX IF NOT EXISTS idx_intents_user_id ON trip_intents (user_id);
