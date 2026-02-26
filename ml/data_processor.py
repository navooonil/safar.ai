import os
import pandas as pd
import json

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

def inspect_datasets():
    datasets = {
        "Top Indian Places": "Top Indian Places to Visit.csv",
        "Tourism Dataset": "tourism_dataset.csv",
        "Travel Details": "Travel details dataset.csv"
    }

    output = {}

    for name, filename in datasets.items():
        filepath = os.path.join(DATA_DIR, filename)
        if not os.path.exists(filepath):
            continue
            
        try:
            df = pd.read_csv(filepath)
            columns = []
            for col in df.columns:
                val = df[col].dropna().iloc[0] if not df[col].dropna().empty else None
                # Converting everything to string to avoid JSON serialization errors
                val = str(val) if val is not None else "N/A"
                columns.append({"col": col, "type": str(df[col].dtype), "sample": val})
                
            output[name] = {
                "rows": df.shape[0],
                "cols": df.shape[1],
                "columns": columns
            }
        except Exception as e:
            output[name] = {"error": str(e)}

    with open(os.path.join(os.path.dirname(__file__), "data_summary.json"), "w") as f:
        json.dump(output, f, indent=2)

if __name__ == "__main__":
    inspect_datasets()
