/**
 * Central export for all domain and API types.
 * Import from "@/types" or "@/types/trip", etc.
 */

export type {
  PageStep,
  TripData,
  PredictedBudget,
  CreateIntentInput,
  TripIntentFormData,
  TripIntentFormDataMVP,
  TripIntentResponse,
  MVPDestination,
  BudgetStyle,
  TravelStyle,
  BudgetBreakdown,
  DayPlan,
  HandbookItinerary,
  UserProfile,
  DiscoverySuggestion,
  DiscoveryQuery,
} from "./trip";

export type {
  UserContact,
  BookingItinerary,
  BookingConfirmation,
} from "./booking";

export type {
  CandidateOption,
  ScoringBreakdown,
  ItineraryCandidate,
} from "./candidate";

export type {
  TripApiAction,
  TripApiRequest,
  CreateIntentResponse,
  GetBudgetResponse,
  GetCandidatesResponse,
  CreateBookingPayload,
  CreateBookingResponse,
} from "./api";
