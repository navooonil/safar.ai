# Data Persistence & Mock Booking Flow Documentation

## Overview

This document describes the complete data persistence layer and mock booking flow for the Safar.AI MVP. The system manages 6 core entities across a structured storage hierarchy, with a mock booking process that simulates production-ready payment flows.

---

## Part A: Data Persistence Architecture

### Storage Directory Structure

```
backend/storage/
├── intents/              # UserTripIntent records
├── budgets/              # BudgetPredictionOutput records
├── research/             # AgentResearchOutput records
├── itineraries/          # ItineraryCandidates & FinalItinerary records
└── bookings/             # MockBookingRecord & BookingConfirmation records
```

### Primary Key Strategy

**All entities use `tripId` as the primary key:**
- Format: `TRIP_{12-digit-hex}` (e.g., `TRIP_F2317E495669`)
- Uniqueness: Generated via `uuid.uuid4().hex[:12].upper()`
- Benefit: Enables cross-entity linking and audit trails

---

## Entity Specifications

### 1. UserTripIntent

**Purpose:** Captures user's initial travel request before optimization

**Required Fields:**
```json
{
  "tripId": "TRIP_F2317E495669",
  "destination": "Varanasi",
  "tripDuration": {
    "days": 3,
    "people": 2
  },
  "preferences": {
    "season": "Winter",
    "comfortLevel": "Luxury",
    "tripType": "Spiritual",
    "interests": ["culture", "spirituality", "food"]
  },
  "budgetRange": {
    "min": 30000,
    "max": 60000
  },
  "createdAt": "2026-02-22T18:43:05.943484",
  "version": "intent_v1",
  "source": "web_app"
}
```

**Versioning:** `intent_v1` - tracks schema evolution
**Storage Path:** `backend/storage/intents/{tripId}_intent.json`

---

### 2. BudgetPredictionOutput

**Purpose:** ML model budget prediction with input features and metrics

**Required Fields:**
```json
{
  "tripId": "TRIP_F2317E495669",
  "destination": "Varanasi",
  "inputFeatures": {
    "numDays": 3,
    "numPeople": 2,
    "season": "Winter",
    "comfortLevel": "Luxury",
    "tripType": "Spiritual",
    "airportDistanceKm": 25.0
  },
  "predictedBudget": {
    "totalINR": 36096,
    "perPersonINR": 18048.0,
    "perDayINR": 12032.0
  },
  "modelMetrics": {
    "r2_score": 0.97,
    "mae": 9426.84
  },
  "createdAt": "2026-02-22T18:43:05.943484",
  "version": "budget_ml_v1",
  "source": "random_forest_regressor"
}
```

**Key Metrics:**
- **R² Score:** Model explains 97% of budget variance
- **MAE:** Mean Absolute Error of ±₹9,426.84
- **Breakdown:** Total, per-person, per-day costs provided

**Storage Path:** `backend/storage/budgets/{tripId}_budget.json`

---

### 3. AgentResearchOutput

**Purpose:** Web research agent findings on destination

**Required Fields:**
```json
{
  "tripId": "TRIP_F2317E495669",
  "destination": "Varanasi",
  "research": {
    "bestSeason": "October-March",
    "safetyRating": "Safe - High tourism",
    "topAttractions": ["Kashi Vishwanath", "Ghats", "Sarnath"],
    "averageDailyBudget": {
      "budget": 2000,
      "standard": 4000,
      "luxury": 7000
    },
    "localTransport": "Local boats and taxis available",
    "cuisineRecommendations": ["Street food", "Traditional dishes", "Cafes"]
  },
  "createdAt": "2026-02-22T18:43:05.943484",
  "version": "agent_v1",
  "source": "web_research_agent"
}
```

**Data Sources:**
- Web scraping for attractions, transport, cuisine
- Safety ratings from travel databases
- Budget tiers (Budget/Standard/Luxury) for local comparison

**Storage Path:** `backend/storage/research/{tripId}_research.json`

---

### 4. ItineraryCandidates

**Purpose:** All generated candidates with computed scores and breakdowns

**Required Fields:**
```json
{
  "tripId": "TRIP_F2317E495669",
  "destination": "Varanasi",
  "budgetPrediction": 36096,
  "candidates": [
    {
      "candidate": {
        "candidate_id": 1,
        "daily_activity_hours": 6,
        "rest_days": 1,
        "sightseeing_density": 1.0,
        "estimated_budget": 36000,
        "travel_fatigue_score": 2.4
      },
      "itinerary_score": 1.0,
      "scoring_breakdown": {
        "safety_compliance": 1.0,
        "fatigue_penalty": 0.072,
        "budget_deviation": 0.003,
        "budget_penalty": 0.001,
        "activity_balance_bonus": 0.05,
        "rest_day_bonus": 0.05
      }
    }
  ],
  "generatedAt": "2026-02-22T18:43:05.943484",
  "version": "optimizer_v1",
  "source": "itinerary_optimizer",
  "totalCandidates": 3,
  "scoringMethod": "rule_based_explainable"
}
```

