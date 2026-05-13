import requests
import json
import re

def run_tests():
    url = "http://127.0.0.1:8000/predict"
    samples_path = r"C:\Omars_final_Project\thyroCare\nnEndPoint\test_samples\samples.txt"
    results_path = r"C:\Omars_final_Project\thyroCare\nnEndPoint\test_samples\testing_apis_results.md"
    
    with open(samples_path, "r") as f:
        content = f.read()
    
    # More robust splitting: find blocks starting with = and containing { }
    blocks = re.split(r"={10,}", content)
    
    results = []
    
    current_diagnosis = None
    
    for block in blocks:
        block = block.strip()
        if not block:
            continue
            
        if "ACTUAL TRUE DIAGNOSIS:" in block:
            current_diagnosis = block.replace("ACTUAL TRUE DIAGNOSIS:", "").strip()
            continue
            
        if block.startswith("{") and block.endswith("}"):
            if not current_diagnosis:
                current_diagnosis = "Unknown"
                
            try:
                data = json.loads(block)
                response = requests.post(url, json=data)
                if response.status_code == 200:
                    predicted = response.json().get("prediction", "Error: No prediction key")
                else:
                    predicted = f"Error: {response.status_code} - {response.text}"
            except Exception as e:
                predicted = f"Error: {str(e)}"
                print(f"Failed to parse or request block: {block[:50]}...")
                print(f"Error details: {e}")
            
            results.append({
                "id": len(results) + 1,
                "actual": current_diagnosis,
                "predicted": predicted
            })
            current_diagnosis = None

    # Generate MD
    md_content = "# API Testing Results\n\n"
    md_content += "| Sample ID | Actual Diagnosis | Model Prediction | Result |\n"
    md_content += "|-----------|------------------|------------------|--------|\n"
    
    for res in results:
        status = "✅ Match" if res["actual"] == res["predicted"] else "❌ Mismatch"
        md_content += f"| {res['id']} | {res['actual']} | {res['predicted']} | {status} |\n"
    
    with open(results_path, "w", encoding="utf-8") as f:
        f.write(md_content)
    
    print(f"Results written to {results_path}")

if __name__ == "__main__":
    run_tests()
