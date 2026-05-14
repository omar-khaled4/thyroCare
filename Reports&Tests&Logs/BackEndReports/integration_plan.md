# 🔗 Integration Plan: Neural Network Model ↔ Backend Layer

> **Goal:** Connect the Python-based NN microservice (`nnEndPoint`) with the Node.js/Express backend (`BackEndLayer`) so the frontend can request thyroid predictions through the existing backend API.

---

## Table of Contents

1. [Current Architecture](#current-architecture)
2. [Target Architecture](#target-architecture)
3. [Data Mapping Challenge](#data-mapping-challenge)
4. [Step-by-Step Integration Plan](#step-by-step-integration-plan)
5. [Environment Configuration](#environment-configuration)
6. [Deployment Considerations](#deployment-considerations)

---

## Current Architecture

```
┌────────────────┐       ┌──────────────────┐       ┌────────────────┐
│   Frontend     │──────▶│   BackEndLayer   │──────▶│   MongoDB      │
│   (React)      │       │   (Express:5000) │       │   (Atlas)      │
└────────────────┘       └──────────────────┘       └────────────────┘

                         ┌──────────────────┐
                         │   nnEndPoint     │  ← Currently ISOLATED
                         │   (FastAPI:8000) │
                         └──────────────────┘
```

The NN model runs as a **standalone FastAPI server** on port `8000`. It has **no connection** to the Express backend or the frontend. There is no route in the backend that calls the model.

---

## Target Architecture

```
┌────────────────┐       ┌──────────────────────────┐       ┌────────────────┐
│   Frontend     │──────▶│      BackEndLayer        │──────▶│   MongoDB      │
│   (React)      │       │      (Express:5000)      │       │   (Atlas)      │
└────────────────┘       │                          │       └────────────────┘
                         │  POST /api/predict       │
                         │    │                     │
                         │    ▼                     │
                         │  prediction.controller   │
                         │    │                     │
                         │    │ 1. Gather patient   │
                         │    │    data from DB     │
                         │    │ 2. Map fields to    │
                         │    │    NN model format  │
                         │    │ 3. Call nnEndPoint  │
                         │    │ 4. Return result    │
                         │    ▼                     │
                         │  HTTP POST to            │
                         │  localhost:8000/predict   │
                         └──────────────────────────┘
                                    │
                                    ▼
                         ┌──────────────────┐
                         │   nnEndPoint     │
                         │   (FastAPI:8000) │
                         └──────────────────┘
```

The Express backend will act as a **proxy/orchestrator** — it collects patient data, maps it into the format the NN model expects, calls the FastAPI service, and returns the prediction to the frontend.

---

## Data Mapping Challenge

The NN model expects **76 specific fields** with exact names and casing. Your existing backend models store data in a **different structure**. Below is the mapping between what you already have and what the model needs.

### Fields Available from Existing Backend Models

#### From `User` model
| Backend Field | NN Model Field | Notes |
|--------------|----------------|-------|
| `user.age` | `Age` | Direct map |
| `user.gender` | `Gender` | Map `"male"` → `"Male"`, `"female"` → `"Female"` |

#### From `Report` model (thyroid function tests)
| Backend Field | NN Model Field | Notes |
|--------------|----------------|-------|
| `report.thyroidFunction.tsh` | `TSH_mIU_L` | Direct map |
| `report.thyroidFunction.freeT3` | `FreeT3_pg_mL` | Direct map |
| `report.thyroidFunction.freeT4` | `FreeT4_ng_dL` | Direct map |
| `report.antibodies.tpo` | `TPOAb_IU_mL` | Direct map |
| `report.antibodies.antiTg` | `TgAb_IU_mL` | Direct map |
| `report.antibodies.tshr` | `TRAb_IU_L` | Direct map |

#### From `Symptom` model
| Backend Field | NN Model Field | Notes |
|--------------|----------------|-------|
| `symptom.fatigue` | `Fatigue` | Direct map (0/1) |
| `symptom.anxiety` | `Anxiety` | Direct map (0/1) |
| `symptom.insomnia` | `Insomnia` | Direct map (0/1) |
| `symptom.hairLoss` | `HairLoss` | Direct map (0/1) |
| `symptom.palpitations` | `Palpitations` | Direct map (0/1) |
| `symptom.coldIntolerance` | `ColdIntolerance` | Direct map (0/1) |

### Fields NOT Currently in the Backend (Must Be Provided by Frontend)

The following fields are **required by the NN model** but are **not stored** in any existing backend model. They must be sent from the frontend in the prediction request body:

| Category | Fields |
|----------|--------|
| **Body Measurements** | `HeightCm`, `WeightKg`, `BMI` |
| **Lifestyle** | `SmokingStatus`, `AlcoholUse`, `PhysicalActivity`, `DietaryIodine` |
| **Medical History** | `Pregnant`, `Postpartum_6mo`, `FamilyHistoryThyroid`, `PriorThyroidDisease`, `NeckRadiationHistory`, `ThyroidSurgeryHistory`, `Diabetes`, `Hypertension`, `Dyslipidemia`, `CKD`, `CAD`, `DepressionAnxietyDx`, `OtherAutoimmuneDx` |
| **Medications** | `OnAmiodarone`, `OnLithium`, `OnInterferon`, `OnGlucocorticoids`, `OnBiotinSupplement`, `RecentIodineContrast`, `OnLevothyroxine`, `LevothyroxineDose_mcg`, `OnAntithyroidDrug`, `AntithyroidDrugType`, `OnBetaBlocker` |
| **Vitals** | `SBP`, `DBP`, `HeartRate`, `TempC` |
| **Labs (non-thyroid)** | `ESR_mm_hr`, `CRP_mg_L`, `TotalChol_mg_dL`, `LDL_mg_dL`, `HDL_mg_dL`, `Triglycerides_mg_dL`, `HbA1c_pct`, `VitaminD_25OH_ng_mL`, `Ferritin_ng_mL` |
| **Physical Exam** | `Goiter`, `ThyroidNodules`, `TenderThyroid`, `ThyroidVolume_mL` |
| **Symptoms (missing)** | `WeightGain`, `WeightLoss`, `HeatIntolerance`, `Tremor`, `Constipation`, `Diarrhea`, `DrySkin`, `Depression`, `MenstrualIrregularity`, `Infertility`, `NeckSwelling`, `EyeSymptoms`, `SymptomScore` |

---

## Step-by-Step Integration Plan

### Step 1: Add `NN_MODEL_URL` to Environment Variables

**File:** `BackEndLayer/.env`

Add the NN model service URL to your environment configuration.

```env
# Add this line to .env and .env.example
NN_MODEL_URL=http://127.0.0.1:8000
```

This keeps the URL configurable and avoids hardcoding.

---

### Step 2: Create the Prediction Controller

**File (NEW):** `BackEndLayer/src/controllers/prediction.controller.js`

Create a new controller that:
1. Receives prediction input from the frontend (additional fields not in the DB)
2. Optionally fetches the patient's existing data from MongoDB (User, Report, Symptom)
3. Merges and maps all fields to the NN model's expected format
4. Makes an HTTP POST request to `http://127.0.0.1:8000/predict`
5. Returns the prediction result to the frontend

**Key logic inside the controller:**

```
Function: predict(req, res)

  1. Extract the logged-in user's ID from req.user.id
  2. Read additional patient data from req.body (vitals, lifestyle, medical history, etc.)
  3. Fetch from MongoDB:
     - User document  → get age, gender
     - Latest Report   → get TSH, FreeT3, FreeT4, TPOAb, TgAb, TRAb
     - Latest Symptom  → get fatigue, anxiety, insomnia, hairLoss, palpitations, coldIntolerance
  4. Build the patient_data object by:
     - Mapping DB fields to NN field names (e.g., user.age → Age)
     - Capitalizing gender (e.g., "male" → "Male")
     - Merging with the additional fields from req.body
  5. POST to NN_MODEL_URL/predict with { patient_data: { ... } }
  6. Return { prediction: response.prediction } to the frontend
```

**Design Decision — Two Approaches:**

| Approach | Description | Pros | Cons |
|----------|-------------|------|------|
| **A. Frontend sends ALL fields** | The frontend sends the complete `patient_data` object. The backend simply proxies it to the NN model. | Simple backend logic. No DB queries needed. | Frontend must know all 76 fields. More work on the frontend. |
| **B. Backend enriches from DB** | The frontend sends only the missing fields. The backend fetches User/Report/Symptom data from MongoDB and merges everything. | Better UX — less frontend work. Data consistency. | More complex backend logic. Requires latest report/symptom data. |

> **Recommendation:** Use **Approach A** (frontend sends all fields) for the initial integration. It is simpler to implement and debug. You can migrate to Approach B later.

---

### Step 3: Create the Prediction Route

**File (NEW):** `BackEndLayer/src/routes/prediction.routes.js`

Define the route:

```
POST /api/predict  →  prediction.controller.predict  (protected with auth middleware)
```

The route should be protected by the `auth.middleware.js` so only authenticated users can request predictions.

---

### Step 4: Register the Route in `app.js`

**File (MODIFY):** `BackEndLayer/src/app.js`

Add two lines:
1. Import the new prediction routes file at the top
2. Mount it on `/api/predict`

```diff
 const chatRoutes = require("./routes/chat.routes");
+const predictionRoutes = require("./routes/prediction.routes");
 const errorHandler = require("./middlewares/error.middleware");

 // --- Routes ---
 app.use("/api/chat", chatRoutes);
+app.use("/api/predict", predictionRoutes);
```

---

### Step 5: Install `axios` (HTTP Client)

**File (MODIFY):** `BackEndLayer/package.json`

You need an HTTP client to call the NN model from inside Node.js. Install `axios`:

```bash
cd BackEndLayer
npm install axios
```

> **Alternative:** You can use Node.js built-in `fetch()` (available in Node 18+) to avoid adding a dependency. The `chat.controller.js` already uses `fetch()`.

---

### Step 6: Add Prediction Storage (Optional but Recommended)

**File (NEW):** `BackEndLayer/src/models/Prediction.js`

Create a Mongoose model to store prediction history for each patient:

```
Schema: Prediction
  - patientId:    ObjectId (ref: User, required)
  - prediction:   String (the model's output, e.g., "Severe Hypothyroidism")
  - inputData:    Object (the patient_data sent to the model — useful for auditing)
  - createdAt:    Date (auto via timestamps)
```

This allows:
- Patients to view their prediction history
- Doctors/admins to audit predictions
- Future analytics on model performance

---

### Step 7: Update the Prediction Controller to Save Results

After receiving the prediction from the NN model, save it to MongoDB before returning it to the frontend:

```
1. Call NN model → get prediction
2. Save to Prediction collection: { patientId, prediction, inputData }
3. Return prediction to frontend
```

---

### Step 8: Add Prediction History Endpoints (Optional)

**Add to the prediction routes:**

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/predict/history` | Get all predictions for the logged-in patient |
| `GET` | `/api/predict/history/:id` | Get a specific prediction by ID |
| `DELETE` | `/api/predict/history/:id` | Delete a specific prediction |

---

## Summary of All File Changes

| Action | File | Description |
|--------|------|-------------|
| **MODIFY** | `.env` / `.env.example` | Add `NN_MODEL_URL=http://127.0.0.1:8000` |
| **NEW** | `src/controllers/prediction.controller.js` | Controller with prediction + history logic |
| **NEW** | `src/routes/prediction.routes.js` | Route definitions for `/api/predict` |
| **MODIFY** | `src/app.js` | Import and mount prediction routes |
| **NEW** | `src/models/Prediction.js` | Mongoose schema for prediction history |
| **MODIFY** | `package.json` | Add `axios` dependency (or use built-in `fetch`) |

---

## Environment Configuration

### `.env` additions

```env
# Neural Network Model Service
NN_MODEL_URL=http://127.0.0.1:8000
```

### Running Both Services

You need **two terminal windows** running simultaneously:

**Terminal 1 — NN Model (Python):**
```bash
cd nnEndPoint
.\venv\Scripts\activate
uvicorn main:app --reload
# Running on http://127.0.0.1:8000
```

**Terminal 2 — Backend (Node.js):**
```bash
cd BackEndLayer
node src/server.js
# Running on http://localhost:5000
```

---

## Deployment Considerations

### Local Development
- Both services run on `localhost` (ports `5000` and `8000`)
- The Express backend calls `http://127.0.0.1:8000/predict` directly

### Production Deployment
When deploying to production, consider the following:

| Concern | Recommendation |
|---------|---------------|
| **Service Discovery** | Use environment variables for the NN model URL. Don't hardcode `localhost`. |
| **Containerization** | Dockerize both services. Use `docker-compose` to run them together on the same network. |
| **Timeouts** | The NN model can take 2–5 seconds for a prediction (TensorFlow loading). Set HTTP timeout to at least `10000ms` in your axios/fetch call. |
| **Health Checks** | Add a `GET /` or `GET /health` endpoint to the NN model so the backend can verify it's running before sending predictions. |
| **Error Handling** | If the NN model is down, the backend should return a graceful error message (e.g., `"Prediction service is currently unavailable"`) instead of crashing. |
| **CORS** | The NN model doesn't need CORS since only the backend calls it (server-to-server). The backend already has CORS enabled for the frontend. |
| **Rate Limiting** | Consider adding rate limiting to the prediction endpoint to prevent abuse. |
| **Logging** | Log all prediction requests and results for auditing and debugging. |

---

## Checklist

- [ ] Add `NN_MODEL_URL` to `.env` and `.env.example`
- [ ] Create `src/models/Prediction.js` (prediction history schema)
- [ ] Create `src/controllers/prediction.controller.js` (prediction + history logic)
- [ ] Create `src/routes/prediction.routes.js` (route definitions)
- [ ] Modify `src/app.js` to mount the new routes
- [ ] Install `axios` or use built-in `fetch()`
- [ ] Test the full flow: Frontend → Backend → NN Model → Response
- [ ] Add error handling for when the NN model is unavailable
- [ ] (Optional) Add prediction history endpoints
- [ ] (Optional) Add a health check endpoint to the NN model
