"use client";

/**
 * BudgetFirst – Show estimated total and breakdown BEFORE itinerary.
 * Stay, Travel, Food, Activities. Single CTA: See my itinerary.
 */

import React from "react";
import type { BudgetBreakdown } from "@/types";
import { CURRENCY_SYMBOL } from "@/constants";

export interface BudgetFirstProps {
  breakdown: BudgetBreakdown;
  destination: string;
  days: number;
  onContinue: () => void;
}

const LABELS = {
  stay: "Stay",
  travel: "Travel",
  food: "Food",
  activities: "Activities",
} as const;

export default function BudgetFirst({
  breakdown,
  destination,
  days,
  onContinue,
}: BudgetFirstProps) {
  const items = [
    { key: "stay" as const, value: breakdown.stay },
    { key: "travel" as const, value: breakdown.travel },
    { key: "food" as const, value: breakdown.food },
    { key: "activities" as const, value: breakdown.activities },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-100 p-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-stone-900 mb-2">
            Your estimated budget
          </h1>
          <p className="text-stone-600">
            {days} days in {destination} — here’s a realistic breakdown.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden mb-6">
          <div className="bg-stone-900 text-white p-6 text-center">
            <div className="text-sm font-medium text-stone-300 mb-1">
              Estimated total
            </div>
            <div className="text-4xl font-bold">
              {CURRENCY_SYMBOL}{breakdown.total.toLocaleString()}
            </div>
            <div className="text-sm text-stone-400 mt-1">
              {breakdown.currency}
            </div>
          </div>

          <div className="p-6 space-y-4">
            {items.map(({ key, value }) => (
              <div
                key={key}
                className="flex justify-between items-center py-2 border-b border-stone-100 last:border-0"
              >
                <span className="text-stone-700 font-medium">{LABELS[key]}</span>
                <span className="font-semibold text-stone-900">
                  {CURRENCY_SYMBOL}{value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-stone-500 mb-6">
          Built for realistic travel. Prices are estimates, not live quotes.
        </p>

        <button
          type="button"
          onClick={onContinue}
          className="w-full bg-stone-900 hover:bg-stone-800 text-white font-semibold py-3.5 rounded-xl transition"
        >
          See my itinerary
        </button>
      </div>
    </div>
  );
}
