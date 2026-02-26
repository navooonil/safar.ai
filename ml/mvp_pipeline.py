"""
MVP Pipeline: Train budget model + Demonstrate Itinerary Optimizer
This creates a fully working 60% MVP in one script.
"""

import os
import sys
import json
import subprocess
import pandas as pd
import numpy as np
import joblib

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from itinerary_optimizer import optimize_itineraries

DATA_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../data/synthetic_travel_costs.csv"))
MODEL_OUTPUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../models"))
MODEL_PATH = os.path.join(MODEL_OUTPUT_DIR, "budget_regressor.pkl")

def train_budget_model_mvp():
    """Train budget prediction model (MVP version - fast, simple)"""
    print("\n" + "="*60)
    print("🚀 TRAINING BUDGET PREDICTION MODEL (MVP)")
    print("="*60)
    
    # Import here to avoid issues
    from sklearn.model_selection import train_test_split
    from sklearn.ensemble import RandomForestRegressor
    from sklearn.preprocessing import OneHotEncoder
    from sklearn.compose import ColumnTransformer
    from sklearn.pipeline import Pipeline
    from sklearn.metrics import mean_absolute_error, r2_score
    
    if not os.path.exists(DATA_PATH):
        print(f"❌ Error: Training data not found at {DATA_PATH}")
        return False
    
    print("📊 Loading synthetic travel cost data...")
    df = pd.read_csv(DATA_PATH)
    print(f"   ✓ Loaded {len(df)} records")
    
    # Prepare features and target
    X = df.drop(columns=["total_cost_inr"])
    y = df["total_cost_inr"]
    
    categorical_features = ["destination", "trip_type", "season", "comfort_level"]
    numerical_features = ["number_of_days", "number_of_people", "airport_dist_km"]
    
    # Create preprocessing pipeline
    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ],
        remainder='passthrough'
    )
    
    # Build full pipeline
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', RandomForestRegressor(n_estimators=50, random_state=42, max_depth=8, n_jobs=-1))
    ])
    
    print("✂️  Splitting data (80/20 train/test)...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("🤖 Training Random Forest Regressor...")
    pipeline.fit(X_train, y_train)
    
    # Evaluate
    y_pred = pipeline.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    print(f"\n✅ Model Training Complete!")
    print(f"   📉 Mean Absolute Error: ₹{mae:,.0f}")
    print(f"   🎯 R² Score: {r2:.3f}")
    
    # Save model
    os.makedirs(MODEL_OUTPUT_DIR, exist_ok=True)
    joblib.dump(pipeline, MODEL_PATH)
    print(f"   💾 Model saved to {MODEL_PATH}")
    
    return True

def predict_budget(destination, num_days, num_people, season, comfort_level, trip_type, airport_dist_km):
    """Use trained model to predict trip cost"""
    model = joblib.load(MODEL_PATH)
    
    input_data = pd.DataFrame([{
        "destination": destination,
        "number_of_days": num_days,
        "number_of_people": num_people,
        "season": season,
        "comfort_level": comfort_level,
        "trip_type": trip_type,
        "airport_dist_km": airport_dist_km,
    }])
    
    predicted_cost = model.predict(input_data)[0]
    return round(predicted_cost, 2)

def run_mvp_demo():
    """Run MVP demo showing full pipeline: budget prediction + itinerary optimization"""
    print("\n" + "="*60)
    print("🎯 MVP DEMO: ITINERARY OPTIMIZATION")
    print("="*60)
    
    # Sample trips for MVP demo
    trips = [
        {
            "destination": "Hampta Pass",
            "num_days": 5,
            "num_people": 4,
            "season": "Summer",
            "comfort_level": "Standard",
            "trip_type": "Trek",
            "airport_dist_km": 50.0,
            "user_preferences": {
                "daily_budget": 3500,
                "interests": ["adventure", "nature"]
            }
        },
        {
            "destination": "Varanasi",
            "num_days": 3,
            "num_people": 2,
            "season": "Winter",
            "comfort_level": "Luxury",
            "trip_type": "Spiritual",
            "airport_dist_km": 25.0,
            "user_preferences": {
                "daily_budget": 7000,
                "interests": ["cultural", "relaxation"]
            }
        }
    ]
    
    all_results = []
    
    for trip in trips:
        print(f"\n🗺️  TRIP: {trip['destination']} ({trip['num_days']} days)")
        print("-" * 60)
        
        # Step 1: Predict budget
        predicted_budget = predict_budget(
            destination=trip["destination"],
            num_days=trip["num_days"],
            num_people=trip["num_people"],
            season=trip["season"],
            comfort_level=trip["comfort_level"],
            trip_type=trip["trip_type"],
            airport_dist_km=trip["airport_dist_km"]
        )
        print(f"   💰 ML Predicted Budget: ₹{predicted_budget:,.0f}")
        
        # Step 2: Optimize itinerary
        result = optimize_itineraries(
            destination=trip["destination"],
            num_days=trip["num_days"],
            budget_prediction=predicted_budget,
            user_preferences=trip["user_preferences"]
        )
        
        # Pretty print candidates
        print(f"\n   📋 Generated {len(result['candidates'])} itinerary candidates:")
        for candidate in result["candidates"]:
            c = candidate["candidate"]
            score = candidate["itinerary_score"]
            print(f"      • Candidate {c['candidate_id']}: {score:.1%} | "
                  f"{c['daily_activity_hours']}h activity, {c['rest_days']} rest, "
                  f"₹{c['estimated_budget']:,.0f}")
        
        # Print selected
        best = result["selected_itinerary"]
        print(f"\n   ⭐ OPTIMAL ITINERARY: Candidate {best['candidate']['candidate_id']}")
        print(f"      Score: {best['itinerary_score']:.1%}")
        print(f"      Daily Activity: {best['candidate']['daily_activity_hours']}h")
        print(f"      Rest Days: {best['candidate']['rest_days']}")
        print(f"      Estimated Budget: ₹{best['candidate']['estimated_budget']:,.0f}")
        print(f"      Rationale: {result['explanation']}")
        
        all_results.append(result)
    
    return all_results

def save_mvp_output(results):
    """Save MVP output to JSON file"""
    output_path = os.path.join(MODEL_OUTPUT_DIR, "mvp_output.json")
    
    with open(output_path, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n✅ MVP output saved to {output_path}")
    return output_path

def main():
    print("\n" + "="*60)
    print("SAFAR.AI - ITINERARY OPTIMIZATION MVP PIPELINE")
    print("="*60)
    
    # Step 1: Train model
    success = train_budget_model_mvp()
    if not success:
        print("❌ Failed to train model")
        return
    
    # Step 2: Run MVP demo
    results = run_mvp_demo()
    
    # Step 3: Save outputs
    save_mvp_output(results)
    
    print("\n" + "="*60)
    print("✨ MVP PIPELINE COMPLETE")
    print("="*60)
    print("\n📁 Outputs:")
    print(f"   • Trained Model: {MODEL_PATH}")
    print(f"   • Demo Results: {os.path.join(MODEL_OUTPUT_DIR, 'mvp_output.json')}")
    print("\n🎯 What Works (60% MVP):")
    print("   ✓ Budget prediction using trained ML model")
    print("   ✓ Multi-candidate itinerary generation")
    print("   ✓ Explainable scoring mechanism")
    print("   ✓ Optimal itinerary selection with rationale")
    print("   ✓ Structured JSON output")
    print("\n🚀 Next Steps for Production (40%):")
    print("   → Integrate with frontend")
    print("   → Add database persistence")
    print("   → Real-time user preference learning")
    print("   → Dynamic destination safety rules")
    print("   → Advanced constraint satisfaction")

if __name__ == "__main__":
    main()
