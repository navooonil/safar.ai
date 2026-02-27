"use client";

/**
 * ItineraryCandidates – Step 2: Choose Your Itinerary.
 * Displays 3 candidates with scores and breakdown; user selects one and proceeds to booking.
 */

import React, { useState } from "react";
import type { ItineraryCandidate, CandidateOption } from "@/types";

export interface ItineraryCandidatesProps {
  candidates: ItineraryCandidate[];
  budget: number;
  destination: string;
  days: number;
  onSelect: (candidate: CandidateOption) => void;
}

export default function ItineraryCandidates({
  candidates,
  budget,
  onSelect,
}: ItineraryCandidatesProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const getScoreColor = (score: number) => {
    if (score >= 0.9) return "text-green-600 bg-green-50";
    if (score >= 0.8) return "text-blue-600 bg-blue-50";
    return "text-orange-600 bg-orange-50";
  };

  const getActivityLevel = (hours: number) => {
    if (hours >= 8) return "Intense 💪";
    if (hours >= 6) return "Moderate 🚶";
    return "Relaxed 🧘";
  };

  const getRestDescription = (days: number) => {
    if (days === 0) return "Adventure mode 🏃";
    if (days === 1) return "Balanced 😊";
    return "Recovery focused 😴";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🎯 Choose Your Itinerary
          </h1>
          <p className="text-gray-600">
            3 personalized options scored by our AI-powered system
          </p>
          <div className="mt-4 inline-block bg-white px-6 py-2 rounded-full">
            <p className="text-lg font-semibold">
              Budget:{" "}
              <span className="text-indigo-600">
                ₹{budget.toLocaleString()}
              </span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {candidates.map((item, idx) => {
            const c = item.candidate;
            const score = item.itinerary_score;
            const isSelected = selectedId === c.candidate_id;

            return (
              <div
                key={c.candidate_id}
                onClick={() => setSelectedId(c.candidate_id)}
                className={`cursor-pointer transition-all transform hover:scale-105 rounded-xl shadow-lg overflow-hidden ${
                  isSelected
                    ? "ring-4 ring-indigo-600 shadow-2xl"
                    : "hover:shadow-xl"
                } ${isSelected ? "bg-indigo-50" : "bg-white"}`}
              >
                <div className="h-32 bg-gradient-to-br from-blue-500 to-indigo-600 relative flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-white">
                      {(score * 100).toFixed(0)}%
                    </div>
                    <div className="text-blue-100 text-sm">Overall Score</div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      Option {c.candidate_id}
                    </h3>
                    {isSelected && <span className="text-2xl">✓</span>}
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700">
                        Daily Activity
                      </span>
                      <span className="text-2xl">
                        {getActivityLevel(c.daily_activity_hours)}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {c.daily_activity_hours}h/day
                    </div>
                    <div className="text-xs text-gray-600 mt-2">
                      {c.daily_activity_hours >= 8
                        ? "High intensity exploration"
                        : c.daily_activity_hours >= 6
                          ? "Balanced sightseeing & rest"
                          : "Leisure-paced itinerary"}
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700">
                        Rest Days
                      </span>
                      <span className="text-2xl">
                        {getRestDescription(c.rest_days)}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {c.rest_days} days
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-sm font-semibold text-gray-700 mb-2">
                      Travel Fatigue
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-full rounded-full transition-all ${
                            c.travel_fatigue_score < 2
                              ? "bg-green-500"
                              : c.travel_fatigue_score < 4
                                ? "bg-yellow-500"
                                : "bg-orange-500"
                          }`}
                          style={{
                            width: `${Math.min((c.travel_fatigue_score / 5) * 100, 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-700 w-12">
                        {c.travel_fatigue_score.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <div className="bg-indigo-50 rounded-lg p-4 border-2 border-indigo-200">
                    <div className="text-sm font-semibold text-gray-700 mb-1">
                      Estimated Cost
                    </div>
                    <div className="text-2xl font-bold text-indigo-600">
                      ₹{c.estimated_budget.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600 mt-2">
                      {((c.estimated_budget / budget) * 100).toFixed(0)}% of
                      budget
                    </div>
                  </div>

                  <div className="text-center py-3 border-t border-gray-200">
                    <div className="text-xs text-gray-600 mb-2">
                      Sightseeing Intensity
                    </div>
                    <div className="flex justify-center gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`h-2 w-8 rounded ${
                            i <= Math.round(c.sightseeing_density * 3)
                              ? "bg-indigo-600"
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {selectedId && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              📊 Detailed Scoring Breakdown
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {candidates
                .find((c) => c.candidate.candidate_id === selectedId)
                ?.scoring_breakdown &&
                Object.entries(
                  candidates.find((c) => c.candidate.candidate_id === selectedId)
                    ?.scoring_breakdown ?? {},
                ).map(([key, value]) => (
                  <div key={key} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-700 capitalize">
                        {key.replace(/_/g, " ")}
                      </span>
                      <span className="text-lg font-bold text-indigo-600">
                        {(typeof value === "number" ? value * 100 : 0).toFixed(
                          0,
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min((value as number) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {selectedId && (
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                const selected = candidates.find(
                  (c) => c.candidate.candidate_id === selectedId,
                );
                if (selected) onSelect(selected.candidate);
              }}
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-lg transition transform hover:scale-105 flex items-center gap-2 text-lg"
            >
              <span>✈️</span> Confirm & Proceed to Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
