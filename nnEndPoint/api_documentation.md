# 🧠 ThyroCare Neural Network API — Full Documentation

> **Base URL:** `http://127.0.0.1:8000`
> **Framework:** FastAPI (Python)
> **Model:** Keras/TensorFlow Neural Network (`medical_model.keras`)
> **Interactive Docs:** `http://127.0.0.1:8000/docs` (Swagger UI)

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Preprocessing Pipeline](#preprocessing-pipeline)
4. [API Endpoints](#api-endpoints)
5. [Request & Response Schema](#request--response-schema)
6. [Full Input Fields Reference](#full-input-fields-reference)
7. [Possible Predictions (Output Classes)](#possible-predictions-output-classes)
8. [Error Handling](#error-handling)
9. [Environment & Dependencies](#environment--dependencies)

---

## Overview

The ThyroCare NN API is a **FastAPI-based microservice** that serves a trained neural network model for **thyroid disease classification**. It accepts patient clinical data (demographics, lab results, symptoms, medications) and returns a predicted thyroid diagnosis.

The model was trained using `scikit-learn 1.6.1` for preprocessing and `Keras/TensorFlow` for the neural network.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client (Backend / Frontend)              │
│                  POST /predict { patient_data }             │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                     FastAPI Server (main.py)                │
│                                                             │
│  1. Receive JSON → Convert to DataFrame                     │
│  2. Compute PulsePressure = SBP - DBP                       │
│  3. Impute missing numerical values  (num_imputer.pkl)      │
│  4. Impute missing categorical values (cat_imputer.pkl)     │
│  5. One-Hot Encode categorical cols   (ohe_encoder.pkl)     │
│  6. Scale numerical columns           (scaler.pkl)          │
│  7. Concatenate scaled + encoded features                   │
│  8. Feed into Neural Network          (medical_model.keras) │
│  9. Decode prediction                 (label_encoder.pkl)   │
│ 10. Return { "prediction": "..." }                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Preprocessing Pipeline

The model requires data to be preprocessed **exactly** as it was during training. The following `.pkl` files are loaded at server startup:

| File | Type | Purpose |
|------|------|---------|
| `num_imputer.pkl` | `SimpleImputer` | Fills missing values in **numerical** columns (e.g., median strategy) |
| `cat_imputer.pkl` | `SimpleImputer` | Fills missing values in **categorical** columns (e.g., most frequent) |
| `ohe_encoder.pkl` | `OneHotEncoder` | Transforms 6 categorical columns into 16 binary features |
| `scaler.pkl` | `StandardScaler` | Standardizes all 70 numerical columns (zero mean, unit variance) |
| `label_encoder.pkl` | `LabelEncoder` | Converts the model's integer output back to a human-readable diagnosis string |

### Derived Feature
- **`PulsePressure`** is computed server-side as `SBP - DBP`. You do **not** need to send it in the request, but `SBP` and `DBP` **must** be present.

> ⚠️ **Critical:** These `.pkl` files were trained with `scikit-learn==1.6.1`. Using a different version may cause `AttributeError` or incorrect results.

---

## API Endpoints

### `POST /predict`

Accepts patient clinical data and returns a thyroid diagnosis prediction.

| Property | Value |
|----------|-------|
| **URL** | `/predict` |
| **Method** | `POST` |
| **Content-Type** | `application/json` |
| **Authentication** | None (open endpoint) |

#### Request Body

```json
{
  "patient_data": {
    "Age": 45.0,
    "Gender": "Female",
    "HeightCm": 161.2,
    "WeightKg": 70.5,
    "BMI": 27.2,
    "SmokingStatus": "Never",
    "AlcoholUse": "Moderate",
    "PhysicalActivity": "Moderate",
    "DietaryIodine": "Adequate",
    "Pregnant": 0.0,
    "Postpartum_6mo": 0.0,
    "FamilyHistoryThyroid": 1.0,
    "PriorThyroidDisease": 0.0,
    "NeckRadiationHistory": 0.0,
    "ThyroidSurgeryHistory": 0.0,
    "Diabetes": 0.0,
    "Hypertension": 0.0,
    "Dyslipidemia": 0.0,
    "CKD": 0.0,
    "CAD": 0.0,
    "DepressionAnxietyDx": 0.0,
    "OtherAutoimmuneDx": 0.0,
    "OnAmiodarone": 0.0,
    "OnLithium": 0.0,
    "OnInterferon": 0.0,
    "OnGlucocorticoids": 0.0,
    "OnBiotinSupplement": 0.0,
    "RecentIodineContrast": 0.0,
    "SBP": 120.0,
    "DBP": 80.0,
    "HeartRate": 72.0,
    "TempC": 36.6,
    "TSH_mIU_L": 3.5,
    "FreeT4_ng_dL": 1.2,
    "FreeT3_pg_mL": 3.1,
    "TPOAb_IU_mL": 15.0,
    "TgAb_IU_mL": 10.0,
    "TRAb_IU_L": 0.5,
    "ESR_mm_hr": 12.0,
    "CRP_mg_L": 2.0,
    "TotalChol_mg_dL": 190.0,
    "LDL_mg_dL": 110.0,
    "HDL_mg_dL": 55.0,
    "Triglycerides_mg_dL": 130.0,
    "HbA1c_pct": 5.5,
    "VitaminD_25OH_ng_mL": 30.0,
    "Ferritin_ng_mL": 80.0,
    "Goiter": 0.0,
    "ThyroidNodules": 0.0,
    "TenderThyroid": 0.0,
    "ThyroidVolume_mL": 15.0,
    "OnLevothyroxine": 0.0,
    "LevothyroxineDose_mcg": 0.0,
    "OnAntithyroidDrug": 0.0,
    "AntithyroidDrugType": "Methimazole",
    "OnBetaBlocker": 0.0,
    "SymptomScore": 3.0,
    "Fatigue": 1.0,
    "WeightGain": 0.0,
    "WeightLoss": 0.0,
    "ColdIntolerance": 1.0,
    "HeatIntolerance": 0.0,
    "Palpitations": 0.0,
    "Tremor": 0.0,
    "Constipation": 0.0,
    "Diarrhea": 0.0,
    "HairLoss": 1.0,
    "DrySkin": 0.0,
    "Anxiety": 0.0,
    "Depression": 0.0,
    "Insomnia": 0.0,
    "MenstrualIrregularity": 0.0,
    "Infertility": 0.0,
    "NeckSwelling": 0.0,
    "EyeSymptoms": 0.0
  }
}
```

#### Successful Response (200 OK)

```json
{
  "prediction": "Severe Hypothyroidism"
}
```

#### Error Response (500 Internal Server Error)

Returned when required fields are missing or data format is incorrect.

```json
{
  "detail": "Internal Server Error"
}
```

#### Error Response (422 Unprocessable Entity)

Returned when the JSON body does not match the expected schema.

```json
{
  "detail": [
    {
      "loc": ["body", "patient_data"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

---

## Request & Response Schema

### Request Schema: `PatientData`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `patient_data` | `object (dict)` | ✅ Yes | A dictionary containing all patient features. See [Full Input Fields Reference](#full-input-fields-reference). |

### Response Schema

| Field | Type | Description |
|-------|------|-------------|
| `prediction` | `string` | The predicted thyroid condition label |

---

## Full Input Fields Reference

### Numerical Columns (70 fields)

| # | Field Name | Type | Description | Example |
|---|------------|------|-------------|---------|
| 1 | `Age` | float | Patient age in years | `45.0` |
| 2 | `HeightCm` | float | Height in centimeters | `161.2` |
| 3 | `WeightKg` | float | Weight in kilograms | `70.5` |
| 4 | `BMI` | float | Body Mass Index | `27.2` |
| 5 | `Pregnant` | float (0/1) | Currently pregnant | `0.0` |
| 6 | `Postpartum_6mo` | float (0/1) | Within 6 months postpartum | `0.0` |
| 7 | `FamilyHistoryThyroid` | float (0/1) | Family history of thyroid disease | `1.0` |
| 8 | `PriorThyroidDisease` | float (0/1) | Prior thyroid disease diagnosis | `0.0` |
| 9 | `NeckRadiationHistory` | float (0/1) | History of neck radiation | `0.0` |
| 10 | `ThyroidSurgeryHistory` | float (0/1) | Prior thyroid surgery | `0.0` |
| 11 | `Diabetes` | float (0/1) | Has diabetes | `0.0` |
| 12 | `Hypertension` | float (0/1) | Has hypertension | `0.0` |
| 13 | `Dyslipidemia` | float (0/1) | Has dyslipidemia | `0.0` |
| 14 | `CKD` | float (0/1) | Chronic Kidney Disease | `0.0` |
| 15 | `CAD` | float (0/1) | Coronary Artery Disease | `0.0` |
| 16 | `DepressionAnxietyDx` | float (0/1) | Depression/Anxiety diagnosis | `0.0` |
| 17 | `OtherAutoimmuneDx` | float (0/1) | Other autoimmune diagnosis | `0.0` |
| 18 | `OnAmiodarone` | float (0/1) | Taking Amiodarone | `0.0` |
| 19 | `OnLithium` | float (0/1) | Taking Lithium | `0.0` |
| 20 | `OnInterferon` | float (0/1) | Taking Interferon | `0.0` |
| 21 | `OnGlucocorticoids` | float (0/1) | Taking Glucocorticoids | `0.0` |
| 22 | `OnBiotinSupplement` | float (0/1) | Taking Biotin supplement | `0.0` |
| 23 | `RecentIodineContrast` | float (0/1) | Recent iodine contrast exposure | `0.0` |
| 24 | `SBP` | float | Systolic Blood Pressure (mmHg) | `120.0` |
| 25 | `DBP` | float | Diastolic Blood Pressure (mmHg) | `80.0` |
| 26 | `HeartRate` | float | Heart rate (bpm) | `72.0` |
| 27 | `TempC` | float | Body temperature (°C) | `36.6` |
| 28 | `TSH_mIU_L` | float | Thyroid Stimulating Hormone (mIU/L) | `3.5` |
| 29 | `FreeT4_ng_dL` | float | Free T4 (ng/dL) | `1.2` |
| 30 | `FreeT3_pg_mL` | float | Free T3 (pg/mL) | `3.1` |
| 31 | `TPOAb_IU_mL` | float | TPO Antibodies (IU/mL) | `15.0` |
| 32 | `TgAb_IU_mL` | float | Thyroglobulin Antibodies (IU/mL) | `10.0` |
| 33 | `TRAb_IU_L` | float | TSH Receptor Antibodies (IU/L) | `0.5` |
| 34 | `ESR_mm_hr` | float | Erythrocyte Sedimentation Rate (mm/hr) | `12.0` |
| 35 | `CRP_mg_L` | float | C-Reactive Protein (mg/L) | `2.0` |
| 36 | `TotalChol_mg_dL` | float | Total Cholesterol (mg/dL) | `190.0` |
| 37 | `LDL_mg_dL` | float | LDL Cholesterol (mg/dL) | `110.0` |
| 38 | `HDL_mg_dL` | float | HDL Cholesterol (mg/dL) | `55.0` |
| 39 | `Triglycerides_mg_dL` | float | Triglycerides (mg/dL) | `130.0` |
| 40 | `HbA1c_pct` | float | HbA1c percentage | `5.5` |
| 41 | `VitaminD_25OH_ng_mL` | float | Vitamin D level (ng/mL) | `30.0` |
| 42 | `Ferritin_ng_mL` | float | Ferritin (ng/mL) | `80.0` |
| 43 | `Goiter` | float (0/1) | Goiter present | `0.0` |
| 44 | `ThyroidNodules` | float (0/1) | Thyroid nodules present | `0.0` |
| 45 | `TenderThyroid` | float (0/1) | Tender thyroid on exam | `0.0` |
| 46 | `ThyroidVolume_mL` | float | Thyroid volume (mL) | `15.0` |
| 47 | `OnLevothyroxine` | float (0/1) | Taking Levothyroxine | `0.0` |
| 48 | `LevothyroxineDose_mcg` | float | Levothyroxine dose (mcg) | `0.0` |
| 49 | `OnAntithyroidDrug` | float (0/1) | Taking antithyroid medication | `0.0` |
| 50 | `OnBetaBlocker` | float (0/1) | Taking beta blocker | `0.0` |
| 51 | `SymptomScore` | float | Overall symptom severity score | `3.0` |
| 52 | `Fatigue` | float (0/1) | Fatigue symptom | `1.0` |
| 53 | `WeightGain` | float (0/1) | Weight gain symptom | `0.0` |
| 54 | `WeightLoss` | float (0/1) | Weight loss symptom | `0.0` |
| 55 | `ColdIntolerance` | float (0/1) | Cold intolerance symptom | `1.0` |
| 56 | `HeatIntolerance` | float (0/1) | Heat intolerance symptom | `0.0` |
| 57 | `Palpitations` | float (0/1) | Palpitations symptom | `0.0` |
| 58 | `Tremor` | float (0/1) | Tremor symptom | `0.0` |
| 59 | `Constipation` | float (0/1) | Constipation symptom | `0.0` |
| 60 | `Diarrhea` | float (0/1) | Diarrhea symptom | `0.0` |
| 61 | `HairLoss` | float (0/1) | Hair loss symptom | `1.0` |
| 62 | `DrySkin` | float (0/1) | Dry skin symptom | `0.0` |
| 63 | `Anxiety` | float (0/1) | Anxiety symptom | `0.0` |
| 64 | `Depression` | float (0/1) | Depression symptom | `0.0` |
| 65 | `Insomnia` | float (0/1) | Insomnia symptom | `0.0` |
| 66 | `MenstrualIrregularity` | float (0/1) | Menstrual irregularity | `0.0` |
| 67 | `Infertility` | float (0/1) | Infertility | `0.0` |
| 68 | `NeckSwelling` | float (0/1) | Neck swelling symptom | `0.0` |
| 69 | `EyeSymptoms` | float (0/1) | Eye symptoms (Graves') | `0.0` |
| 70 | `PulsePressure` | float | **Auto-computed** (SBP - DBP) — do NOT send | — |

### Categorical Columns (6 fields)

| # | Field Name | Type | Allowed Values |
|---|------------|------|----------------|
| 1 | `Gender` | string | `"Male"`, `"Female"` |
| 2 | `SmokingStatus` | string | `"Current"`, `"Former"`, `"Never"` |
| 3 | `AlcoholUse` | string | `"High"`, `"Moderate"` |
| 4 | `PhysicalActivity` | string | `"High"`, `"Low"`, `"Moderate"` |
| 5 | `DietaryIodine` | string | `"Adequate"`, `"High"`, `"Low"` |
| 6 | `AntithyroidDrugType` | string | `"Carbimazole"`, `"Methimazole"`, `"PTU"` |

> ⚠️ **Important:** Categorical values are **case-sensitive** and must match exactly. For example, `"female"` will NOT work — it must be `"Female"`.

---

## Possible Predictions (Output Classes)

The `label_encoder.pkl` maps model output indices to the following diagnosis labels (these are the known classes from testing):

| Prediction | Description |
|------------|-------------|
| `Normal` | No thyroid disorder detected |
| `Severe Hypothyroidism` | Severely underactive thyroid |
| `Moderate Hyperthyroidism` | Moderately overactive thyroid |

> **Note:** The model may produce additional classes beyond these three. The full list depends on the training data labels encoded in `label_encoder.pkl`.

---

## Error Handling

| HTTP Code | Cause | Solution |
|-----------|-------|----------|
| `200` | Success | — |
| `405` | Wrong HTTP method (e.g., GET instead of POST) | Use `POST` method |
| `422` | Invalid JSON body / missing `patient_data` key | Ensure body matches the schema |
| `500` | Missing fields, wrong data types, or server error | Check that all required fields are present with correct types |

---

## Environment & Dependencies

### Requirements (`requirements.txt`)

```
fastapi
uvicorn
pandas
numpy
joblib
keras
scikit-learn==1.6.1
pydantic
tensorflow
```

> ⚠️ **`scikit-learn` MUST be version `1.6.1`** to match the version used during model training. Using a newer version causes `AttributeError: 'SimpleImputer' object has no attribute '_fill_dtype'`.

### Running the Server

```bash
cd nnEndPoint
.\venv\Scripts\activate        # Windows
uvicorn main:app --reload      # Start with auto-reload
```

The server will be available at `http://127.0.0.1:8000`.

### File Structure

```
nnEndPoint/
├── main.py                  # FastAPI application + /predict endpoint
├── medical_model.keras      # Trained Keras neural network model
├── num_imputer.pkl          # Numerical missing value imputer
├── cat_imputer.pkl          # Categorical missing value imputer
├── ohe_encoder.pkl          # One-Hot Encoder for categorical features
├── scaler.pkl               # StandardScaler for numerical features
├── label_encoder.pkl        # Label encoder (index → diagnosis string)
├── requirements.txt         # Python dependencies
├── venv/                    # Virtual environment
└── test_samples/
    ├── samples.txt          # Test samples with known diagnoses
    ├── test_api.py          # Automated test script
    └── testing_apis_results.md  # Test results report
```
