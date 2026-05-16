import api from "./api";
import toast from "react-hot-toast";

/* ── Lab results ── */

export async function fetchLabResult(type) {
  try {
    const { data } = await api.get(`/lab-results/${type}`);
    return data;
  } catch (err) {
    // Don't spam toasts; individual components handle the empty state
    console.error(`Failed to load ${type} results:`, err);
    return [];
  }
}

export async function addLabResult(type, date, value) {
  try {
    const { data } = await api.post(`/lab-results/${type}`, { date, value });
    return data;
  } catch (err) {
    toast.error(`Failed to add ${type} record.`);
    throw err;
  }
}

export async function updateLabResult(type, date, value) {
  try {
    const { data } = await api.put(`/lab-results/${type}`, { date, value });
    return data;
  } catch (err) {
    toast.error(`Failed to update ${type} record.`);
    throw err;
  }
}

export async function deleteLabResult(type, date) {
  try {
    await api.delete(`/lab-results/${type}`, { params: { date } });
  } catch (err) {
    toast.error(`Failed to delete ${type} record.`);
    throw err;
  }
}

/* ── Normalise a single lab-result row ──

  Accepts either { date, value } (Postman body example) or
  { date, t3/t4/tsh } (already-normalised field name).
  Returns the row keyed by the requested type key: { date, t3|t4|tsh }
  ─────────────────────────────────────────────────────────────────────── */
function normaliseLabResultRow(type, raw) {
  const key = type.toLowerCase(); // "t3" | "t4" | "tsh"
  return {
    date: raw.date,
    [key]:
      raw[key] ??          // already-keyed  { date, t3 }
      raw.value ??          // flat           { date, value }
      0,
  };
}

/* ── Fetch a single type ── */
async function fetchLabResultRow(type) {
  const raw = await fetchLabResult(type);
  return (Array.isArray(raw) ? raw : []).map((row) =>
    normaliseLabResultRow(type, row)
  );
}

/* ── Symptoms ── */

export async function fetchSymptoms() {
  try {
    const { data } = await api.get("/symptoms");
    return (Array.isArray(data) ? data : []).map((row) => ({
      date: row.date,
      fatigue: Number(row.fatigue) || 0,
      anxiety: Number(row.anxiety) || 0,
      insomnia: Number(row.insomnia) || 0,
      hairLoss: Number(row.hairLoss) || 0,
      palpitations: Number(row.palpitations) || 0,
      coldIntolerance: Number(row.coldIntolerance) || 0,
    }));
  } catch (err) {
    return [];
  }
}

/* ── Profile (extracts the medicalInfo fields the Dashboard uses) ── */

export async function fetchProfile() {
  try {
    const { data } = await api.get("/profile");
    return data;
  } catch (err) {
    return null;
  }
}

/* ── NN Predictions ── */

export async function fetchPredictionHistory() {
  try {
    const { data } = await api.get("/predict/history");
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Failed to load prediction history:", err);
    return [];
  }
}

export async function fetchLatestPrediction() {
  const all = await fetchPredictionHistory();
  return all.sort(
    (a, b) =>
      new Date(b.createdAt || b.created_at || 0) -
      new Date(a.createdAt || a.created_at || 0)
  )[0] || null;
}

/* ── Convenience: fetch everything in parallel ── */

export async function fetchDashboardData() {
  console.log("[dashboardService] Starting parallel dashboard data fetch...");
  try {
    const [t3, t4, tsh, symptoms, profile, latestPrediction] = await Promise.all([
      fetchLabResultRow("t3").then(d => { console.log("[dashboardService] T3 fetched"); return d; }),
      fetchLabResultRow("t4").then(d => { console.log("[dashboardService] T4 fetched"); return d; }),
      fetchLabResultRow("tsh").then(d => { console.log("[dashboardService] TSH fetched"); return d; }),
      fetchSymptoms().then(d => { console.log("[dashboardService] Symptoms fetched"); return d; }),
      fetchProfile().then(d => { console.log("[dashboardService] Profile fetched"); return d; }),
      fetchLatestPrediction().then(d => { console.log("[dashboardService] Latest Prediction fetched"); return d; }),
    ]);
    console.log("[dashboardService] All dashboard data successfully combined.");
    return { t3, t4, tsh, symptoms, profile, latestPrediction };
  } catch (err) {
    console.error("[dashboardService] Dashboard fetch failed:", err.message);
    throw err;
  }
}