/**
 * Trip and itinerary domain types.
 * Used across the app: page state, API payloads, and components.
 */

/** Allow any destination entered by the user */
export type MVPDestination = string;

/** Budget style (simple, no technical language) */
export type BudgetStyle = "Budget" | "Comfortable";

/** Travel style (matches user mindset) */
export type TravelStyle = "Relaxed" | "Balanced" | "Adventure";

/** Single step in the main booking flow (CMO-approved) */
export type PageStep =
  | "landing"
  | "auth"
  | "onboarding"
  | "intent"
  | "discovery"
  | "justification"
  | "planning"
  | "budget"
  | "itinerary"
  | "booking"
  | "confirmation";

/** User profile and preferences collected during onboarding (Privacy-First) */
export interface UserProfile {
  name: string;
  email: string;
  traits: {
    pace: "Fast" | "Slow";
    focus: "Nature" | "Culture" | "Food" | "Thrills";
    planning: "Strict" | "Spontaneous";
  };
  creatorMode: "None" | "Journal" | "Photographer" | "Blogger";
}

/** Input for Confused User Mode */
export interface DiscoveryQuery {
  vibe: string;
}

/** Suggested destination from Discovery Mode */
export interface DiscoverySuggestion {
  destination: MVPDestination;
  reason: string;
  imageUrl: string;
}

/** Trip summary shown in UI after intent creation and in confirmation */
export interface TripData {
  tripId: string;
  destination: string;
  days: number;
  people: number;
  season: string;
  comfortLevel: string;
  tripType: string;
  budgetStyle?: BudgetStyle;
  travelStyle?: TravelStyle;
  predictedBudget?: {
    totalINR: number;
    currency: string;
  };
}

/** Budget breakdown (Stay, Travel, Food, Activities) for Budget First screen */
export interface BudgetBreakdown {
  stay: number;
  travel: number;
  food: number;
  activities: number;
  total: number;
  currency: string;
}

/** One day in the handbook: morning / afternoon / evening */
export interface DayPlan {
  day: number;
  morning: string;
  afternoon: string;
  evening: string;
}

/** Full handbook itinerary (hero moment) */
export interface HandbookItinerary {
  bestTimeToVisit: string;
  dayByDay: DayPlan[];
  sightseeing: string[];
  foodToTry: string[];
  whatToCarry: string[];
  dosAndDonts: { do: string[]; dont: string[] };
  safetyNotes: string[];
}

/** Budget prediction from ML/service */
export interface PredictedBudget {
  totalINR: number;
  currency?: string;
  perPersonINR?: number;
  perDayINR?: number;
}

/** Input to create a trip intent (step 1). Flat shape for API. */
export interface CreateIntentInput {
  destination: string;
  numDays: number;
  numPeople?: number;
  season?: string;
  comfortLevel?: string;
  tripType?: string;
  budgetStyle?: BudgetStyle;
  travelStyle?: TravelStyle;
  interests?: string[];
  budgetRange?: { min: number; max: number };
}

/** Nested shape used by the form; normalized to CreateIntentInput before API call */
export interface TripIntentFormData {
  destination: string;
  tripDuration: { days: number; people: number };
  preferences: {
    season: string;
    comfortLevel: string;
    tripType: string;
    interests?: string[];
  };
  budgetRange?: { min: number; max: number };
}

/** MVP: Simple intent form (4 fields only) */
export interface TripIntentFormDataMVP {
  destination: MVPDestination;
  days: number;
  budgetStyle: BudgetStyle;
  travelStyle: TravelStyle;
}

/** Response from createIntent / getBudget */
export interface TripIntentResponse {
  tripId: string;
  destination: string;
  numDays?: number;
  numPeople?: number;
  season?: string;
  comfortLevel?: string;
  tripType?: string;
  predictedBudget: PredictedBudget;
}