**Scoring Components:**
1. **Safety Compliance** (binary): 1.0 if safe, 0.6 if unsafe
2. **Fatigue Penalty** (0-0.25): Based on activity vs rest balance
3. **Budget Deviation** (0-0.2): Deviation from predicted budget
4. **Activity Balance Bonus** (+0.05): For 4-8h daily activity
5. **Rest Day Bonus** (+0.05): For 1-2 rest days

**Storage Path:** `backend/storage/itineraries/{tripId}_candidates.json`

---

### 5. FinalItinerary

**Purpose:** Selected optimal candidate with locked budget

**Required Fields:**
```json
{
  "tripId": "TRIP_F2317E495669",
  "destination": "Varanasi",
  "itinerary": {
    "candidateId": 1,
    "dailyActivityHours": 6,
    "restDays": 1,
    "sightseeingDensity": 1.0,
    "estimatedBudget": 36000,
    "travelFatigueScore": 2.4
  },
  "scoring": {
    "finalScore": 1.0,
    "scorePercentage": 100.0,
    "breakdown": { ... }
  },
  "explanation": "The selected itinerary for Varanasi scores 100.0%...",
  "lockedBudget": 36096,
  "selectedAt": "2026-02-22T18:43:05.943484",
  "status": "READY_FOR_BOOKING",
  "version": "final_v1",
  "source": "optimizer_selection"
}
```

**Key Feature:** **Budget Lock**
- Once selected, the predicted budget is locked
- Cannot be changed until booking is confirmed
- Prevents scope creep and ensures price stability

**Storage Path:** `backend/storage/itineraries/{tripId}_final.json`

---

### 6. MockBookingRecord

**Purpose:** Complete booking transaction with payment simulation

**Required Fields:**
```json
{
  "tripId": "TRIP_F2317E495669",
  "bookingId": "BK_20260222_03859166",
  "destination": "Varanasi",
  "userContact": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91-9876543210"
  },
  "itineraryDetails": { ... },
  "lockedBudget": {
    "totalINR": 36096,
    "currency": "INR",
    "locked": true,
    "lockedAt": "2026-02-22T18:43:05.943484"
  },
  "paymentDetails": {
    "status": "MOCK_SUCCESS",
    "method": "MOCK_PAYMENT_GATEWAY",
    "transactionId": "TXN_1D69C27D535943F3",
    "amount": 36096,
    "currency": "INR",
    "timestamp": "2026-02-22T18:43:05.943484"
  },
  "bookingState": {
    "current": "CONFIRMED",
    "transitions": [
      {
        "from": "INITIATED",
        "to": "CONFIRMED",
        "timestamp": "2026-02-22T18:43:05.943484",
        "reason": "Payment processed successfully"
      }
    ]
  },
  "confirmationNumber": "CONF_20260222184305_14C7D0",
  "createdAt": "2026-02-22T18:43:05.943484",
  "validUntil": "2026-02-23T18:43:05.943484",
  "version": "booking_v1",
  "source": "mock_booking_engine",
  "disclaimer": "This is a mock booking for MVP demonstration..."
}
```

**Booking ID Format:** `BK_{YYYYMMDD}_{8-digit-hex}`
- Date component: Sortable by creation date
- Hex component: Unique within the day

**Storage Path:** `backend/storage/bookings/{tripId}_booking.json`

---

## Part B: Mock Booking Flow

### State Transition Diagram

```
INITIATED
    ↓ (Payment processed)
CONFIRMED
    ↓ (Optional: User cancels)
CANCELLED (not shown in this MVP flow)
```

### Booking Process Workflow

#### Step 1: Initiate Booking
```python
booking = persistence.create_booking_confirmation(
    trip_id="TRIP_F2317E495669",
    final_itinerary=final_itinerary,
    user_contact={
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+91-9876543210"
    }
)
```

#### Step 2: Generate Booking ID
- Format: `BK_20260222_03859166`
- Components:
  - Prefix: `BK_`
  - Date: `20260222` (YYYYMMDD for sorting)
  - Unique ID: `03859166` (8-digit hex)

