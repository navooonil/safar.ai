/**
 * Itinerary candidate types (step 2: choose among 3 options).
 */

/** Single candidate option (inner payload from API) */
export interface CandidateOption {
  candidate_id: number;
  daily_activity_hours: number;
  rest_days: number;
  sightseeing_density: number;
  estimated_budget: number;
  travel_fatigue_score: number;
}

/** Scoring breakdown for explainability */
export interface ScoringBreakdown {
  safety_compliance: number;
  fatigue_penalty: number;
  budget_deviation: number;
  budget_penalty: number;
  activity_balance_bonus: number;
  rest_day_bonus: number;
}

/** One itinerary candidate with score and breakdown */
export interface ItineraryCandidate {
  candidate: CandidateOption;
  itinerary_score: number;
  scoring_breakdown: ScoringBreakdown;
}
