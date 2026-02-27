/**
 * API request/response shapes for /api/trips.
 */

import type {
  CreateIntentInput,
  TripIntentResponse,
  PredictedBudget,
  BudgetBreakdown,
} from "./trip";
import type { ItineraryCandidate } from "./candidate";
import type { BookingConfirmation, UserContact } from "./booking";
import type { CandidateOption } from "./candidate";

/** All supported trip API actions */
export type TripApiAction =
  | "createIntent"
  | "getBudget"
  | "getCandidates"
  | "createBooking";

/** Base POST body: action + action-specific payload */
export interface TripApiRequest {
  action: TripApiAction;
  [key: string]: unknown;
}

/** createIntent response (same as TripIntentResponse) */
export type CreateIntentResponse = TripIntentResponse;

/** getBudget response */
export interface GetBudgetResponse {
  tripId: string;
  predictedBudget: PredictedBudget & {
    perPersonINR?: number;
    perDayINR?: number;
  };
  budgetBreakdown?: BudgetBreakdown;
  modelMetrics?: { r2_score: number; mae: number };
}

/** getCandidates response */
export interface GetCandidatesResponse {
  tripId: string;
  candidates: ItineraryCandidate[];
}

/** createBooking request payload (subset of body) */
export interface CreateBookingPayload {
  tripId: string;
  selectedCandidate: CandidateOption;
  userContact: UserContact;
}

/** createBooking response */
export type CreateBookingResponse = BookingConfirmation;