#### Step 3: Lock Budget
```json
"lockedBudget": {
  "totalINR": 36096,
  "currency": "INR",
  "locked": true,
  "lockedAt": "2026-02-22T18:43:05.943484"
}
```

#### Step 4: Process Mock Payment
```json
"paymentDetails": {
  "status": "MOCK_SUCCESS",
  "method": "MOCK_PAYMENT_GATEWAY",
  "transactionId": "TXN_1D69C27D535943F3",
  "amount": 36096,
  "currency": "INR",
  "timestamp": "2026-02-22T18:43:05.943484"
}
```

**No Real Payment Processing:**
- No gateway integration (Stripe, PayPal, Razorpay)
- No external vendor APIs
- Transaction ID is generated, not validated
- Status hardcoded to `MOCK_SUCCESS`

#### Step 5: Update Booking State
```json
"bookingState": {
  "current": "CONFIRMED",
  "transitions": [
    {
      "from": "INITIATED",
      "to": "CONFIRMED",
      "timestamp": "2026-02-22T18:43:05.943484",
      "reason": "Payment processed successfully"
    }
  ]
}
```

#### Step 6: Generate Confirmation Number
- Format: `CONF_20260222184305_14C7D0`
- Components:
  - Prefix: `CONF_`
  - Timestamp: `20260222184305` (YYYYMMDDHHmmss)
  - Unique ID: `14C7D0` (6-digit hex)

#### Step 7: Set Validity Window
```json
"createdAt": "2026-02-22T18:43:05.943484",
"validUntil": "2026-02-23T18:43:05.943484"  // 24 hours
```

---

## BookingConfirmation (Frontend Display)

**Purpose:** Customer-facing confirmation summary (clean view, no internal details)

```json
{
  "confirmationNumber": "CONF_20260222184305_14C7D0",
  "tripId": "TRIP_F2317E495669",
  "bookingId": "BK_20260222_03859166",
  "destination": "Varanasi",
  "itinerary": {
    "dailyActivityHours": 6,
    "restDays": 1,
    "travelFatigueScore": 2.4
  },
  "pricing": {
    "lockedBudget": 36096,
    "currency": "INR",
    "perDay": 7219.2,
    "status": "LOCKED"
  },
  "payment": {
    "status": "MOCK_SUCCESS",
    "transactionId": "TXN_1D69C27D535943F3",
    "timestamp": "2026-02-22T18:43:05.943484"
  },
  "userContact": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91-9876543210"
  },
  "bookedAt": "2026-02-22T18:43:05.943484",
  "validUntil": "2026-02-23T18:43:05.943484",
  "status": "ACTIVE",
  "nextSteps": [
    "Check your email for detailed itinerary",
    "Review daily activity schedule",
    "Download mobile app for real-time updates",
    "Contact support 48h before departure"
  ]
}
```

**Key Differences from MockBookingRecord:**
- ✅ User-facing: Clean, readable format
- ✅ No internal payment details (gateway, transaction internals)
- ✅ No booking state transitions (admin only)
- ✅ Next steps for customer action
- ✅ Suitable for email, SMS, in-app display

---

## Implementation Details

### DataPersistence Class Methods

```python
class DataPersistence:
    # Entity Creators
    create_user_trip_intent()        → UserTripIntent
    create_budget_prediction()       → BudgetPredictionOutput
    create_agent_research_output()   → AgentResearchOutput
    create_itinerary_candidates()    → ItineraryCandidates
    create_final_itinerary()         → FinalItinerary
    create_booking_confirmation()    → MockBookingRecord + BookingConfirmation
    
    # Storage Operations
    save_entity()                    → Save single entity to JSON
    save_all_entities()              → Save all trip entities atomically
```

### Versioning Strategy

Each entity includes a `version` and `source` field:

| Entity | Version | Source |
|--------|---------|--------|
| UserTripIntent | `intent_v1` | `web_app` |
| BudgetPrediction | `budget_ml_v1` | `random_forest_regressor` |
| AgentResearch | `agent_v1` | `web_research_agent` |
| ItineraryCandidates | `optimizer_v1` | `itinerary_optimizer` |
| FinalItinerary | `final_v1` | `optimizer_selection` |
| Booking | `booking_v1` | `mock_booking_engine` |

**Benefit:** Schema evolution tracking; allows multiple versions in production

---

## Audit Trail & Compliance

### Timestamp Coverage

All entities have:
- `createdAt`: ISO 8601 format (e.g., `2026-02-22T18:43:05.943484`)
- State transition timestamps (booking only)
- Payment timestamp (booking only)

### Immutability

