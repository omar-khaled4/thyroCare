# 🔗 Model Integration Report
**Project:** ThyroCare  
**Date:** 2026-05-13  
**Integration:** Neural Network Microservice (`nnEndPoint`) ↔ Express Backend (`BackEndLayer`)

---

## Summary

The Neural Network thyroid diagnosis model has been fully integrated into the Express backend layer. The frontend can now request a prediction through a single authenticated API call to `POST /api/predict`. The backend enriches the request with patient data stored in MongoDB, forwards it to the FastAPI model server, saves the result, and returns the prediction.

All syntax checks passed. No new npm dependencies were added — the built-in `fetch()` (Node 18+) was used as the HTTP client, consistent with how `chat.controller.js` already communicates with OpenAI.

---

## Files Changed

### 🆕 NEW — `src/models/Prediction.js`

A new Mongoose schema to persist every prediction made for a patient.

**Schema fields:**

| Field | Type | Description |
|-------|------|-------------|
| `patientId` | `ObjectId` (ref: User) | The patient who requested the prediction |
| `prediction` | `String` | The diagnosis label returned by the NN model |
| `inputData` | `Mixed` | Full `patient_data` object sent to the model (audit trail) |
| `createdAt` | `Date` | Auto-generated timestamp |

---

### 🆕 NEW — `src/controllers/prediction.controller.js`

The core controller. Exports four functions:

#### `predict` — `POST /api/predict`

Full flow:
1. Validates `patient_data` is present in the request body.
2. Fetches the logged-in patient's `User`, latest `Report`, and latest `Symptom` from MongoDB **in parallel**.
3. Merges them with the frontend-provided data using `buildPatientData()`:
   - **From `User`:** `Age`, `Gender` (capitalised to match NN format, e.g. `"male"` → `"Male"`)
   - **From latest `Report`:** `TSH_mIU_L`, `FreeT3_pg_mL`, `FreeT4_ng_dL`, `TPOAb_IU_mL`, `TgAb_IU_mL`, `TRAb_IU_L`
   - **From latest `Symptom`:** `Fatigue`, `Anxiety`, `Insomnia`, `HairLoss`, `Palpitations`, `ColdIntolerance`
   - **All other fields** (vitals, lifestyle, medical history, medications, remaining symptoms) come from the frontend `patient_data` body.
4. POSTs the merged data to `{NN_MODEL_URL}/predict` with a **15-second timeout**.
5. Handles all failure modes gracefully:
   - `503` if the NN model server is unreachable
   - `504` if the request times out
   - `502` if the model returns a non-OK status or missing prediction field
6. Saves the prediction to the `Prediction` MongoDB collection.
7. Returns `{ prediction, predictionId }` to the frontend.

#### `getPredictionHistory` — `GET /api/predict/history`
Returns all predictions for the logged-in patient, sorted newest first. Excludes `inputData` by default to keep responses lean.

#### `getPredictionById` — `GET /api/predict/history/:id`
Returns a single prediction by its MongoDB ID, including the full `inputData` for debugging / auditing.

#### `deletePrediction` — `DELETE /api/predict/history/:id`
Deletes a prediction record. Only the owning patient can delete their own records.

---

### 🆕 NEW — `src/routes/prediction.routes.js`

Defines four routes, all protected by `auth.middleware.js` (JWT required):

| Method | Route | Controller Function | Description |
|--------|-------|---------------------|-------------|
| `POST` | `/api/predict` | `predict` | Run the NN model and get a diagnosis |
| `GET` | `/api/predict/history` | `getPredictionHistory` | Get all predictions for the patient |
| `GET` | `/api/predict/history/:id` | `getPredictionById` | Get one prediction by ID |
| `DELETE` | `/api/predict/history/:id` | `deletePrediction` | Delete a prediction record |

---

### ✏️ MODIFIED — `src/app.js`

Two lines added to register the new prediction routes:

```diff
 const chatRoutes = require("./routes/chat.routes");
+const predictionRoutes = require("./routes/prediction.routes");
 
 app.use("/api/chat", chatRoutes);
+app.use("/api/predict", predictionRoutes);
```

---

### ✏️ MODIFIED — `.env.example`

Added the `NN_MODEL_URL` variable so all developers know to configure it:

```diff
+NN_MODEL_URL=http://127.0.0.1:8000
```

> **Note:** `NN_MODEL_URL=http://127.0.0.1:8000` was already present in `.env` from a prior step. No change needed there.

---

## API Usage Guide

