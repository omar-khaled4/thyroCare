/**
 * dashboardService.js
 *
 * Dashboard-specific API calls, routed through the shared `api` Axios instance.
 * Endpoints (Postman collection — ThyroCare.postman_collection.json):
 *
 *   Lab Results
 *     GET  /lab-results/t3    → [{ date: "YYYY-MM-DD", value: <num> }]
 *     GET  /lab-results/t4    → [{ date: "YYYY-MM-DD", value: <num> }]
 *     GET  /lab-results/tsh   → [{ date: "YYYY-MM-DD", value: <num> }]
 *
 *   Symptoms
 *     GET  /symptoms          → [{ date, fatigue, anxiety, insomnia,
 *                                 hairLoss, palpitations, coldIntolerance }]
 *
 *   Profile (info-cards data)
 *     GET  /profile           → { name, medicalInfo: { condition, status,
 *                                medication, dosage, refillDaysLeft,
 *                                doctor, nextAppointment } }
 *
 * Every function returns a plain JSOO object tree on success, or an empty
 * array / null on any error (no thrown exception — the caller decides how
 * to display loading / empty / error states).
 */

import api from "./api";

/* ── Lab-Result helpers ── */

/**
 * Maps a flat { date, value } row to the chart-friendly shape and rounds the
 * lab value to 1 decimal place.
 *
 * @param {string} date
 * @param {number} value
 * @param {string} keyField  Property name for the value, e.g. "t3"
 * @returns {{ date: string, [keyField]: number }}
 */
function normaliseLabResult(date, value, keyField) {
  return { date, [keyField]: Math.round(Number(value) * 10) / 10 };
}

/**
 * Calls `/lab-results/{type}`, normalises every record, and falls back to an
 * empty array on error.
 *
 * @param {string} path       e.g. "lab-results/t3"
 * @param {string} keyField   e.g. "t3"
 * @returns {Promise<Array<{date: string, [keyField]: number}>>}
 */
async function fetchLabResultRow(path, keyField) {
  try {
    const { data } = await api.get(`/${path}`);
    if (!Array.isArray(data)) return [];
    return data.map((row) =>
      normaliseLabResult(
        row.date,
        row.value ?? row[keyField],
        keyField
      )
    );
  } catch (_) {
    return [];
  }
}

/* ── Symptoms helper ── */

/**
 * GET /symptoms response normaliser.
 * Clamps each severity score to the 0-10 range expected by the Radar chart.
 *
 * @param {Array} raw      Raw symptom array from the API
 * @returns {Array}        Normalised array
 */
function normaliseSymptoms(raw) {
  const clamp = (v) => {
    const n = Number(v);
    return isNaN(n) ? 0 : Math.max(0, Math.min(10, Math.round(n)));
  };

  return (raw || []).map((row) => ({
    date:             String(row.date).slice(0, 10),
    fatigue:          clamp(row.fatigue),
    anxiety:          clamp(row.anxiety),
    insomnia:         clamp(row.insomnia),
    hairLoss:         clamp(row.hairLoss),
    palpitations:     clamp(row.palpitations),
    coldIntolerance:  clamp(row.coldIntolerance),
  }));
}

/* ──────────────────────────────────────────────────────────────────────────
 * Public API
 * ────────────────────────────────────────────────────────────────────────── */

/** GET /lab-results/t3  →  [{ date, t3 }] */
export async function fetchT3() {
  return fetchLabResultRow("lab-results/t3", "t3");
}

/** GET /lab-results/t4  →  [{ date, t4 }] */
export async function fetchT4() {
  return fetchLabResultRow("lab-results/t4", "t4");
}

/** GET /lab-results/tsh  →  [{ date, tsh }] */
export async function fetchTSH() {
  return fetchLabResultRow("lab-results/tsh", "tsh");
}

/**
 * GET /symptoms
 * @returns {Promise<Array<{
 *   date:             string,
 *   fatigue:          number,
 *   anxiety:          number,
 *   insomnia:         number,
 *   hairLoss:         number,
 *   palpitations:     number,
 *   coldIntolerance:  number
 * }>>}
 */
export async function fetchSymptoms() {
  try {
    const { data } = await api.get("/symptoms");
    return normaliseSymptoms(Array.isArray(data) ? data : []);
  } catch (_) {
    return [];
  }
}

/**
 * GET /profile  — used by Dashboard info-cards: condition, medication,
 * appointment, next-appointment, doctor, dosage, refill info.
 *
 * The GET /profile request is sent automatically by the Axios request
 * interceptor (it adds `Authorization: Bearer <token>`), so no manual
 * header handling is needed here.
 *
 * @returns {Promise<{
 *   name:           string,
 *   medicalInfo: {
 *     condition:         string,
 *     status:            string,
 *     medication:        string,
 *     dosage:            string,
 *     refillDaysLeft:    number,
 *     doctor:            string,
 *     nextAppointment:   string
 *   }
 * } | null>}  — null if the request fails or the user is unauthenticated.
 */
export async function fetchProfile() {
  try {
    const { data } = await api.get("/profile");
    return data;
  } catch (_) {
    return null;
  }
}

/**
 * GET /predict/history
 * Returns all past NN-model predictions for the logged-in patient, sorted
 * newest first by the backend.  The large `inputData` field is already
 * stripped by the backend, so the response is lightweight.
 *
 * @returns {Promise<Array<{
 *   predictionId:  string,
 *   diagnosis:     string,
 *   confidence:    number,
 *   healthScore:   number,   ← mapped to the Dashboard gauge
 *   createdAt:     string     ISO date string
 * }>>}
 */
export async function fetchPredictionHistory() {
  try {
    const { data } = await api.get("/predict/history");
    return Array.isArray(data) ? data : [];
  } catch (_) {
    return [];
  }
}

/**
 * Convenience: returns the single most recent prediction record, or null
 * if the patient has never run the NN model.
 *
 * @returns {Promise<{
 *   predictionId:  string,
 *   diagnosis:     string,
 *   confidence:    number,
 *   healthScore:   number,
 *   createdAt:     string
 * } | null>}
 */
export async function fetchLatestPrediction() {
  const history = await fetchPredictionHistory();
  return history.length > 0 ? history[0] : null;
}

/**
 * Convenience helper: fetch everything the Dashboard needs in a single call.
 * All requests are dispatched in parallel.
 *
 * @returns {Promise<{
 *   t3:        Array<{date:string, t3:number}>,
 *   t4:        Array<{date:string, t4:number}>,
 *   tsh:       Array<{date:string, tsh:number}>,
 *   symptoms:  Array,
 *   profile:   object | null,
 *   latestPrediction: { diagnosis, confidence, healthScore, createdAt, predictionId } | null
 * }>}
 */
export async function fetchDashboardData() {
  const [t3, t4, tsh, symptoms, profile, latestPrediction] =
    await Promise.all([
      fetchT3(),
      fetchT4(),
      fetchTSH(),
      fetchSymptoms(),
      fetchProfile(),
      fetchLatestPrediction(),
    ]);
  return { t3, t4, tsh, symptoms, profile, latestPrediction };
}