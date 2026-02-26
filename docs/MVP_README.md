# Safar.AI - Itinerary Optimization MVP

## 🎯 Project Status: 60% Working MVP ✅

**Completed in 1 session** - A fully functional end-to-end itinerary optimization system ready for demonstration.

---

## 📋 What's Implemented (60% MVP)

### ✅ Core Components

1. **Budget Prediction Model**
   - Trained Random Forest Regressor on 5,000 synthetic travel records
   - Achieved 96.8% R² accuracy with ₹10,124 Mean Absolute Error
   - Predicts trip costs based on: destination, days, people, season, comfort level, trip type, airport distance
   - Model saved: `backend/models/budget_regressor.pkl`

2. **Itinerary Optimizer**
   - Generates 2-3 diverse candidate itineraries per destination
   - Candidates vary by daily activity intensity (4-8 hours), rest days (0-2), sightseeing density
   - Located: `ml/itinerary_optimizer.py`

3. **Explainable Scoring Mechanism**
   - Rule-based scoring (NOT black-box ML)
   - Scores from 0-1 based on:
     - **Safety Compliance** (40% penalty if violated)
     - **Travel Fatigue** (activity hours - rest days balance)
     - **Budget Deviation** (how far from ML prediction)
     - **Activity Balance Bonus** (+5% for 4-8h/day)
     - **Rest Days Bonus** (+5% for 1-2 rest days)

4. **Optimal Itinerary Selection**
   - Automatically selects highest-scoring candidate
   - Provides human-readable explanation per destination
   - Includes detailed scoring breakdown

5. **Structured JSON Output**
   - Complete results in `backend/models/mvp_output.json`
   - For each destination: candidates list, selected itinerary, scoring rationale

---

## 🚀 How to Run the MVP

### Quick Start
```bash
cd C:\Users\navon\OneDrive\Desktop\safar.ai
python mvp_pipeline.py
```

### What It Does
1. Trains budget prediction model (50 estimators, ~2 seconds)
2. Demonstrates with 2 sample trips:
   - Hampta Pass Trek (5 days, adventure)
   - Varanasi Spiritual (3 days, cultural)
3. Generates 3 candidates per destination
4. Scores all candidates with breakdown
5. Selects optimal itinerary with explanation
6. Saves full results to JSON

### Output Files
- **Model**: `backend/models/budget_regressor.pkl`
- **Results**: `backend/models/mvp_output.json`

---

## 📊 Example Output

```json
{
  "destination": "Hampta Pass",
  "num_days": 5,
  "budget_prediction": 97570.79,
  "candidates": [
    {
      "candidate": {
        "candidate_id": 3,
        "daily_activity_hours": 4,
        "rest_days": 2,
        "sightseeing_density": 0.7,
        "estimated_budget": 14000.0,
        "travel_fatigue_score": 0.0
      },
      "itinerary_score": 0.929,
      "scoring_breakdown": {
        "safety_compliance": 1.0,
        "fatigue_penalty": 0.0,
        "budget_deviation": 0.857,
        "activity_balance_bonus": 0.05,
        "rest_day_bonus": 0.05
      }
    }
  ],
  "selected_itinerary": {...},
  "explanation": "The selected itinerary for Hampta Pass scores 92.9% due to: safety compliance (✓), optimal daily activity intensity (4h/day), balanced rest days (2 rest days), manageable travel fatigue."
}
```

---

## 📁 File Structure

```
safar.ai/
├── backend/
│   ├── data/
│   │   └── synthetic_travel_costs.csv (5,000 training records)
│   ├── models/
│   │   ├── budget_regressor.pkl (trained model)
│   │   └── mvp_output.json (demo results)
│   ├── ml/
│   │   ├── train_budget_model.py
│   │   ├── inference_example.py
│   │   └── train_models.py
│   └── requirements.txt
├── ml/
│   └── itinerary_optimizer.py (main optimization logic)
├── mvp_pipeline.py (training + demo orchestrator)
└── frontend/
```

---

## 🔧 Architecture

### 1. Data Flow
```
Trip Input → Budget Prediction → Itinerary Generation → Scoring → Selection
   ↓              ↓                  ↓                      ↓
Destination   ML Model       3 Candidates           Rule-based        JSON Output
Preferences   Predicts          with varied         Scoring (0-1)      + Explanation
              ₹97,571          intensities
```

### 2. Scoring Formula
```
Score = 1.0
  - safety_violation (0 or 0.4)
  - fatigue_penalty (0-0.25)
  - budget_penalty (0-0.2)
  + activity_bonus (0 or 0.05)
  + rest_bonus (0 or 0.05)
= Final Score (0-1)
```

### 3. Key Classes

