from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
import keras


app = FastAPI()



model = keras.saving.load_model("medical_model.keras")
num_imputer = joblib.load("num_imputer.pkl")
cat_imputer = joblib.load("cat_imputer.pkl")
ohe_encoder = joblib.load("ohe_encoder.pkl")
scaler = joblib.load("scaler.pkl")
le = joblib.load("label_encoder.pkl")


num_cols = ['Age', 'HeightCm', 'WeightKg', 'BMI', 'Pregnant', 'Postpartum_6mo', 'FamilyHistoryThyroid', 'PriorThyroidDisease', 'NeckRadiationHistory', 'ThyroidSurgeryHistory', 'Diabetes', 'Hypertension', 'Dyslipidemia', 'CKD', 'CAD', 'DepressionAnxietyDx', 'OtherAutoimmuneDx', 'OnAmiodarone', 'OnLithium', 'OnInterferon', 'OnGlucocorticoids', 'OnBiotinSupplement', 'RecentIodineContrast', 'SBP', 'DBP', 'HeartRate', 'TempC', 'TSH_mIU_L', 'FreeT4_ng_dL', 'FreeT3_pg_mL', 'TPOAb_IU_mL', 'TgAb_IU_mL', 'TRAb_IU_L', 'ESR_mm_hr', 'CRP_mg_L', 'TotalChol_mg_dL', 'LDL_mg_dL', 'HDL_mg_dL', 'Triglycerides_mg_dL', 'HbA1c_pct', 'VitaminD_25OH_ng_mL', 'Ferritin_ng_mL', 'Goiter', 'ThyroidNodules', 'TenderThyroid', 'ThyroidVolume_mL', 'OnLevothyroxine', 'LevothyroxineDose_mcg', 'OnAntithyroidDrug', 'OnBetaBlocker', 'SymptomScore', 'Fatigue', 'WeightGain', 'WeightLoss', 'ColdIntolerance', 'HeatIntolerance', 'Palpitations', 'Tremor', 'Constipation', 'Diarrhea', 'HairLoss', 'DrySkin', 'Anxiety', 'Depression', 'Insomnia', 'MenstrualIrregularity', 'Infertility', 'NeckSwelling', 'EyeSymptoms', 'PulsePressure']
cat_cols = ['Gender', 'SmokingStatus', 'AlcoholUse', 'PhysicalActivity', 'DietaryIodine', 'AntithyroidDrugType']
low_card_cols = ['Gender', 'SmokingStatus', 'AlcoholUse', 'PhysicalActivity', 'DietaryIodine', 'AntithyroidDrugType']
ohe_cols = ['Gender_Female', 'Gender_Male', 'SmokingStatus_Current', 'SmokingStatus_Former', 'SmokingStatus_Never', 'AlcoholUse_High', 'AlcoholUse_Moderate', 'PhysicalActivity_High', 'PhysicalActivity_Low', 'PhysicalActivity_Moderate', 'DietaryIodine_Adequate', 'DietaryIodine_High', 'DietaryIodine_Low', 'AntithyroidDrugType_Carbimazole', 'AntithyroidDrugType_Methimazole', 'AntithyroidDrugType_PTU']


class PatientData(BaseModel):
    patient_data: dict


@app.post("/predict")
def get_prediction(patient: PatientData):
    patient_df = pd.DataFrame([patient.patient_data])
    
    
    patient_df['PulsePressure'] = patient_df['SBP'] - patient_df['DBP']
    
    patient_df[num_cols] = num_imputer.transform(patient_df[num_cols])
    patient_df[cat_cols] = cat_imputer.transform(patient_df[cat_cols])
    
    patient_ohe = ohe_encoder.transform(patient_df[low_card_cols])
    patient_ohe_df = pd.DataFrame(patient_ohe, columns=ohe_cols, index=patient_df.index)
    
    patient_scaled = scaler.transform(patient_df[num_cols])
    patient_scaled_df = pd.DataFrame(patient_scaled, columns=num_cols, index=patient_df.index)
    
    patient_final = pd.concat([patient_scaled_df, patient_ohe_df], axis=1)
    
    
    pred_probs = model.predict(patient_final)
    pred_class_index = np.argmax(pred_probs, axis=1)[0]
    
    predicted_illness = le.inverse_transform([pred_class_index])[0]
    
    return {"prediction": predicted_illness}