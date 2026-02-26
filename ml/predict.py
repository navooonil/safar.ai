import sys
import json
import os
import joblib
import pandas as pd

BASE_DIR = os.path.dirname(__file__)
MODELS_DIR = os.path.join(BASE_DIR, "models")

def predict_destination(payload):
    model_path = os.path.join(MODELS_DIR, "destination_recommender.pkl")
    if not os.path.exists(model_path):
        return {"error": "Model not found"}
        
    model = joblib.load(model_path)
    
    # Needs: budget, days, season, pace, focus
    input_data = pd.DataFrame([{
        "budget": float(payload.get("budget", 20000)),
        "days": int(payload.get("numDays", 4)),
        "season": payload.get("season", "Winter"),
        "pace": payload.get("pace", "Slow"),
        "focus": payload.get("focus", "Nature")
    }])
    
    # Get top 3 probabilities
    probs = model.predict_proba(input_data)[0]
    classes = model.classes_
    
    top_indices = probs.argsort()[-3:][::-1]
    results = []
    
    kg_path = os.path.join(BASE_DIR, "clean_data", "destinations_knowledge_graph.csv")
    df_dest = pd.read_csv(kg_path) if os.path.exists(kg_path) else None
    
    for idx in top_indices:
        dest = classes[idx]
        prob = probs[idx]
        reason = f"Matches your {payload.get('pace', 'Slow').lower()} pace and preference for {payload.get('focus', 'Nature').lower()}."
        
        if df_dest is not None:
            dest_info = df_dest[df_dest["Destination"] == dest]
            if not dest_info.empty:
                cat = dest_info.iloc[0]["Category"]
                rating = dest_info.iloc[0]["Rating"]
                reason = f"Ranked {rating} stars for {cat}. Perfect for your ₹{payload.get('budget', 20000):,.0f} budget and {input_data['days'][0]}-day timeline."
                
        results.append({
            "destination": dest,
            "confidence": float(prob),
            "reason": reason
        })
        
    return {"recommendations": results}

def predict_budget(payload):
    model_path = os.path.join(MODELS_DIR, "budget_regressor.pkl")
    if not os.path.exists(model_path):
        return {"error": "Model not found"}
        
    model = joblib.load(model_path)
    
    input_data = pd.DataFrame([{
        "destination": payload.get("destination", "Hampta Pass"),
        "number_of_days": int(payload.get("numDays", 4)),
        "number_of_people": int(payload.get("numPeople", 1)),
        "season": payload.get("season", "Winter"),
        "comfort_level": payload.get("comfortLevel", "Standard"),
        "trip_type": payload.get("tripType", "Adventure"),
        "airport_dist_km": float(payload.get("airportDist", 50.0))
    }])
    
    pred = model.predict(input_data)[0]
    return {"predicted_budget": float(pred)}

def main():
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Missing arguments"}))
        return
        
    action = sys.argv[1]
    try:
        payload = json.loads(sys.argv[2])
    except:
        print(json.dumps({"error": "Invalid JSON"}))
        return
        
    if action == "recommend_destination":
        res = predict_destination(payload)
    elif action == "predict_budget":
        res = predict_budget(payload)
    else:
        res = {"error": "Unknown action"}
        
    print(json.dumps(res))

if __name__ == "__main__":
    main()
