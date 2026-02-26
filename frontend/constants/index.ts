/**
 * Application constants.
 * Keeps magic strings and config in one place.
 * CMO: Calm, confident, no AI buzzwords.
 */

import type { MVPDestination, BudgetStyle, TravelStyle } from "@/types/trip";

/** MVP: Only these 3 destinations. Depth > breadth. */
export const MVP_DESTINATIONS: { value: MVPDestination; label: string; tagline: string }[] = [
  { value: "Varanasi", label: "Varanasi", tagline: "Spiritual & cultural city" },
  { value: "Sikkim", label: "Sikkim", tagline: "Mountain & nature leisure" },
  { value: "Hampta Pass", label: "Hampta Pass", tagline: "High-altitude trek" },
];

/** Budget style options (simple language) */
export const BUDGET_STYLES: { value: BudgetStyle; label: string }[] = [
  { value: "Budget", label: "Budget" },
  { value: "Comfortable", label: "Comfortable" },
];

/** Travel style options */
export const TRAVEL_STYLES: { value: TravelStyle; label: string }[] = [
  { value: "Relaxed", label: "Relaxed" },
  { value: "Balanced", label: "Balanced" },
  { value: "Adventure", label: "Adventure" },
];

/** Trust-building messages shown during "We Are Planning Your Trip" */
export const PLANNING_MESSAGES = [
  "Checking best season for your dates",
  "Estimating a realistic budget",
  "Consulting local travel knowledge",
  "Balancing safety and experience",
] as const;

/** Step labels for the progress indicator */
export const STEP_LABELS: Record<string, string> = {
  intent: "Your trip",
  planning: "Planning",
  budget: "Budget",
  itinerary: "Itinerary",
  booking: "Confirm",
  confirmation: "Done",
} as const;

/** Default currency code */
export const DEFAULT_CURRENCY = "INR" as const;

/** Currency symbol for display */
export const CURRENCY_SYMBOL = "₹";

/** Booking status values */
export const BOOKING_STATUS = {
  CONFIRMED: "CONFIRMED",
  ACTIVE: "ACTIVE",
  PENDING: "PENDING",
} as const;

/** Payment status (mock) */
export const PAYMENT_STATUS = {
  MOCK_SUCCESS: "MOCK_SUCCESS",
  PENDING: "PENDING",
} as const;

/** Default next steps shown on confirmation (reassuring, human) */
export const DEFAULT_NEXT_STEPS = [
  "Save this confirmation for your records",
  "Review your day-by-day plan before you go",
  "Reach out to us if your plans change",
  "Travel safe and enjoy your trip",
] as const;

/** MVP disclaimer: we only support 3 destinations */
export const MVP_SCOPE_COPY =
  "We currently plan trips to three destinations only: Varanasi, Sikkim, and Hampta Pass. Built for clarity and accuracy.";