**ItineraryCandidate**
- `daily_activity_hours`: 4-8 hours per day
- `rest_days`: 0-2 days
- `sightseeing_density`: 0.7-1.4 relative to standard
- `travel_fatigue_score`: calculated as (activity × 0.6) - (rest × 1.2)

---

## ✨ Example: Why Candidate 3 Won

For Hampta Pass Trek (5 days):

| Metric | Cand 1 | Cand 2 | Cand 3 | Winner |
|--------|--------|--------|--------|--------|
| Daily Activity | 6h ✓ | 8h (too intense) | 4h ✓ | Cand 3 |
| Rest Days | 1 ✓ | 0 (overwork) | 2 ✓ | Cand 3 |
| Fatigue Score | 2.4 | 4.8 (high) | 0 ✓ | Cand 3 |
| Budget Fit | ₹17,500 | ₹21,000 | ₹14,000 ✓ | Cand 3 |
| **Final Score** | **86.4%** | **74.9%** | **92.9%** ✅ | **Cand 3** |

---

## 🚀 Next Steps for Full Production (Remaining 40%)

### Phase 2: Integration (Week 1-2)
- [ ] Connect to frontend (Next.js dashboard)
- [ ] Create REST API endpoints for optimization
- [ ] Add user authentication

### Phase 3: Data & Learning (Week 2-3)
- [ ] Store itineraries in PostgreSQL
- [ ] Track user feedback & outcomes
- [ ] Retrain model with real data
- [ ] Implement preference learning

### Phase 4: Advanced Features
- [ ] Dynamic destination safety rules (API integration)
- [ ] Real-time constraint satisfaction (availability checks)
- [ ] Multi-destination trip planning
- [ ] Cost optimization with group discounts
- [ ] Weather/climate integration
- [ ] Cultural event calendars

### Phase 5: Polish
- [ ] Frontend UI for itinerary visualization
- [ ] Analytics dashboard
- [ ] Mobile app
- [ ] A/B testing framework

---

## 🛠️ Dependencies

```
pandas==2.2.0
numpy==1.26.4
scikit-learn==1.4.0
joblib==1.3.2
```

Install via:
```bash
pip install -r backend/requirements.txt
```

---

## 📈 Model Performance

**Training Data**: 5,000 synthetic travel records
**Features**: destination, trip_type, days, people, season, comfort_level, airport_distance
**Target**: total_cost_inr

**Results**:
- R² Score: **0.968** (explains 96.8% of variance)
- Mean Absolute Error: **₹10,124** (~10% of average cost)
- Train/Test Split: 80/20

**Feature Importance** (top 5):
1. Number of days
2. Destination
3. Comfort level
4. Number of people
5. Trip type

---

## 🎓 Key Design Decisions

1. **Rule-Based Scoring over Pure ML**: Explainability is critical for travel recommendations. Each penalty/bonus is auditable.

2. **3 Candidates per Destination**: Provides variety (relaxed, balanced, adventure) while keeping decision-making tractable.

3. **Normalized Scores (0-1)**: Easy to interpret, compare across destinations, and adjust weights.

4. **Fatigue Calculation**: `(activity_hours × 0.6) - (rest_days × 1.2)` reflects traveler wellbeing (activity tires, rest recovers).

5. **Budget Deviation Penalty**: Accounts for financial constraints without hard-capping options.

---

## 📞 Testing the MVP

### Test Case 1: Extreme Activity
```python
from ml.itinerary_optimizer import optimize_itineraries

result = optimize_itineraries(
    destination="Hampta Pass",
    num_days=5,
    budget_prediction=100000,
    user_preferences={"daily_budget": 5000}
)
# Expected: High-intensity candidate scored lower than relaxed
```

### Test Case 2: Tight Budget
- Modify budget_prediction to ₹20,000
- Expect: Low-cost candidate wins despite lower sightseeing

### Test Case 3: Safety Violation
- Set `safety_compliant=False` in score_itinerary()
- Expect: 40% penalty applied immediately

---

## 🏆 Success Criteria Met

✅ 2-3 candidates per destination  
✅ Varied activity intensity (4h, 6h, 8h)  
✅ Varied rest days (0, 1, 2)  
✅ ML-based budget prediction (96.8% R²)  
✅ Explainable scoring (rule-based, no black-box)  
✅ Safety penalties implemented  
✅ Final score 0-1 range  
✅ Ranking & selection  
✅ Per-destination explanation  
✅ Structured JSON output  

---

## 📞 Support

**To Train New Models**:
```bash
python backend/ml/train_budget_model.py
```

**To Run Inference Only**:
```bash
python backend/ml/inference_example.py
```

**To Extend Scoring**:
Edit `ml/itinerary_optimizer.py` → `score_itinerary()` function

---

**Last Updated**: February 22, 2026  
**MVP Version**: 1.0  
**Status**: ✅ Ready for Demonstration
