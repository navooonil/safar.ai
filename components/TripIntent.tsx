"use client";

/**
 * TripIntent – CMO-approved Step 1: Trip Intent.
 * Only 4 inputs: destination (3 options), days, budget style, travel style.
 * No long forms. No technical language.
 */

import React, { useState } from "react";
import type { TripIntentFormDataMVP, MVPDestination, BudgetStyle, TravelStyle, UserProfile } from "@/types";
import { MVP_DESTINATIONS, BUDGET_STYLES, TRAVEL_STYLES, MVP_SCOPE_COPY } from "@/constants";

export interface TripIntentProps {
  onSubmit: (data: TripIntentFormDataMVP) => void;
  onDiscover: () => void;
  loading?: boolean;
  error?: string | null;
  initialDestination?: MVPDestination;
  userProfile?: UserProfile | null;
}

export default function TripIntent({ onSubmit, onDiscover, loading, error, initialDestination, userProfile }: TripIntentProps) {
  const defaultTravelStyle = userProfile?.traits.pace === "Fast" ? "Adventure" : userProfile?.traits.pace === "Slow" ? "Relaxed" : "Balanced";

  const [destination, setDestination] = useState<MVPDestination>(initialDestination || "Varanasi");
  const [days, setDays] = useState(3);
  const [budgetStyle, setBudgetStyle] = useState<BudgetStyle>("Comfortable");
  const [travelStyle, setTravelStyle] = useState<TravelStyle>(defaultTravelStyle);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ destination, days, budgetStyle, travelStyle });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] font-[family-name:var(--font-inter)] selection:bg-orange-500/30 p-4 pt-12">
      <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-10">
          <span className="font-[family-name:var(--font-caveat)] text-2xl text-[#E86B3D]">Your Escape</span>
          <h1 className="text-4xl font-extrabold text-stone-900 mb-2 mt-1 tracking-tight">
            Where to?
          </h1>
          <p className="text-stone-500 mb-6">
            A few choices—we’ll handle the rest.
          </p>

          <button 
            type="button"
            onClick={onDiscover}
            className="inline-flex items-center gap-2 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-800 text-sm font-semibold px-4 py-2 rounded-full transition"
          >
            Not sure? Tell us your vibe ✨
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-[40px] shadow-sm border border-stone-100">
          {/* Destination: 3 cards */}
          <div>
            <label className="block text-sm font-semibold text-stone-900 mb-3">
              Destination
            </label>
            <input
              type="text"
              required
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
              placeholder="E.g., Jaipur, Munnar, Tokyo..."
            />
          </div>

          {/* Number of days */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              Number of days
            </label>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
            >
              {[2, 3, 4, 5, 6, 7].map((d) => (
                <option key={d} value={d}>
                  {d} {d === 1 ? "day" : "days"}
                </option>
              ))}
            </select>
          </div>

          {/* Budget style */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              Budget style
            </label>
            <div className="flex gap-3">
              {BUDGET_STYLES.map((b) => (
                <button
                  key={b.value}
                  type="button"
                  onClick={() => setBudgetStyle(b.value)}
                  className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all ${
                    budgetStyle === b.value
                      ? "border-amber-600 bg-amber-50 text-stone-900"
                      : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Travel style */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              Travel style
            </label>
            <div className="flex flex-wrap gap-2">
              {TRAVEL_STYLES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTravelStyle(t.value)}
                  className={`px-4 py-2.5 rounded-xl border-2 font-medium transition-all ${
                    travelStyle === t.value
                      ? "border-amber-600 bg-amber-50 text-stone-900"
                      : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-900 hover:bg-stone-800 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition"
          >
            {loading ? "Starting…" : "Plan my trip"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-500">
          {MVP_SCOPE_COPY}
        </p>
      </div>
    </div>
  );
}
