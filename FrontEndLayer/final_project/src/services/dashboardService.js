import api from "./api";
import toast from "react-hot-toast";

/* ── Lab results ── */

export async function fetchLabResult(type) {
  try {
    const { data } = await api.get(`/lab-results/${type}`);
    return data;
  } catch (err) {
    
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

function normaliseLabResultRow(type, raw) {
  const key = type.toLowerCase();
  return {
    date: raw.date,
    [key]: raw[key] ?? raw.value ?? 0,
  };
}

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

/* ── Profile ── */

export async function fetchProfile() {
  try {
    const { data } = await api.get("/auth/me");
    
    // Backend returns { success: true, data: user, message: "" }
    return data.data || data;
  } catch (err) {
    
    return null;
  }
}

/* ── NN Predictions ── */

export async function fetchPredictionHistory() {
  try {
    const res = await api.get("/predict/history");
    
    

    // Handle both { data: [...] } and plain array responses
    const arr = Array.isArray(res.data)
      ? res.data
      : Array.isArray(res.data?.data)
        ? res.data.data
        : [];

    
    
    return arr;
  } catch (err) {
    
    return [];
  }
}

export async function fetchLatestPrediction() {
  
  const all = await fetchPredictionHistory();

  

  if (!all.length) {
    
    return null;
  }

  const sorted = all.sort(
    (a, b) =>
      new Date(b.createdAt || b.created_at || 0) -
      new Date(a.createdAt || a.created_at || 0)
  );

  const latest = sorted[0];
  
  
  
  
  
  

  return latest;
}

/* ── Convenience: fetch everything in parallel ── */

export async function fetchDashboardData() {
  
  try {
    const [reportsRes, profile, latestPrediction] = await Promise.all([
      api.get("/reports"),
      fetchProfile(),
      fetchLatestPrediction()
    ]);

    
    

    const reports = Array.isArray(reportsRes.data)
      ? reportsRes.data
      : reportsRes.data?.data || [];

    

    const t3 = reports
      .filter(r => r.thyroidFunction?.freeT3 !== undefined)
      .map(r => ({ date: r.testDate, t3: r.thyroidFunction.freeT3 }));

    const t4 = reports
      .filter(r => r.thyroidFunction?.freeT4 !== undefined)
      .map(r => ({ date: r.testDate, t4: r.thyroidFunction.freeT4 }));

    const tsh = reports
      .filter(r => r.thyroidFunction?.tsh !== undefined)
      .map(r => ({ date: r.testDate, tsh: r.thyroidFunction.tsh }));

    const symptoms = reports
      .filter(r => r.symptoms)
      .map(r => ({
        date: r.testDate,
        fatigue: Number(r.symptoms.fatigue) || 0,
        anxiety: Number(r.symptoms.anxiety) || 0,
        insomnia: Number(r.symptoms.insomnia) || 0,
        hairLoss: Number(r.symptoms.hairLoss) || 0,
        palpitations: Number(r.symptoms.palpitations) || 0,
        coldIntolerance: Number(r.symptoms.coldIntolerance) || 0,
      }));

    const result = { t3, t4, tsh, symptoms, profile, latestPrediction };
    
    

    return result;
  } catch (err) {
    
    throw err;
  }
}