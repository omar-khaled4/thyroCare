import streamlit as st
import pandas as pd
import numpy as np
import joblib
import keras
import os

# --- PAGE CONFIG ---
st.set_page_config(page_title="ThyroCare Prediction", layout="wide", page_icon="🩺")

# Custom CSS for a medical look
st.markdown("""
    <style>
    .main {
        background-color: #f5f7f9;
    }
    .stButton>button {
        width: 100%;
        border-radius: 5px;
        height: 3em;
        background-color: #007bff;
        color: white;
    }
    .stExpander {
        background-color: white;
        border-radius: 10px;
        margin-bottom: 10px;
    }
    </style>
    """, unsafe_allow_html=True)

st.title("🩺 ThyroCare: Neural Network Thyroid Prediction")
st.markdown("### Clinical Decision Support System")
st.markdown("Enter patient clinical data below to get a thyroid condition prediction based on our Neural Network model.")

# --- LOAD ARTIFACTS ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

@st.cache_resource
def load_assets():
    # Load model and preprocessing tools
    model = keras.saving.load_model(os.path.join(BASE_DIR, "medical_model.keras"))
    num_imputer = joblib.load(os.path.join(BASE_DIR, "num_imputer.pkl"))
    cat_imputer = joblib.load(os.path.join(BASE_DIR, "cat_imputer.pkl"))
    ohe_encoder = joblib.load(os.path.join(BASE_DIR, "ohe_encoder.pkl"))
    scaler = joblib.load(os.path.join(BASE_DIR, "scaler.pkl"))
    le = joblib.load(os.path.join(BASE_DIR, "label_encoder.pkl"))
    return model, num_imputer, cat_imputer, ohe_encoder, scaler, le

try:
    model, num_imputer, cat_imputer, ohe_encoder, scaler, le = load_assets()
except Exception as e:
    st.error(f"Critical Error: Could not load model artifacts. Please ensure all .pkl and .keras files are in the directory. \nDetails: {e}")
    st.stop()

# --- COLUMN DEFINITIONS ---
num_cols = ['Age', 'HeightCm', 'WeightKg', 'BMI', 'Pregnant', 'Postpartum_6mo', 'FamilyHistoryThyroid', 'PriorThyroidDisease', 'NeckRadiationHistory', 'ThyroidSurgeryHistory', 'Diabetes', 'Hypertension', 'Dyslipidemia', 'CKD', 'CAD', 'DepressionAnxietyDx', 'OtherAutoimmuneDx', 'OnAmiodarone', 'OnLithium', 'OnInterferon', 'OnGlucocorticoids', 'OnBiotinSupplement', 'RecentIodineContrast', 'SBP', 'DBP', 'HeartRate', 'TempC', 'TSH_mIU_L', 'FreeT4_ng_dL', 'FreeT3_pg_mL', 'TPOAb_IU_mL', 'TgAb_IU_mL', 'TRAb_IU_L', 'ESR_mm_hr', 'CRP_mg_L', 'TotalChol_mg_dL', 'LDL_mg_dL', 'HDL_mg_dL', 'Triglycerides_mg_dL', 'HbA1c_pct', 'VitaminD_25OH_ng_mL', 'Ferritin_ng_mL', 'Goiter', 'ThyroidNodules', 'TenderThyroid', 'ThyroidVolume_mL', 'OnLevothyroxine', 'LevothyroxineDose_mcg', 'OnAntithyroidDrug', 'OnBetaBlocker', 'SymptomScore', 'Fatigue', 'WeightGain', 'WeightLoss', 'ColdIntolerance', 'HeatIntolerance', 'Palpitations', 'Tremor', 'Constipation', 'Diarrhea', 'HairLoss', 'DrySkin', 'Anxiety', 'Depression', 'Insomnia', 'MenstrualIrregularity', 'Infertility', 'NeckSwelling', 'EyeSymptoms', 'PulsePressure']
cat_cols = ['Gender', 'SmokingStatus', 'AlcoholUse', 'PhysicalActivity', 'DietaryIodine', 'AntithyroidDrugType']
low_card_cols = ['Gender', 'SmokingStatus', 'AlcoholUse', 'PhysicalActivity', 'DietaryIodine', 'AntithyroidDrugType']
ohe_cols = ['Gender_Female', 'Gender_Male', 'SmokingStatus_Current', 'SmokingStatus_Former', 'SmokingStatus_Never', 'AlcoholUse_High', 'AlcoholUse_Moderate', 'PhysicalActivity_High', 'PhysicalActivity_Low', 'PhysicalActivity_Moderate', 'DietaryIodine_Adequate', 'DietaryIodine_High', 'DietaryIodine_Low', 'AntithyroidDrugType_Carbimazole', 'AntithyroidDrugType_Methimazole', 'AntithyroidDrugType_PTU']

