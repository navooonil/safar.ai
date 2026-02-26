import os
import pandas as pd
import numpy as np

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "clean_data")

def clean_indian_places():
    """
    Cleans the 'Top Indian Places to Visit.csv' to build the baseline 
    Geographic Knowledge Graph (Destinations -> Regions -> Attributes).
    """
    path = os.path.join(DATA_DIR, "Top Indian Places to Visit.csv")
    if not os.path.exists(path):
        return
        
    df = pd.read_csv(path)
    
    # Clean basic columns
    df = df.rename(columns={
        "Name": "Destination",
        "Type": "Category",
        "time needed to visit in hrs": "HoursNeeded",
        "Google review rating": "Rating",
        "Entrance Fee in INR": "EntranceFee",
        "Airport with 50km Radius": "HasAirport",
        "Best Time to visit": "BestTime"
    })
    
    # Drop unnecessary columns
    keep_cols = ["Zone", "State", "City", "Destination", "Category", "HoursNeeded", 
                 "Rating", "EntranceFee", "HasAirport", "Significance", "BestTime"]
    df = df[[c for c in keep_cols if c in df.columns]]
    
    # Basic cleaning
    df["Category"] = df["Category"].fillna("Unknown").str.strip()
    df["Significance"] = df["Significance"].fillna("Unknown").str.strip()
    
    # We map categories to our MVP 'Focus' traits (Nature, Culture, Food, Thrills)
    # This acts as our heuristic bridge
    def map_focus(cat):
        cat = str(cat).lower()
        if any(x in cat for x in ["temple", "historical", "palace", "fort", "monument", "museum"]):
            return "Culture"
        if any(x in cat for x in ["hill", "lake", "waterfall", "beach", "national park", "wildlife", "nature"]):
            return "Nature"
        if any(x in cat for x in ["trek", "adventure", "amusement"]):
            return "Thrills"
        return "Culture" # Default fallback
        
    df["FocusTrait"] = df["Category"].apply(map_focus)
    
    # Save clean dataset
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    out_path = os.path.join(OUTPUT_DIR, "destinations_knowledge_graph.csv")
    df.to_csv(out_path, index=False)
    print(f"✅ Saved cleaned knowledge graph to {out_path} ({len(df)} records)")

def extract_budget_baselines():
    """
    Cleans 'Travel details dataset.csv' to extract realistic budget multipliers
    """
    path = os.path.join(DATA_DIR, "Travel details dataset.csv")
    if not os.path.exists(path):
        return
        
    df = pd.read_csv(path)
    
    def clean_cost(val):
        if pd.isna(val): return 0
        val = str(val).replace(',', '').replace('$', '').replace(' USD', '').strip()
        try:
            return float(val)
        except:
            return 0
            
    df["Accommodation cost"] = df["Accommodation cost"].apply(clean_cost)
    df["Transportation cost"] = df["Transportation cost"].apply(clean_cost)
    df["Duration (days)"] = df["Duration (days)"].fillna(1)
    
    # Calculate daily cost in USD
    df["DailyAccommodationUSD"] = df["Accommodation cost"] / df["Duration (days)"]
    
    # Convert arbitrary USD costs to INR equivalences for our model baseline
    # Assume 1 USD = 83 INR
    df["DailyAccommodationINR"] = df["DailyAccommodationUSD"] * 83
    
    # Group by Accommodation Type to get 'Comfort Level' baselines
    baselines = df.groupby("Accommodation type").agg(
        AvgDailyStayINR=("DailyAccommodationINR", "mean"),
        Samples=("Trip ID", "count")
    ).reset_index()
    
    out_path = os.path.join(OUTPUT_DIR, "budget_baselines.csv")
    baselines.to_csv(out_path, index=False)
    print(f"✅ Saved budget baselines to {out_path} ({len(baselines)} records)")

if __name__ == "__main__":
    print("="*60)
    print("DATA PROCESSING PIPELINE")
    print("="*60)
    clean_indian_places()
    extract_budget_baselines()
