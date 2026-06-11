import api from "./api";
import toast from "react-hot-toast";

/* ────────────────────────────────────────────────────────────────────────────
 *  AI Chat — Conversations & Messages
 * ──────────────────────────────────────────────────────────────────────────── */

export async function postChat(message, conversationId, imageBase64 = null) {
  const body = { message, conversationId };
  if (imageBase64) body.imageBase64 = imageBase64;
  const { data } = await api.post("/chat", body);
  return data.data.reply;
}

export async function getConversations() {
  const { data } = await api.get("/chat/conversations");
  return data.data || [];
}

export async function getConversationMessages(conversationId) {
  const { data } = await api.get(`/chat/conversations/${conversationId}`);
  return data.data || [];
}

export async function deleteConversation(conversationId) {
  await api.delete(`/chat/conversations/${conversationId}`);
}

/* ────────────────────────────────────────────────────────────────────────────
 *  NN Predictions
 * ──────────────────────────────────────────────────────────────────────────── */

function buildPatientData(reportData, user) {
  const now = new Date();
  const dob = user?.dateOfBirth || user?.birthday || user?.profile?.birthday || null;
  const age = dob
    ? Math.max(0, now.getFullYear() - new Date(String(dob).slice(0, 10)).getFullYear())
    : null;

  const tf = reportData?.thyroidFunction || {};
  const ab = reportData?.antibodies || {};
  const sym = reportData?.symptoms || {};

  return {
    HeightCm: 170, WeightKg: 70, BMI: 24.2, Age: age,
    SmokingStatus: "Never", AlcoholUse: "Moderate", PhysicalActivity: "Moderate",
    DietaryIodine: "Adequate", Pregnant: 0, Postpartum_6mo: 0,
    FamilyHistoryThyroid: 0, PriorThyroidDisease: 0, NeckRadiationHistory: 0,
    ThyroidSurgeryHistory: 0, Diabetes: 0, Hypertension: 0, Dyslipidemia: 0,
    CKD: 0, CAD: 0, DepressionAnxietyDx: 0, OtherAutoimmuneDx: 0,
    OnAmiodarone: 0, OnLithium: 0, OnInterferon: 0, OnGlucocorticoids: 0,
    OnBiotinSupplement: 0, RecentIodineContrast: 0,
    SBP: 120, DBP: 80, HeartRate: 72, TempC: 36.6,
    ESR_mm_hr: 12, CRP_mg_L: 2, TotalChol_mg_dL: 190, LDL_mg_dL: 110,
    HDL_mg_dL: 55, Triglycerides_mg_dL: 130, HbA1c_pct: 5.5,
    VitaminD_25OH_ng_mL: 30, Ferritin_ng_mL: 80,
    Goiter: 0, ThyroidNodules: 0, TenderThyroid: 0, ThyroidVolume_mL: 15,
    OnLevothyroxine: (user?.medicalInfo?.medication || "").toLowerCase().includes("levo") ? 1 : 0,
    LevothyroxineDose_mcg: 0,
    TSH: tf.tsh ?? null, FreeT3: tf.freeT3 ?? null, FreeT4: tf.freeT4 ?? null,
    TotalT4: tf.totalT4 ?? null, TPOAb: ab.tpo ?? null,
    TgAb: ab.antiTg ?? null, TRAb: ab.tshr ?? null,
    Fatigue: sym.fatigue ?? 0, WeightGain: 0, WeightLoss: 0,
    HeatIntolerance: 0, Tremor: 0, Constipation: 0, Diarrhea: 0,
    DrySkin: 0, HairLoss: sym.hairLoss ?? 0, Anxiety: sym.anxiety ?? 0,
    Insomnia: sym.insomnia ?? 0, Depression: 0, MenstrualIrregularity: 0,
    Infertility: 0, NeckSwelling: 0, EyeSymptoms: 0,
    Palpitations: sym.palpitations ?? 0, ColdIntolerance: sym.coldIntolerance ?? 0,
    SymptomScore:
      Number(sym.fatigue ?? 0) + Number(sym.weightChange ?? 0) +
      Number(sym.coldIntolerance ?? 0) + Number(sym.hairLoss ?? 0) +
      Number(sym.palpitations ?? 0) + Number(sym.anxiety ?? 0) +
      Number(sym.insomnia ?? 0),
  };
}

export async function postPredict(reportData, user) {
  const toastId = toast.loading("Running analysis…", { id: "predict" });
  try {
    const patientData = buildPatientData(reportData, user);
    const { data } = await api.post("/predict", { patient_data: patientData });
    toast.dismiss(toastId);
    toast.success("Analysis complete!", { id: "predict" });
    return data.data || data;
  } catch (err) {
    toast.dismiss(toastId);
    toast.error("Prediction failed. Please check your inputs and try again.");
    throw err;
  }
}