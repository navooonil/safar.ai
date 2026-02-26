# API Schema & Endpoint Guide

## Overview

This guide defines the HTTP API contracts for the data persistence layer. These schemas are ready for integration with the Next.js frontend.

---

## REST Endpoints

### 1. Create Trip Intent

**POST** `/api/trips/intent`

**Request:**
```json
{
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
  }
}
```

**Response:** `201 Created`
```json
{
  "tripId": "TRIP_F2317E495669",
  "destination": "Varanasi",
  "tripDuration": { ... },
  "preferences": { ... },
  "budgetRange": { ... },
  "createdAt": "2026-02-22T18:43:05.943484",
  "version": "intent_v1",
  "source": "web_app"
}
```

---

### 2. Get Trip Budget Prediction

**GET** `/api/trips/{tripId}/budget`

**Response:** `200 OK`
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

---

### 3. Get Destination Research

**GET** `/api/trips/{tripId}/research`

**Response:** `200 OK`
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

---

### 4. Get Itinerary Candidates

**GET** `/api/trips/{tripId}/itineraries/candidates`

**Response:** `200 OK`
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

---

### 5. Get Final Itinerary (Selected)

**GET** `/api/trips/{tripId}/itineraries/final`

**Response:** `200 OK`
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

---

### 6. Create Booking

**POST** `/api/bookings`

**Request:**
```json
{
  "tripId": "TRIP_F2317E495669",
  "userContact": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91-9876543210"
  }
}
```

**Response:** `201 Created`
```json
{
  "bookingRecord": {
    "tripId": "TRIP_F2317E495669",
    "bookingId": "BK_20260222_03859166",
    "destination": "Varanasi",
    "userContact": { ... },
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
  },
  "bookingConfirmation": {
    "confirmationNumber": "CONF_20260222184305_14C7D0",
    "tripId": "TRIP_F2317E495669",
    "bookingId": "BK_20260222_03859166",
    "destination": "Varanasi",
    "itinerary": { ... },
    "pricing": { ... },
    "payment": { ... },
    "userContact": { ... },
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
}
```

---

### 7. Get Booking Confirmation

**GET** `/api/bookings/{bookingId}/confirmation`

**Response:** `200 OK`
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

---

### 8. List All Trips (Pagination)

**GET** `/api/trips?page=1&limit=10&sort=createdAt:desc`

**Response:** `200 OK`
```json
{
  "trips": [
    {
      "tripId": "TRIP_F2317E495669",
      "destination": "Varanasi",
      "status": "BOOKED",
      "createdAt": "2026-02-22T18:43:05.943484",
      "bookingId": "BK_20260222_03859166",
      "lockedBudget": 36096
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 4,
    "totalPages": 1
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "status": 400,
  "error": "ValidationError",
  "message": "Invalid budget range: min must be less than max",
  "timestamp": "2026-02-22T18:43:05.943484"
}
```

### 404 Not Found
```json
{
  "status": 404,
  "error": "NotFoundError",
  "message": "Trip TRIP_INVALID not found",
  "timestamp": "2026-02-22T18:43:05.943484"
}
```

### 500 Internal Server Error
```json
{
  "status": 500,
  "error": "InternalServerError",
  "message": "Failed to generate itinerary candidates",
  "timestamp": "2026-02-22T18:43:05.943484"
}
```

---

## Frontend Integration Example