### `POST /api/predict`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "patient_data": {
    "HeightCm": 161.2,
    "WeightKg": 70.5,
    "BMI": 27.2,
    "SmokingStatus": "Never",
    "AlcoholUse": "Moderate",
    "PhysicalActivity": "Moderate",
    "DietaryIodine": "Adequate",
    "Pregnant": 0,
    "Postpartum_6mo": 0,
    "FamilyHistoryThyroid": 1,
    "PriorThyroidDisease": 0,
    "NeckRadiationHistory": 0,
    "ThyroidSurgeryHistory": 0,
    "Diabetes": 0,
    "Hypertension": 0,
    "Dyslipidemia": 0,
    "CKD": 0,
    "CAD": 0,
    "DepressionAnxietyDx": 0,
    "OtherAutoimmuneDx": 0,
    "OnAmiodarone": 0,
    "OnLithium": 0,
    "OnInterferon": 0,
    "OnGlucocorticoids": 0,
    "OnBiotinSupplement": 0,
    "RecentIodineContrast": 0,
    "SBP": 120,
    "DBP": 80,
    "HeartRate": 72,
    "TempC": 36.6,
    "ESR_mm_hr": 12,
    "CRP_mg_L": 2,
    "TotalChol_mg_dL": 190,
    "LDL_mg_dL": 110,
    "HDL_mg_dL": 55,
    "Triglycerides_mg_dL": 130,
    "HbA1c_pct": 5.5,
    "VitaminD_25OH_ng_mL": 30,
    "Ferritin_ng_mL": 80,
    "Goiter": 0,
    "ThyroidNodules": 0,
    "TenderThyroid": 0,
    "ThyroidVolume_mL": 15,
    "OnLevothyroxine": 0,
    "LevothyroxineDose_mcg": 0,
    "OnAntithyroidDrug": 0,
    "AntithyroidDrugType": "Methimazole",
    "OnBetaBlocker": 0,
    "SymptomScore": 3,
    "WeightGain": 0,
    "WeightLoss": 0,
    "HeatIntolerance": 0,
    "Tremor": 0,
    "Constipation": 0,
    "Diarrhea": 0,
    "DrySkin": 0,
    "Depression": 0,
    "MenstrualIrregularity": 0,
    "Infertility": 0,
    "NeckSwelling": 0,
    "EyeSymptoms": 0
  }
}
```

> **Note:** `Age`, `Gender`, `TSH_mIU_L`, `FreeT3_pg_mL`, `FreeT4_ng_dL`, `TPOAb_IU_mL`, `TgAb_IU_mL`, `TRAb_IU_L`, `Fatigue`, `Anxiety`, `Insomnia`, `HairLoss`, `Palpitations`, and `ColdIntolerance` are **automatically filled from MongoDB**. You do not need to send them (they will be overwritten even if you do).

**Successful Response (200):**
```json
{
  "success": true,
  "data": {
    "prediction": "Normal",
    "predictionId": "6642abc123def456..."
  },
  "message": "Prediction complete"
}
```

**Error Responses:**

| Status | Cause |
|--------|-------|
| `400` | Missing or invalid `patient_data` in body |
| `401` | No/invalid JWT token |
| `503` | NN model server is not running |
| `504` | NN model server timed out (>15 seconds) |
| `502` | NN model returned an unexpected error |

---

### `GET /api/predict/history`

Returns all predictions for the authenticated patient.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "6642abc...",
      "patientId": "...",
      "prediction": "Normal",
      "createdAt": "2026-05-13T17:55:00.000Z"
    }
  ]
}
```

---

## Architecture After Integration

```
┌─────────────────┐     POST /api/predict      ┌──────────────────────────┐
│   Frontend      │ ─────────────────────────▶ │  BackEndLayer (port 5000)│
│   (React)       │ ◀─────────────────────────  │  prediction.controller   │
└─────────────────┘  { prediction: "Normal" }   │    │                     │
                                                │    │ 1. Validate body     │
                                                │    │ 2. Fetch User/Report │
                                                │    │    /Symptom from DB  │
                                                │    │ 3. Merge + map data  │
                                                │    │ 4. POST to NN model  │
                                                │    │ 5. Save to MongoDB   │
                                                │    │ 6. Return result     │
                                                └────┼─────────────────────┘
                                                     │ fetch() POST
                                                     ▼
                                             ┌──────────────────┐
                                             │  nnEndPoint      │
                                             │  (port 8000)     │
                                             │  /predict        │
                                             └──────────────────┘
```

---

## Running Both Services

Start **two terminals** simultaneously:

**Terminal 1 — NN Model:**
```bash
cd nnEndPoint
.\venv\Scripts\activate
uvicorn main:app --reload
# → http://127.0.0.1:8000
```

**Terminal 2 — Express Backend:**
```bash
cd BackEndLayer
node src/server.js
# → http://localhost:5000
```

---

## Verification Checklist

- [x] `src/models/Prediction.js` — created and loads without errors
- [x] `src/controllers/prediction.controller.js` — created with full logic
- [x] `src/routes/prediction.routes.js` — created with 4 routes
- [x] `src/app.js` — updated to mount `/api/predict`
- [x] `.env.example` — updated with `NN_MODEL_URL`
- [x] `.env` — `NN_MODEL_URL=http://127.0.0.1:8000` was already present
- [x] `node -e "require('./src/app')"` — **passed with no errors**
- [x] No new npm packages required
