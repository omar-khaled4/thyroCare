import api from "./api";
import toast from "react-hot-toast";

/* ────────────────────────────────────────────────────────────────────────────
 *  AI Chat
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * POST /chat
 * Sends a user message and returns the AI assistant response.
 *
 * @param {string} message
 * @returns {Promise<{ response: string }>}
 */
export async function postChat(message) {
  const toastId = toast.loading("Aiva is typing…", { id: "chat" });
  try {
    const { data } = await api.post("/chat", { message });
    toast.dismiss(toastId);
    return data;
  } catch (err) {
    toast.dismiss(toastId);
    toast.error("Failed to get a response. Please try again.");
    throw err;
  }
}

/* ────────────────────────────────────────────────────────────────────────────
 *  NN Predictions
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * Build patient_data from report form values and user profile.
 */
function buildPatientData(reportData, user) {
  /* ── helpers ── */
  const now = new Date();
  const dob =
    user?.dateOfBirth || user?.birthday || user?.profile?.birthday || null;
  const age = dob
    ? Math.max(0, now.getFullYear() - new Date(String(dob).slice(0, 10)).getFullYear())
    : null;

  const tf = reportData?.thyroidFunction || {};
  const ab = reportData?.antibodies || {};
  const ot = reportData?.otherTests || {};
  const sym = reportData?.symptoms || {};

  /* ── return the flat object expected by the backend ── */
  return {
    /* ── personal / physical ── */
    HeightCm: 170,
    WeightKg: 70,
    BMI: 24.2,
    Age: age,

    /* ── lifestyle (best-effort defaults — unknown to frontend) ── */
    SmokingStatus: "Never",
    AlcoholUse: "Rare",
    PhysicalActivity: "Light",
    DietaryIodine: "Adequate",
    Pregnant: 0,
    Postpartum_6mo: 0,

    /* ── clinical history ── */
    FamilyHistoryThyroid: 0,
    PriorThyroidDisease: 0,
    NeckRadiationHistory: 0,
    ThyroidSurgeryHistory: 0,
    Diabetes: 0,
    Hypertension: 0,
    Dyslipidemia: 0,
    CKD: 0,
    CAD: 0,
    DepressionAnxietyDx: 0,
    OtherAutoimmuneDx: 0,

    /* ── current medications ── */
    OnAmiodarone: 0,
    OnLithium: 0,
    OnInterferon: 0,
    OnGlucocorticoids: 0,
    OnBiotinSupplement: 0,
    RecentIodineContrast: 0,

    /* ── vitals (unknown to frontend — safe defaults) ── */
    SBP: 120,
    DBP: 80,
    HeartRate: 72,
    TempC: 36.6,

    /* ── labs (unknown to frontend — safe defaults) ── */
    ESR_mm_hr: 12,
    CRP_mg_L: 2,
    TotalChol_mg_dL: 190,
    LDL_mg_dL: 110,
    HDL_mg_dL: 55,
    Triglycerides_mg_dL: 130,
    HbA1c_pct: 5.5,
    VitaminD_25OH_ng_mL: 30,
    Ferritin_ng_mL: 80,

    /* ── thyroid exam (unknown to frontend — safe defaults) ── */
    Goiter: 0,
    ThyroidNodules: 0,
    TenderThyroid: 0,
    ThyroidVolume_mL: 15,

    /* ── thyroid-specific: mapped from the report form ── */
    OnLevothyroxine:
      (user?.medicalInfo?.medication || "").toLowerCase().includes("levo") ? 1 : 0,
    LevothyroxineDose_mcg: 0,
    TSH: tf.tsh ?? null,
    FreeT3: tf.freeT3 ?? null,
    FreeT4: tf.freeT4 ?? null,
    TotalT4: tf.totalT4 ?? null,
    TPOAb: ab.tpo ?? null,
    TgAb: ab.antiTg ?? null,
    TRAb: ab.tshr ?? null,

    /* ── symptom scores from insert report ── */
    Fatigue: sym.fatigue ?? 0,
    WeightGain: 0,
    WeightLoss: 0,
    HeatIntolerance: 0,
    Tremor: 0,
    Constipation: 0,
    Diarrhea: 0,
    DrySkin: 0,
    HairLoss: sym.hairLoss ?? 0,
    Anxiety: sym.anxiety ?? 0,
    Insomnia: sym.insomnia ?? 0,
    Depression: 0,
    MenstrualIrregularity: 0,
    Infertility: 0,
    NeckSwelling: 0,
    EyeSymptoms: 0,
    Palpitations: sym.palpitations ?? 0,
    ColdIntolerance: sym.coldIntolerance ?? 0,
    SymptomScore:
      Number(sym.fatigue ?? 0) +
      Number(sym.weightChange ?? 0) +
      Number(sym.coldIntolerance ?? 0) +
      Number(sym.hairLoss ?? 0) +
      Number(sym.palpitations ?? 0) +
      Number(sym.anxiety ?? 0) +
      Number(sym.insomnia ?? 0),
  };
}

/**
 * POST /predict
 *
 * Sends patient data to the neural-network model endpoint and returns a thyroid
 * diagnosis prediction together with a health-stability score for the dashboard.
 *
 * @param {Object} reportData      - Raw Formik values from InsertReport
 * @param {Object} [user]          - Current user object (for demographics / medical)
 * @returns {Promise<{
 *   predictionId: string,
 *   diagnosis:    string,
 *   confidence:   number,
 *   healthScore:  number,
 *   reportData:   Object,
 *   createdAt:    string
 * }>}
 * @throws {Error} If the request fails
 */
export async function postPredict(reportData, user) {
  const toastId = toast.loading("Running analysis…", { id: "predict" });
  try {
    const patientData = buildPatientData(reportData, user);
    const { data } = await api.post("/predict", { patient_data: patientData });
    console.log("[chatService] postPredict raw data:", data);
    toast.dismiss(toastId);
    toast.success("Analysis complete!", { id: "predict" });
    // The backend uses a 'respond' helper that puts the payload in the 'data' field
    const result = data.data || data;
    console.log("[chatService] postPredict returning:", result);
    return result;
  } catch (err) {
    toast.dismiss(toastId);
    toast.error("Prediction failed. Please check your inputs and try again.");
    throw err;
  }
}
