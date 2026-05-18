from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from mistralai import Mistral
from dotenv import load_dotenv
import os
import json

load_dotenv()

app = FastAPI()

client = Mistral(api_key=os.getenv("MISTRAL_API_KEY"))


# ──────────────────────────────────────────────────────────────────────────────
# Request Schema
# ──────────────────────────────────────────────────────────────────────────────

class Symptoms(BaseModel):
    fatigue: float = 0
    weightChange: float = 0
    coldIntolerance: float = 0
    hairLoss: float = 0
    palpitations: float = 0
    anxiety: float = 0
    insomnia: float = 0

class PatientData(BaseModel):
    age: float
    gender: str
    tsh: float
    freeT3: float
    freeT4: float
    totalT3: float = 0
    totalT4: float = 0
    tpo: float = 0
    antiTg: float = 0
    tshr: float = 0
    thyroglobulin: float = 0
    calcitonin: float = 0
    reverseT3: float = 0
    symptoms: Symptoms = Symptoms()

class PredictRequest(BaseModel):
    patient_data: PatientData


# ──────────────────────────────────────────────────────────────────────────────
# Health check
# ──────────────────────────────────────────────────────────────────────────────

@app.get("/")
def health():
    return {"status": "ThyroCare LLM API is running"}


# ──────────────────────────────────────────────────────────────────────────────
# Predict endpoint
# ──────────────────────────────────────────────────────────────────────────────

@app.post("/predict")
def predict(request: PredictRequest):
    try:
        p = request.patient_data
        s = p.symptoms

        # Build active symptoms list for the prompt
        active_symptoms = []
        if s.fatigue:         active_symptoms.append("fatigue")
        if s.weightChange:    active_symptoms.append("weight change")
        if s.coldIntolerance: active_symptoms.append("cold intolerance")
        if s.hairLoss:        active_symptoms.append("hair loss")
        if s.palpitations:    active_symptoms.append("palpitations")
        if s.anxiety:         active_symptoms.append("anxiety")
        if s.insomnia:        active_symptoms.append("insomnia")

        symptoms_str = ", ".join(active_symptoms) if active_symptoms else "none reported"

        # Short, efficient prompt — minimizes token usage
        prompt = f"""You are a thyroid disease analysis assistant. Analyze this patient data and return ONLY a JSON object, no extra text.

Patient:
- Age: {p.age}, Gender: {p.gender}
- TSH: {p.tsh} mIU/L, FreeT3: {p.freeT3} pg/mL, FreeT4: {p.freeT4} ng/dL
- TPO Antibodies: {p.tpo} IU/mL, TgAb: {p.antiTg} IU/mL, TRAb: {p.tshr} IU/L
- Symptoms: {symptoms_str}

Return this exact JSON structure:
{{
  "diagnosis": "one of: Normal, Hypothyroidism, Hyperthyroidism, Hashimoto's Thyroiditis, Graves' Disease, Thyroid Nodules, Thyroiditis",
  "severity": "one of: None, Mild, Moderate, Severe",
  "confidence": a number between 0.0 and 1.0,
  "healthScore": a number between 0 and 100 (100 = perfect health),
  "recommendations": [
    {{"priority": "high/medium/low", "action": "short action", "reason": "short reason"}},
    {{"priority": "high/medium/low", "action": "short action", "reason": "short reason"}},
    {{"priority": "high/medium/low", "action": "short action", "reason": "short reason"}}
  ]
}}"""

        response = client.chat.complete(
            model="mistral-small-latest",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,  # Low temperature = consistent, reliable outputs
        )

        raw = response.choices[0].message.content.strip()

        # Strip markdown code fences if Mistral wraps the JSON in them
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        raw = raw.strip()

        result = json.loads(raw)

        # Make sure all expected fields exist
        diagnosis  = result.get("diagnosis", "Unknown")
        severity   = result.get("severity", "Unknown")
        confidence = float(result.get("confidence", 0.0))
        healthScore = int(result.get("healthScore", 50))
        recommendations = result.get("recommendations", [])

        return {
            "prediction": f"{severity} {diagnosis}".strip(),
            "diagnosis": diagnosis,
            "severity": severity,
            "confidence": confidence,
            "healthScore": healthScore,
            "recommendations": recommendations,
        }

    except json.JSONDecodeError as e:
        return JSONResponse(status_code=500, content={
            "error": "Failed to parse AI response as JSON",
            "details": str(e)
        })
    except Exception as e:
        import traceback
        return JSONResponse(status_code=500, content={
            "error": str(e),
            "trace": traceback.format_exc()
        })