Once saved:
- ✅ Intent records are immutable (historical)
- ✅ Budget predictions are immutable (traceable)
- ✅ Itinerary selections are immutable (audit trail)
- ✅ Bookings are immutable (legal requirement)

Modifications require creating a new entity with incremented version.

---

## Production Readiness Checklist

### MVP Status (60%)
- ✅ Entity schemas designed (production-grade)
- ✅ Storage layer implemented (file-based, ready for DB)
- ✅ Mock booking flow implemented (realistic simulation)
- ✅ Versioning & audit trails included
- ✅ No real payment processing

### Production Upgrades Needed (40%)
- ⬜ Database backend (PostgreSQL recommended)
- ⬜ Real payment gateway integration (Razorpay/Stripe)
- ⬜ Vendor API integration (hotels, flights)
- ⬜ Email notifications (bookings, confirmations)
- ⬜ Real-time updates (WebSocket/Server-Sent Events)
- ⬜ User authentication & authorization
- ⬜ Compliance & PCI-DSS audit

---

## Testing & Demo

### Run Demo
```bash
python backend/persistence.py
```

### Expected Output
- ✅ 7 JSON files created in `backend/storage/`
- ✅ All entities linked via `tripId`
- ✅ Booking confirmation printed to console
- ✅ All timestamps auto-generated

### Verify Files
```bash
Get-ChildItem backend/storage -Recurse
```

Expected structure:
```
intents/           TRIP_F2317E495669_intent.json
budgets/           TRIP_F2317E495669_budget.json
research/          TRIP_F2317E495669_research.json
itineraries/       TRIP_F2317E495669_candidates.json
                   TRIP_F2317E495669_final.json
bookings/          TRIP_F2317E495669_booking.json
                   TRIP_F2317E495669_confirmation.json
```

---

## Code Example: Full Flow

```python
from backend.persistence import DataPersistence
from backend.ml.itinerary_optimizer import optimize_itineraries

# Initialize
persistence = DataPersistence()

# 1. Create intent
intent = persistence.create_user_trip_intent(
    destination="Varanasi",
    num_days=3,
    num_people=2,
    season="Winter",
    comfort_level="Luxury",
    trip_type="Spiritual",
    interests=["culture", "spirituality", "food"],
    budget_range={"min": 30000, "max": 60000}
)
trip_id = intent["tripId"]

# 2. Create budget prediction
budget = persistence.create_budget_prediction(
    trip_id=trip_id,
    destination="Varanasi",
    num_days=3,
    num_people=2,
    season="Winter",
    comfort_level="Luxury",
    trip_type="Spiritual",
    airport_distance_km=25.0,
    predicted_cost=36096,
    model_metrics={"r2_score": 0.970, "mae": 9426.84}
)

# 3. Create research
research = persistence.create_agent_research_output(
    trip_id=trip_id,
    destination="Varanasi",
    research_data={...}
)

# 4. Generate candidates
itinerary_data = optimize_itineraries(
    destination="Varanasi",
    num_days=3,
    budget_prediction=36096,
    user_preferences={"daily_budget": 12000}
)

candidates = persistence.create_itinerary_candidates(
    trip_id=trip_id,
    destination="Varanasi",
    budget_prediction=36096,
    candidates_data=itinerary_data["candidates"]
)

# 5. Create final itinerary
final = persistence.create_final_itinerary(
    trip_id=trip_id,
    destination="Varanasi",
    selected_candidate=itinerary_data["selected_itinerary"],
    explanation=itinerary_data["explanation"],
    budget_prediction=36096
)

# 6. Create booking
booking = persistence.create_booking_confirmation(
    trip_id=trip_id,
    final_itinerary=final,
    user_contact={
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+91-9876543210"
    }
)

# 7. Save all to storage
entities = {
    "intent": (intent, "intents"),
    "budget": (budget, "budgets"),
    "research": (research, "research"),
    "candidates": (candidates, "itineraries"),
    "final": (final, "itineraries"),
    "booking": (booking, "bookings")
}

saved_files = persistence.save_all_entities(trip_id, entities)
print(booking["bookingConfirmation"])  # Display confirmation
```

---

## Summary

| Component | Status | Notes |
|-----------|--------|-------|
| **Part A: Data Persistence** | ✅ Complete | 6 entities, tripId primary key, versioned |
| **Part B: Mock Booking** | ✅ Complete | State transitions, locked budget, mock payment |
| **Storage Layer** | ✅ Implemented | File-based (ready for DB migration) |
| **Audit Trail** | ✅ Included | Timestamps, versions, transitions |
| **Production Ready** | ⚠️ MVP | Needs DB backend + real payment gateway |