### React Hook (Next.js)
```typescript
// hooks/useTrip.ts
import { useState, useCallback } from 'react';

interface CreateTripRequest {
  destination: string;
  tripDuration: { days: number; people: number };
  preferences: any;
  budgetRange: { min: number; max: number };
}

export const useTrip = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTripIntent = useCallback(
    async (data: CreateTripRequest) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/trips/intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create trip intent');
        return await response.json();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getTripBudget = useCallback(
    async (tripId: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/trips/${tripId}/budget`);
        if (!response.ok) throw new Error('Failed to fetch budget');
        return await response.json();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getItineraryCandidates = useCallback(
    async (tripId: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/trips/${tripId}/itineraries/candidates`
        );
        if (!response.ok) throw new Error('Failed to fetch candidates');
        return await response.json();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createBooking = useCallback(
    async (tripId: string, userContact: any) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tripId, userContact }),
        });
        if (!response.ok) throw new Error('Failed to create booking');
        return await response.json();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    createTripIntent,
    getTripBudget,
    getItineraryCandidates,
    createBooking,
  };
};
```

### Usage in Component
```typescript
// app/trip-flow.tsx
'use client';

import { useTrip } from '@/hooks/useTrip';

export default function TripFlow() {
  const { loading, error, createTripIntent, getTripBudget } = useTrip();

  const handleCreateTrip = async () => {
    try {
      const tripIntent = await createTripIntent({
        destination: 'Varanasi',
        tripDuration: { days: 3, people: 2 },
        preferences: {
          season: 'Winter',
          comfortLevel: 'Luxury',
          tripType: 'Spiritual',
          interests: ['culture', 'spirituality', 'food'],
        },
        budgetRange: { min: 30000, max: 60000 },
      });

      const budget = await getTripBudget(tripIntent.tripId);
      console.log('Budget:', budget.predictedBudget.totalINR);
    } catch (err) {
      console.error('Error:', error);
    }
  };

  return (
    <button onClick={handleCreateTrip} disabled={loading}>
      {loading ? 'Creating trip...' : 'Create Trip'}
    </button>
  );
}
```

---

## TypeScript Types

```typescript
// types/trip.ts

export interface TripIntent {
  tripId: string;
  destination: string;
  tripDuration: {
    days: number;
    people: number;
  };
  preferences: {
    season: string;
    comfortLevel: string;
    tripType: string;
    interests: string[];
  };
  budgetRange: {
    min: number;
    max: number;
  };
  createdAt: string;
  version: string;
  source: string;
}

export interface BudgetPrediction {
  tripId: string;
  destination: string;
  inputFeatures: {
    numDays: number;
    numPeople: number;
    season: string;
    comfortLevel: string;
    tripType: string;
    airportDistanceKm: number;
  };
  predictedBudget: {
    totalINR: number;
    perPersonINR: number;
    perDayINR: number;
  };
  modelMetrics: {
    r2_score: number;
    mae: number;
  };
  createdAt: string;
  version: string;
  source: string;
}

export interface BookingConfirmation {
  confirmationNumber: string;
  tripId: string;
  bookingId: string;
  destination: string;
  itinerary: {
    dailyActivityHours: number;
    restDays: number;
    travelFatigueScore: number;
  };
  pricing: {
    lockedBudget: number;
    currency: string;
    perDay: number;
    status: string;
  };
  payment: {
    status: string;
    transactionId: string;
    timestamp: string;
  };
  userContact: {
    name: string;
    email: string;
    phone: string;
  };
  bookedAt: string;
  validUntil: string;
  status: string;
  nextSteps: string[];
}
```

---

## Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| POST /api/trips/intent | 10 req/min | Per user |
| GET /api/trips/{tripId}/* | 100 req/min | Per user |
| POST /api/bookings | 5 req/min | Per user |

---

## Authentication

All endpoints require Bearer token in Authorization header:

```
Authorization: Bearer {JWT_TOKEN}
```

Token contains:
- `sub`: User ID
- `email`: User email
- `role`: User role (user, admin)
- `exp`: Expiration timestamp

---

## Webhooks (Future)

### Booking Confirmed
```
POST {webhook_url}/booking.confirmed
{
  "event": "booking.confirmed",
  "bookingId": "BK_20260222_03859166",
  "tripId": "TRIP_F2317E495669",
  "timestamp": "2026-02-22T18:43:05.943484"
}
```

### Trip Started
```
POST {webhook_url}/trip.started
{
  "event": "trip.started",
  "tripId": "TRIP_F2317E495669",
  "destination": "Varanasi",
  "timestamp": "2026-02-22T18:43:05.943484"
}
```

