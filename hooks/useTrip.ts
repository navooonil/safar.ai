"use client";

/**
 * useTrip – Trip lifecycle API hook.
 * Handles createIntent, getBudget, getCandidates, and createBooking with loading/error state.
 */

import { useState } from "react";
import type {
  CreateIntentInput,
  TripIntentFormData,
  TripIntentFormDataMVP,
  TripIntentResponse,
  GetBudgetResponse,
  GetCandidatesResponse,
  ItineraryCandidate,
  CandidateOption,
  BookingConfirmation,
  UserContact,
} from "@/types";

const API_TRIPS = "/api/trips";

/**
 * Normalize form data to the flat API shape expected by createIntent.
 */
function toCreateIntentInput(form: TripIntentFormData): CreateIntentInput & Record<string, unknown> {
  return {
    destination: form.destination,
    numDays: form.tripDuration.days,
    numPeople: form.tripDuration.people,
    season: form.preferences.season,
    comfortLevel: form.preferences.comfortLevel,
    tripType: form.preferences.tripType,
    interests: form.preferences.interests,
    budgetRange: form.budgetRange,
  };
}

export interface UseTripReturn {
  loading: boolean;
  error: string | null;
  createTripIntent: (data: TripIntentFormData) => Promise<TripIntentResponse>;
  /** MVP: 4-field intent; maps budgetStyle/travelStyle for API */
  createTripIntentMVP: (data: TripIntentFormDataMVP) => Promise<TripIntentResponse>;
  getBudgetPrediction: (
    tripId: string,
    numDays: number,
    numPeople: number,
    season: string,
    comfortLevel: string,
  ) => Promise<GetBudgetResponse>;
  getItineraryCandidates: (
    tripId: string,
    budget: number,
    numDays: number,
  ) => Promise<GetCandidatesResponse>;
  createBooking: (
    tripId: string,
    selectedCandidate: CandidateOption,
    userContact: UserContact,
  ) => Promise<BookingConfirmation>;
}

export function useTrip(): UseTripReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTripIntent = async (
    data: TripIntentFormData,
  ): Promise<TripIntentResponse> => {
    setLoading(true);
    setError(null);
    try {
      const payload = toCreateIntentInput(data);
      const response = await fetch(API_TRIPS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "createIntent", ...payload }),
      });
      if (!response.ok) throw new Error("Failed to create trip intent");
      return (await response.json()) as TripIntentResponse;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createTripIntentMVP = async (
    data: TripIntentFormDataMVP,
  ): Promise<TripIntentResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_TRIPS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "createIntent",
          destination: data.destination,
          numDays: data.days,
          numPeople: 1,
          budgetStyle: data.budgetStyle,
          travelStyle: data.travelStyle,
        }),
      });
      if (!response.ok) throw new Error("Failed to create trip intent");
      return (await response.json()) as TripIntentResponse;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getBudgetPrediction = async (
    tripId: string,
    numDays: number,
    numPeople: number,
    season: string,
    comfortLevel: string,
  ): Promise<GetBudgetResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_TRIPS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "getBudget",
          tripId,
          numDays,
          numPeople,
          season,
          comfortLevel,
        }),
      });
      if (!response.ok) throw new Error("Failed to fetch budget");
      return (await response.json()) as GetBudgetResponse;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getItineraryCandidates = async (
    tripId: string,
    budget: number,
    numDays: number,
  ): Promise<GetCandidatesResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_TRIPS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "getCandidates",
          tripId,
          budget,
          numDays,
        }),
      });
      if (!response.ok) throw new Error("Failed to fetch candidates");
      return (await response.json()) as GetCandidatesResponse;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (
    tripId: string,
    selectedCandidate: CandidateOption,
    userContact: UserContact,
  ): Promise<BookingConfirmation> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_TRIPS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "createBooking",
          tripId,
          selectedCandidate,
          userContact,
        }),
      });
      if (!response.ok) throw new Error("Failed to create booking");
      return (await response.json()) as BookingConfirmation;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createTripIntent,
    createTripIntentMVP,
    getBudgetPrediction,
    getItineraryCandidates,
    createBooking,
  };
}

// Re-export types used by components that imported from useTrip
export type {
  TripIntentResponse,
  GetBudgetResponse,
  GetCandidatesResponse,
  ItineraryCandidate,
  CandidateOption,
  BookingConfirmation,
  UserContact,
};