# --- UI FORM ---
with st.form("prediction_form"):
    tab1, tab2, tab3 = st.tabs(["📝 Demographics & History", "🔬 Lab Results", "🔍 Symptoms & Exam"])
    
    with tab1:
        col1, col2 = st.columns(2)
        with col1:
            st.subheader("Basic Info")
            age = st.number_input("Age", 0, 120, 35)
            gender = st.selectbox("Gender", ["Female", "Male"])
            height = st.number_input("Height (cm)", 50.0, 250.0, 165.0)
            weight = st.number_input("Weight (kg)", 10.0, 300.0, 65.0)
            bmi = st.number_input("BMI", 5.0, 100.0, 23.9)
            
        with col2:
            st.subheader("Lifestyle")
            smoking = st.selectbox("Smoking Status", ["Never", "Former", "Current"])
            alcohol = st.selectbox("Alcohol Use", ["Moderate", "Low", "High"])
            activity = st.selectbox("Physical Activity", ["Moderate", "Low", "High"])
            iodine = st.selectbox("Dietary Iodine", ["Adequate", "Low", "High"])

        st.divider()
        st.subheader("Medical History")
        hcol1, hcol2, hcol3 = st.columns(3)
        with hcol1:
            pregnant = st.checkbox("Pregnant")
            postpartum = st.checkbox("Postpartum (6mo)")
            fam_history = st.checkbox("Family History Thyroid")
            prior_disease = st.checkbox("Prior Thyroid Disease")
        with hcol2:
            neck_rad = st.checkbox("Neck Radiation History")
            surg_history = st.checkbox("Thyroid Surgery History")
            diabetes = st.checkbox("Diabetes")
            hypertension = st.checkbox("Hypertension")
        with hcol3:
            ckd = st.checkbox("CKD")
            cad = st.checkbox("CAD")
            anxiety_dx = st.checkbox("Depression/Anxiety DX")
            autoimmune = st.checkbox("Other Autoimmune DX")

    with tab2:
        lcol1, lcol2 = st.columns(2)
        with lcol1:
            st.subheader("Thyroid Function")
            tsh = st.number_input("TSH (mIU/L)", 0.0, 200.0, 2.1)
            fT4 = st.number_input("Free T4 (ng/dL)", 0.0, 20.0, 1.1)
            fT3 = st.number_input("Free T3 (pg/mL)", 0.0, 30.0, 3.2)
            tpo = st.number_input("TPOAb (IU/mL)", 0.0, 2000.0, 15.0)
            tgab = st.number_input("TgAb (IU/mL)", 0.0, 2000.0, 15.0)
            trab = st.number_input("TRAb (IU/L)", 0.0, 50.0, 0.5)
            
        with lcol2:
            st.subheader("General Bloodwork")
            sbp = st.number_input("SBP", 50, 250, 120)
            dbp = st.number_input("DBP", 30, 150, 80)
            hr = st.number_input("Heart Rate", 30, 200, 75)
            temp = st.number_input("Temp (°C)", 34.0, 43.0, 36.7)
            esr = st.number_input("ESR (mm/hr)", 0.0, 150.0, 12.0)
            crp = st.number_input("CRP (mg/L)", 0.0, 100.0, 2.0)
            hba1c = st.number_input("HbA1c (%)", 3.0, 20.0, 5.5)

    with tab3:
        scol1, scol2 = st.columns(2)
        with scol1:
            st.subheader("Physical Examination")
            goiter = st.checkbox("Goiter")
            nodules = st.checkbox("Thyroid Nodules")
            tender = st.checkbox("Tender Thyroid")
            vol = st.number_input("Thyroid Volume (mL)", 0.0, 500.0, 15.0)
            st.divider()
            st.subheader("Medications")
            levo = st.checkbox("On Levothyroxine")
            levo_dose = st.number_input("Levothyroxine Dose (mcg)", 0.0, 500.0, 0.0)
            antithyroid = st.checkbox("On Antithyroid Drug")
            atd_type = st.selectbox("Antithyroid Drug Type", ["None", "Methimazole", "PTU", "Carbimazole"])
            beta_blocker = st.checkbox("On Beta Blocker")
            
        with scol2:
            st.subheader("Symptoms Severity (0-10)")
            symptom_score = st.slider("Global Symptom Score", 0, 10, 3)
            fatigue = st.slider("Fatigue", 0, 10, 0)
            wt_gain = st.slider("Weight Gain", 0, 10, 0)
            wt_loss = st.slider("Weight Loss", 0, 10, 0)
            cold_int = st.slider("Cold Intolerance", 0, 10, 0)
            palp = st.slider("Palpitations", 0, 10, 0)
            hair_loss = st.slider("Hair Loss", 0, 10, 0)
            dry_skin = st.slider("Dry Skin", 0, 10, 0)
            anxiety = st.slider("Anxiety", 0, 10, 0)
            insomnia = st.slider("Insomnia", 0, 10, 0)

    st.markdown("---")
    submitted = st.form_submit_button("🚀 Run Diagnostic Prediction")

