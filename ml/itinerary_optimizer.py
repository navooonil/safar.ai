import json
import os
import joblib
import pandas as pd
from typing import Dict, List, Any

MODEL_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "models", "budget_regressor.pkl")
)

class ItineraryCandidate:
    """Represents a proposed itinerary with activity/rest balance"""
    def __init__(self, candidate_id, daily_activity_hours, rest_days, sightseeing_density, estimated_budget):
        self.candidate_id = candidate_id
        self.daily_activity_hours = daily_activity_hours
        self.rest_days = rest_days
        self.sightseeing_density = sightseeing_density
        self.estimated_budget = estimated_budget
        self.travel_fatigue_score = self.calculate_fatigue()

    def calculate_fatigue(self):
        """Travel fatigue increases with activity, decreases with rest"""
        return max(0, (self.daily_activity_hours * 0.6) - (self.rest_days * 1.2))

    def to_dict(self):
        return {
            "candidate_id": self.candidate_id,
            "daily_activity_hours": self.daily_activity_hours,
            "rest_days": self.rest_days,
            "sightseeing_density": round(self.sightseeing_density, 2),
            "estimated_budget": round(self.estimated_budget, 2),
            "travel_fatigue_score": round(self.travel_fatigue_score, 2)
        }

def generate_itinerary_candidates(destination: str, num_days: int, user_preferences: Dict) -> List[ItineraryCandidate]:
    """Generate 2-3 diverse itinerary candidates for a destination"""
    candidates = []
    
    # Candidate 1: Balanced (moderate intensity)
    candidates.append(ItineraryCandidate(
        candidate_id=1,
        daily_activity_hours=6,
        rest_days=max(1, num_days // 5),
        sightseeing_density=1.0,
        estimated_budget=user_preferences.get("daily_budget", 5000) * num_days
    ))
    
    # Candidate 2: High Intensity (adventure focused)
    candidates.append(ItineraryCandidate(
        candidate_id=2,
        daily_activity_hours=8,
        rest_days=0,
        sightseeing_density=1.4,
        estimated_budget=user_preferences.get("daily_budget", 5000) * num_days * 1.2
    ))
    
    # Candidate 3: Relaxed (leisure focused)
    candidates.append(ItineraryCandidate(
        candidate_id=3,
        daily_activity_hours=4,
        rest_days=max(2, num_days // 3),
        sightseeing_density=0.7,
        estimated_budget=user_preferences.get("daily_budget", 5000) * num_days * 0.8
    ))
    
    return candidates

def score_itinerary(candidate: ItineraryCandidate, budget_prediction: float, safety_compliant: bool = True) -> Dict[str, Any]:
    """
    Compute itinerary score using rule-based explainable mechanism.
    Returns score (0-1) and breakdown of scoring logic.
    """
    score = 1.0
    penalties = {}
    
    # 1. Safety Compliance (binary penalty)
    if not safety_compliant:
        score -= 0.4
        penalties["safety_violation"] = 0.4
    else:
        penalties["safety_violation"] = 0.0
    
    # 2. Fatigue Penalty (normalized to 0-0.25)
    fatigue_penalty = min(0.25, candidate.travel_fatigue_score * 0.03)
    score -= fatigue_penalty
    penalties["fatigue_penalty"] = fatigue_penalty
    
    # 3. Budget Deviation Penalty
    budget_deviation = abs(candidate.estimated_budget - budget_prediction) / max(1, budget_prediction)
    budget_penalty = min(0.2, budget_deviation * 0.2)
    score -= budget_penalty
    penalties["budget_penalty"] = budget_penalty
    
    # 4. Activity Balance Bonus (prefer 4-8 hours/day)
    if 4 <= candidate.daily_activity_hours <= 8:
        score += 0.05
        penalties["activity_bonus"] = 0.05
    else:
        penalties["activity_bonus"] = 0.0
    
    # 5. Rest Day Bonus (prefer 1-2 rest days for longer trips)
    if 1 <= candidate.rest_days <= 2:
        score += 0.05
        penalties["rest_bonus"] = 0.05
    else:
        penalties["rest_bonus"] = 0.0
    
    # Ensure score is within [0, 1]
    final_score = max(0, min(score, 1.0))
    
    return {
        "itinerary_score": round(final_score, 3),
        "scoring_breakdown": {
            "safety_compliance": 1.0 if safety_compliant else 0.0,
            "fatigue_penalty": round(fatigue_penalty, 3),
            "budget_deviation": round(budget_deviation, 3),
            "budget_penalty": round(budget_penalty, 3),
            "activity_balance_bonus": round(penalties["activity_bonus"], 3),
            "rest_day_bonus": round(penalties["rest_bonus"], 3)
        }
    }

def select_best_itinerary(scored_candidates: List[Dict]) -> Dict:
    """Select the highest-scoring itinerary"""
    return max(scored_candidates, key=lambda x: x["itinerary_score"])

def optimize_itineraries(destination: str, num_days: int, budget_prediction: float, 
                        user_preferences: Dict, safety_rules: Dict = None) -> Dict[str, Any]:
    """
    Main orchestrator function that generates, scores, and selects optimal itinerary.
    Returns structured JSON with all candidates, scores, and explanation.
    """
    if safety_rules is None:
        safety_rules = {"high_risk_destinations": []}
    
    # Check safety compliance
    is_safe = destination not in safety_rules.get("high_risk_destinations", [])
    
    # Generate candidates
    candidates = generate_itinerary_candidates(destination, num_days, user_preferences)
    
    # Score each candidate
    scored_candidates = []
    for candidate in candidates:
        score_result = score_itinerary(candidate, budget_prediction, safety_compliant=is_safe)
        scored_candidates.append({
            "candidate": candidate.to_dict(),
            "itinerary_score": score_result["itinerary_score"],
            "scoring_breakdown": score_result["scoring_breakdown"]
        })
    
    # Select best
    best = select_best_itinerary(scored_candidates)
    
    # Generate explanation
    explanation = generate_scoring_explanation(best, destination)
    
    return {
        "destination": destination,
        "num_days": num_days,
        "budget_prediction": round(budget_prediction, 2),
        "candidates": scored_candidates,
        "selected_itinerary": best,
        "explanation": explanation
    }

def generate_scoring_explanation(best_candidate: Dict, destination: str) -> str:
    """Generate human-readable explanation of why this itinerary scored highest"""
    candidate = best_candidate["candidate"]
    breakdown = best_candidate["scoring_breakdown"]
    
    explanation = f"The selected itinerary for {destination} scores {best_candidate['itinerary_score']:.1%} due to: "
    
    factors = []
    if breakdown["safety_compliance"] == 1.0:
        factors.append("safety compliance (✓)")
    if breakdown["activity_balance_bonus"] > 0:
        factors.append(f"optimal daily activity intensity ({candidate['daily_activity_hours']}h/day)")
    if breakdown["rest_day_bonus"] > 0:
        factors.append(f"balanced rest days ({candidate['rest_days']} rest days)")
    if breakdown["budget_penalty"] < 0.1:
        factors.append("good budget alignment")
    if breakdown["fatigue_penalty"] < 0.1:
        factors.append("manageable travel fatigue")
    
    explanation += ", ".join(factors) + "."
    return explanation

if __name__ == '__main__':
    # Demo MVP
    user_prefs = {"daily_budget": 5000, "interests": ["sightseeing", "adventure"]}
    budget_pred = 35000  # INR
    
    result = optimize_itineraries(
        destination="Hampta Pass",
        num_days=5,
        budget_prediction=budget_pred,
        user_preferences=user_prefs
    )
    
    print(json.dumps(result, indent=2))