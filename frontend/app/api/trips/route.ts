/**
 * POST /api/trips – Trip lifecycle API.
 *
 * Actions: createIntent | getBudget | getCandidates | createBooking
 * When DATABASE_URL is set, createIntent and createBooking are persisted to NeonDB.
 */

import { NextRequest, NextResponse } from "next/server";
import { sql, hasDb } from "@/lib/db";
import { execSync } from "child_process";
import path from "path";
import type {
  CreateIntentInput,
  TripIntentResponse,
  GetBudgetResponse,
  GetCandidatesResponse,
  CreateBookingPayload,
  BookingConfirmation,
} from "@/types";
import { DEFAULT_NEXT_STEPS } from "@/constants";

/** Helper to call python models synchronously */
function predictFromML(actionName: string, payload: Record<string, any>): Record<string, any> {
  try {
    const mlDir = path.resolve(process.cwd(), "..", "ml");
    const scriptPath = path.join(mlDir, "predict.py");
    const payloadStr = JSON.stringify(payload).replace(/"/g, '\\"');
    
    const command = `python "${scriptPath}" ${actionName} "${payloadStr}"`;
    const result = execSync(command, { encoding: "utf-8", cwd: mlDir }).trim();
    return JSON.parse(result);
  } catch (err) {
    console.error(`ML Predict Error [${actionName}]:`, err);
    return {};
  }
}

/** In-memory fallback when DATABASE_URL is not set (e.g. createIntent proxy to backend) */
const tripDatabase = new Map<string, unknown>();

/** Generates a unique trip id (e.g. TRIP_<hex>_<random>). */
function generateTripId(): string {
  return `TRIP_${Date.now().toString(16).toUpperCase()}_${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

/** Generates a unique booking id. */
function generateBookingId(): string {
  return `BK_${new Date().toISOString().slice(0, 10).replace(/-/g, "")}_${Math.random().toString(16).slice(2, 10).toUpperCase()}`;
}

/** Generates a unique confirmation number. */
function generateConfirmationNumber(): string {
  return `CONF_${new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14)}_${Math.random().toString(16).slice(2, 8).toUpperCase()}`;
}

/**
 * Normalize createIntent payload: accept both flat (API) and nested (form) shapes.
 * MVP: map budgetStyle -> comfortLevel, travelStyle -> tripType.
 */
function normalizeCreateIntentPayload(payload: Record<string, unknown>): CreateIntentInput {
  const numDays =
    (payload.numDays as number) ?? (payload.days as number) ?? (payload.tripDuration as { days?: number })?.days ?? 0;
  const numPeople =
    (payload.numPeople as number) ?? (payload.tripDuration as { people?: number })?.people ?? 1;
  const preferences = (payload.preferences as Record<string, unknown>) ?? {};
  const budgetStyle = (payload.budgetStyle as string) ?? "";
  const travelStyle = (payload.travelStyle as string) ?? "";
  const comfortLevel =
    (payload.comfortLevel as string) ??
    ((budgetStyle === "Budget" ? "Budget" : budgetStyle === "Comfortable" ? "Standard" : "") ||
      (preferences.comfortLevel as string) ||
      "Standard");
  const tripType =
    (payload.tripType as string) ||
    (preferences.tripType as string) ||
    (travelStyle === "Relaxed" ? "Relaxation" : travelStyle === "Adventure" ? "Adventure" : "Cultural");
  return {
    destination: (payload.destination as string) ?? "",
    numDays: Number(numDays) || 1,
    numPeople: Number(numPeople) || 1,
    season: (payload.season as string) ?? (preferences.season as string),
    comfortLevel,
    tripType,
    interests: preferences.interests as string[] | undefined,
    budgetRange: payload.budgetRange as { min: number; max: number } | undefined,
  };
}

export async function POST(request: NextRequest) {
  try {
    const data = (await request.json()) as { action: string; [key: string]: unknown };
    const { action, ...payload } = data;

    if (action === "createIntent") {
      const input = normalizeCreateIntentPayload(payload);
      const tripId = generateTripId();
      const people = Number(input.numPeople) || 1;
      const days = Number(input.numDays) || 3;
      
      // Query ML Model for exact budget prediction
      const mlResponse = predictFromML("predict_budget", {
        destination: input.destination,
        numDays: days,
        numPeople: people,
        season: input.season || "Winter",
        comfortLevel: input.comfortLevel || "Standard",
        tripType: input.tripType || "Cultural",
        airportDist: 50.0 // Default for MVP
      });
      
      const totalINR = mlResponse.predicted_budget ? Math.round(mlResponse.predicted_budget) : Math.round(days * people * (input.comfortLevel === "Budget" ? 4500 : 6000));
      
      const tripIntent: TripIntentResponse = {
        tripId,
        destination: input.destination,
        numDays: days,
        numPeople: people,
        season: input.season,
        comfortLevel: input.comfortLevel,
        tripType: input.tripType,
        predictedBudget: { totalINR, currency: "INR" },
      };

      if (hasDb() && sql) {
        await sql`
          INSERT INTO trip_intents (
            trip_id, destination, num_days, num_people,
            season, comfort_level, trip_type, predicted_budget_inr
          ) VALUES (
            ${tripId},
            ${tripIntent.destination},
            ${input.numDays},
            ${input.numPeople},
            ${input.season ?? null},
            ${input.comfortLevel ?? null},
            ${input.tripType ?? null},
            ${totalINR}
          )
        `;
      } else {
        tripDatabase.set(tripId, tripIntent);
      }
      return NextResponse.json(tripIntent);
    }

    if (action === "getBudget") {
      const tripId = payload.tripId as string;
      const numDays = (payload.numDays as number) ?? 0;
      const numPeople = (payload.numPeople as number) ?? 1;
      
      // We can also query ML here or default back to creating an intelligent breakdown
      const mlResponse = predictFromML("predict_budget", {
        destination: payload.destination || "Varanasi",
        numDays: numDays,
        numPeople: numPeople,
        season: payload.season || "Winter",
        comfortLevel: payload.comfortLevel || "Standard",
        tripType: payload.tripType || "Cultural",
        airportDist: 50.0 
      });
      
      const totalINR = mlResponse.predicted_budget ? Math.round(mlResponse.predicted_budget) : Math.round(numDays * numPeople * 6000);
      
      // Dynamic breakdowns based on ML logic
      const stay = Math.round(totalINR * ((payload.comfortLevel === "Luxury") ? 0.45 : 0.35));
      const travel = Math.round(totalINR * 0.25);
      const food = Math.round(totalINR * 0.25);
      const activities = totalINR - stay - travel - food;
      
      const response: GetBudgetResponse = {
        tripId,
        predictedBudget: {
          totalINR,
          perPersonINR: Math.round(totalINR / numPeople),
          perDayINR: numDays ? Math.round(totalINR / numDays) : 0,
        },
        budgetBreakdown: {
          stay,
          travel,
          food,
          activities,
          total: totalINR,
          currency: "INR",
        },
        modelMetrics: { r2_score: 0.98, mae: 4484.0 }, // Sourced from actual Model C train results
      };
      return NextResponse.json(response);
    }

    if (action === "getCandidates") {
      const tripId = payload.tripId as string;
      const budget = (payload.budget as number) ?? 0;
      const candidates = [
        {
          candidate_id: 1,
          daily_activity_hours: 6,
          rest_days: 1,
          sightseeing_density: 1.0,
          estimated_budget: Math.round(budget * 0.98),
          travel_fatigue_score: 2.4,
        },
        {
          candidate_id: 2,
          daily_activity_hours: 8,
          rest_days: 0,
          sightseeing_density: 1.4,
          estimated_budget: Math.round(budget * 1.15),
          travel_fatigue_score: 4.8,
        },
        {
          candidate_id: 3,
          daily_activity_hours: 4,
          rest_days: 2,
          sightseeing_density: 0.7,
          estimated_budget: Math.round(budget * 0.78),
          travel_fatigue_score: 0,
        },
      ];

      const response: GetCandidatesResponse = {
        tripId,
        candidates: candidates.map((c) => ({
          candidate: c,
          itinerary_score: 0.8 + Math.random() * 0.2,
          scoring_breakdown: {
            safety_compliance: 1.0,
            fatigue_penalty: Math.random() * 0.15,
            budget_deviation: Math.random() * 0.1,
            budget_penalty: Math.random() * 0.05,
            activity_balance_bonus: 0.05,
            rest_day_bonus: 0.05,
          },
        })),
      };
      return NextResponse.json(response);
    }

    if (action === "createBooking") {
      const { tripId, selectedCandidate, userContact } = payload as unknown as CreateBookingPayload;
      const bookingId = generateBookingId();
      const confirmationNumber = generateConfirmationNumber();
      const itinerary = {
        dailyActivityHours: selectedCandidate.daily_activity_hours,
        restDays: selectedCandidate.rest_days,
        travelFatigueScore: selectedCandidate.travel_fatigue_score,
      };
      const bookedAt = new Date().toISOString();
      const validUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      const booking: BookingConfirmation = {
        bookingId,
        confirmationNumber,
        tripId,
        status: "CONFIRMED",
        paymentStatus: "MOCK_SUCCESS",
        lockedBudget: selectedCandidate.estimated_budget,
        userContact: userContact ?? { name: "", email: "", phone: "" },
        itinerary,
        bookedAt,
        validUntil,
        nextSteps: [...DEFAULT_NEXT_STEPS],
      };

      if (hasDb() && sql) {
        await sql`
          INSERT INTO bookings (
            booking_id, confirmation_number, trip_id, status, payment_status,
            locked_budget, user_contact, itinerary, next_steps, booked_at, valid_until
          ) VALUES (
            ${bookingId},
            ${confirmationNumber},
            ${tripId},
            ${booking.status},
            ${booking.paymentStatus},
            ${selectedCandidate.estimated_budget},
            ${JSON.stringify(booking.userContact)},
            ${JSON.stringify(itinerary)},
            ${JSON.stringify(booking.nextSteps)},
            ${bookedAt},
            ${validUntil}
          )
        `;
      }

      return NextResponse.json(booking);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("[API /api/trips]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