if submitted:
    # 1. Map inputs to dataframe columns
    input_dict = {
        'Age': age, 'HeightCm': height, 'WeightKg': weight, 'BMI': bmi,
        'Gender': gender, 'SmokingStatus': smoking, 'AlcoholUse': alcohol,
        'PhysicalActivity': activity, 'DietaryIodine': iodine,
        'Pregnant': 1 if pregnant else 0, 'Postpartum_6mo': 1 if postpartum else 0,
        'FamilyHistoryThyroid': 1 if fam_history else 0, 'PriorThyroidDisease': 1 if prior_disease else 0,
        'NeckRadiationHistory': 1 if neck_rad else 0, 'ThyroidSurgeryHistory': 1 if surg_history else 0,
        'Diabetes': 1 if diabetes else 0, 'Hypertension': 1 if hypertension else 0,
        'Dyslipidemia': 0, 'CKD': 1 if ckd else 0, 'CAD': 1 if cad else 0, # Placeholder for Dyslipidemia if not in form
        'DepressionAnxietyDx': 1 if anxiety_dx else 0, 'OtherAutoimmuneDx': 1 if autoimmune else 0,
        'OnAmiodarone': 0, 'OnLithium': 0, 'OnInterferon': 0, 'OnGlucocorticoids': 0,
        'OnBiotinSupplement': 0, 'RecentIodineContrast': 0,
        'SBP': sbp, 'DBP': dbp, 'HeartRate': hr, 'TempC': temp,
        'TSH_mIU_L': tsh, 'FreeT4_ng_dL': fT4, 'FreeT3_pg_mL': fT3,
        'TPOAb_IU_mL': tpo, 'TgAb_IU_mL': tgab, 'TRAb_IU_L': trab,
        'ESR_mm_hr': esr, 'CRP_mg_L': crp, 'TotalChol_mg_dL': 190.0,
        'LDL_mg_dL': 110.0, 'HDL_mg_dL': 50.0, 'Triglycerides_mg_dL': 150.0,
        'HbA1c_pct': hba1c, 'VitaminD_25OH_ng_mL': 30.0, 'Ferritin_ng_mL': 50.0,
        'Goiter': 1 if goiter else 0, 'ThyroidNodules': 1 if nodules else 0,
        'TenderThyroid': 1 if tender else 0, 'ThyroidVolume_mL': vol,
        'OnLevothyroxine': 1 if levo else 0, 'LevothyroxineDose_mcg': levo_dose,
        'OnAntithyroidDrug': 1 if antithyroid else 0, 
        'AntithyroidDrugType': atd_type if atd_type != "None" else "Methimazole",
        'OnBetaBlocker': 1 if beta_blocker else 0, 'SymptomScore': symptom_score,
        'Fatigue': fatigue, 'WeightGain': wt_gain, 'WeightLoss': wt_loss,
        'ColdIntolerance': cold_int, 'HeatIntolerance': 0,
        'Palpitations': palp, 'Tremor': 0, 'Constipation': 0,
        'Diarrhea': 0, 'HairLoss': hair_loss, 'DrySkin': dry_skin,
        'Anxiety': anxiety, 'Depression': 0, 'Insomnia': insomnia,
        'MenstrualIrregularity': 0, 'Infertility': 0,
        'NeckSwelling': 0, 'EyeSymptoms': 0
    }
    
    # 2. Convert to DataFrame
    patient_df = pd.DataFrame([input_dict])
    
    # 3. Feature Engineering
    patient_df['PulsePressure'] = patient_df['SBP'] - patient_df['DBP']
    
    # 4. Handle Missing Columns (fill with 0 for safety)
    for col in num_cols:
        if col not in patient_df.columns: patient_df[col] = 0.0
    for col in cat_cols:
        if col not in patient_df.columns: patient_df[col] = "None"

    try:
        # 5. Preprocessing
        # Imputation
        patient_df[num_cols] = num_imputer.transform(patient_df[num_cols])
        patient_df[cat_cols] = cat_imputer.transform(patient_df[cat_cols])
        
        # Encoding
        patient_ohe = ohe_encoder.transform(patient_df[low_card_cols])
        patient_ohe_df = pd.DataFrame(patient_ohe, columns=ohe_cols, index=patient_df.index)
        
        # Scaling
        patient_scaled = scaler.transform(patient_df[num_cols])
        patient_scaled_df = pd.DataFrame(patient_scaled, columns=num_cols, index=patient_df.index)
        
        # Merge
        patient_final = pd.concat([patient_scaled_df, patient_ohe_df], axis=1)
        
        # 6. Prediction
        with st.spinner("Analyzing physiological patterns..."):
            pred_probs = model.predict(patient_final)
            pred_class_index = np.argmax(pred_probs, axis=1)[0]
            predicted_illness = le.inverse_transform([pred_class_index])[0]
            confidence = np.max(pred_probs) * 100

        # 7. Results Display
        st.markdown("---")
        res_col1, res_col2 = st.columns([2, 1])
        
        with res_col1:
            st.success(f"## **Result: {predicted_illness}**")
            st.write(f"The model has identified patterns consistent with **{predicted_illness}**.")
            
        with res_col2:
            st.metric("Confidence", f"{confidence:.1f}%")
            
        if "Negative" in predicted_illness:
            st.balloons()
            st.info("The model indicates a healthy thyroid profile.")
        else:
            st.warning("⚠️ **Medical Advice Required**: This is an AI-generated prediction. Please consult a qualified endocrinologist for clinical diagnosis.")

    except Exception as e:
        st.error(f"Prediction Error: {e}")

st.sidebar.markdown("### About")
st.sidebar.info("This tool uses a Deep Learning Neural Network trained on synthetic thyroid patient data. It processes 86 clinical features to categorize potential thyroid disorders.")
st.sidebar.caption("v1.0.0 | ThyroCare AI")
