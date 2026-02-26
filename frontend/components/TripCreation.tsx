"use client";

/**
 * TripCreation – Step 1: Plan Your Trip.
 * Form for destination, duration, season, comfort, and trip type; submits to createIntent + getBudget.
 */

import React, { useState } from "react";
import { useTrip } from "@/hooks/useTrip";
import type { TripData, TripIntentFormData } from "@/types";

export interface TripCreationProps {
  /** Called with tripId and merged intent+budget data when intent is created and candidates are ready to fetch */
  onTripCreated: (tripId: string, data: Partial<TripData> & { predictedBudget?: { totalINR: number }; numDays?: number; numPeople?: number }) => void;
}

export default function TripCreation({ onTripCreated }: TripCreationProps) {
  const { loading, error, createTripIntent, getBudgetPrediction } = useTrip();
  const [formData, setFormData] = useState<TripIntentFormData>({
    destination: "Varanasi",
    tripDuration: { days: 3, people: 2 },
    preferences: {
      season: "Winter",
      comfortLevel: "Luxury",
      tripType: "Spiritual",
      interests: ["culture", "spirituality", "food"],
    },
    budgetRange: {
      min: 3 * 2 * 5000,
      max: 3 * 2 * 10000,
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const intent = await createTripIntent(formData);
      const budget = await getBudgetPrediction(
        intent.tripId,
        formData.tripDuration.days,
        formData.tripDuration.people,
        formData.preferences.season,
        formData.preferences.comfortLevel,
      );
      onTripCreated(intent.tripId, {
        ...intent,
        destination: intent.destination,
        days: formData.tripDuration.days,
        people: formData.tripDuration.people,
        season: intent.season,
        comfortLevel: intent.comfortLevel,
        tripType: intent.tripType,
        predictedBudget: budget.predictedBudget ? { totalINR: budget.predictedBudget.totalINR, currency: budget.predictedBudget.currency ?? 'INR' } : undefined,
      });
    } catch (err) {
      console.error("Error creating trip:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ✨ Plan Your Perfect Journey
          </h1>
          <p className="text-gray-600">
            Discover personalized itineraries crafted just for you
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🌍 Destination
              </label>
              <input
                type="text"
                value={formData.destination}
                onChange={(e) =>
                  setFormData({ ...formData, destination: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter destination"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📅 Days
                </label>
                <input
                  type="number"
                  value={formData.tripDuration.days}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tripDuration: {
                        ...formData.tripDuration,
                        days: parseInt(e.target.value, 10) || 1,
                      },
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min={1}
                  max={30}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  👥 People
                </label>
                <input
                  type="number"
                  value={formData.tripDuration.people}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tripDuration: {
                        ...formData.tripDuration,
                        people: parseInt(e.target.value, 10) || 1,
                      },
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min={1}
                  max={20}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🌤️ Season
                </label>
                <select
                  value={formData.preferences.season}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferences: {
                        ...formData.preferences,
                        season: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option>Winter</option>
                  <option>Spring</option>
                  <option>Summer</option>
                  <option>Autumn</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  💎 Comfort Level
                </label>
                <select
                  value={formData.preferences.comfortLevel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferences: {
                        ...formData.preferences,
                        comfortLevel: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option>Budget</option>
                  <option>Standard</option>
                  <option>Luxury</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🎯 Trip Type
              </label>
              <select
                value={formData.preferences.tripType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preferences: {
                      ...formData.preferences,
                      tripType: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>Spiritual</option>
                <option>Adventure</option>
                <option>Cultural</option>
                <option>Relaxation</option>
              </select>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span> Analyzing...
                </>
              ) : (
                <>
                  <span>🚀</span> Generate Itineraries
                </>
              )}
            </button>
          </form>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">🤖</div>
            <h3 className="font-semibold text-gray-900">AI-Powered</h3>
            <p className="text-sm text-gray-600">ML-driven budget prediction</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">✨</div>
            <h3 className="font-semibold text-gray-900">Personalized</h3>
            <p className="text-sm text-gray-600">3 unique itinerary options</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">🔒</div>
            <h3 className="font-semibold text-gray-900">Transparent</h3>
            <p className="text-sm text-gray-600">Explainable scoring</p>
          </div>
        </div>
      </div>
    </div>
  );
}
