# pyrefly: ignore [missing-import]
from fastapi import FastAPI
# pyrefly: ignore [missing-import]
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
import keras
import os

app = FastAPI()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model = keras.saving.load_model(os.path.join(BASE_DIR, "medical_model.keras"))
num_imputer = joblib.load(os.path.join(BASE_DIR, "num_imputer.pkl"))
cat_imputer = joblib.load(os.path.join(BASE_DIR, "cat_imputer.pkl"))
ohe_encoder = joblib.load(os.path.join(BASE_DIR, "ohe_encoder.pkl"))
scaler = joblib.load(os.path.join(BASE_DIR, "scaler.pkl"))
le = joblib.load(os.path.join(BASE_DIR, "label_encoder.pkl"))

num_cols = ['Age', 'HeightCm', 'WeightKg', 'BMI', 'Pregnant', 'Postpartum_6mo', 'FamilyHistoryThyroid', 'PriorThyroidDisease', 'NeckRadiationHistory', 'ThyroidSurgeryHistory', 'Diabetes', 'Hypertension', 'Dyslipidemia', 'CKD', 'CAD', 'DepressionAnxietyDx', 'OtherAutoimmuneDx', 'OnAmiodarone', 'OnLithium', 'OnInterferon', 'OnGlucocorticoids', 'OnBiotinSupplement', 'RecentIodineContrast', 'SBP', 'DBP', 'HeartRate', 'TempC', 'TSH_mIU_L', 'FreeT4_ng_dL', 'FreeT3_pg_mL', 'TPOAb_IU_mL', 'TgAb_IU_mL', 'TRAb_IU_L', 'ESR_mm_hr', 'CRP_mg_L', 'TotalChol_mg_dL', 'LDL_mg_dL', 'HDL_mg_dL', 'Triglycerides_mg_dL', 'HbA1c_pct', 'VitaminD_25OH_ng_mL', 'Ferritin_ng_mL', 'Goiter', 'ThyroidNodules', 'TenderThyroid', 'ThyroidVolume_mL', 'OnLevothyroxine', 'LevothyroxineDose_mcg', 'OnAntithyroidDrug', 'OnBetaBlocker', 'SymptomScore', 'Fatigue', 'WeightGain', 'WeightLoss', 'ColdIntolerance', 'HeatIntolerance', 'Palpitations', 'Tremor', 'Constipation', 'Diarrhea', 'HairLoss', 'DrySkin', 'Anxiety', 'Depression', 'Insomnia', 'MenstrualIrregularity', 'Infertility', 'NeckSwelling', 'EyeSymptoms', 'PulsePressure']
cat_cols = ['Gender', 'SmokingStatus', 'AlcoholUse', 'PhysicalActivity', 'DietaryIodine', 'AntithyroidDrugType']
low_card_cols = ['Gender', 'SmokingStatus', 'AlcoholUse', 'PhysicalActivity', 'DietaryIodine', 'AntithyroidDrugType']
ohe_cols = ['Gender_Female', 'Gender_Male', 'SmokingStatus_Current', 'SmokingStatus_Former', 'SmokingStatus_Never', 'AlcoholUse_High', 'AlcoholUse_Moderate', 'PhysicalActivity_High', 'PhysicalActivity_Low', 'PhysicalActivity_Moderate', 'DietaryIodine_Adequate', 'DietaryIodine_High', 'DietaryIodine_Low', 'AntithyroidDrugType_Carbimazole', 'AntithyroidDrugType_Methimazole', 'AntithyroidDrugType_PTU']


class PatientData(BaseModel):
    patient_data: dict


@app.get("/")
def health():
    return {"status": "Thyroid model API is running"}


@app.post("/predict")
def get_prediction(patient: PatientData):
    try:
        patient_df = pd.DataFrame([patient.patient_data])

        # Compute derived feature
        patient_df['PulsePressure'] = patient_df['SBP'] - patient_df['DBP']

        # Fill any missing numeric columns with NaN so the imputer handles them
        for col in num_cols:
            if col not in patient_df.columns:
                patient_df[col] = np.nan

        # Fill any missing categorical columns with NaN so the imputer handles them
        for col in cat_cols:
            if col not in patient_df.columns:
                patient_df[col] = np.nan

        # Impute
        patient_df[num_cols] = num_imputer.transform(patient_df[num_cols])
        patient_df[cat_cols] = cat_imputer.transform(patient_df[cat_cols])

        # Encode categoricals
        patient_ohe = ohe_encoder.transform(patient_df[low_card_cols])
        patient_ohe_df = pd.DataFrame(patient_ohe, columns=ohe_cols, index=patient_df.index)

        # Scale numerics
        patient_scaled = scaler.transform(patient_df[num_cols])
        patient_scaled_df = pd.DataFrame(patient_scaled, columns=num_cols, index=patient_df.index)

        # Combine — make sure order matches training
        patient_final = pd.concat([patient_scaled_df, patient_ohe_df], axis=1)

        pred_probs = model.predict(patient_final)
        pred_class_index = np.argmax(pred_probs, axis=1)[0]
        confidence = float(np.max(pred_probs))
        predicted_illness = le.inverse_transform([pred_class_index])[0]

        return {
            "prediction": predicted_illness,
            "confidence": confidence
        }

    except Exception as e:
        import traceback
        return JSONResponse(status_code=500, content={
            "error": str(e),
            "trace": traceback.format_exc()
        })