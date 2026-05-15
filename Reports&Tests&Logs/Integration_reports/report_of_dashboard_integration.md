# Dashboard Integration Report — Step 5

> **Date:** 2026-05-16
> **Step:** 5 — Dashboard Integration
> **Status:** ✅ Complete

---

## 1. Summary

Step 5 of the ThyroCare FrontEnd integration replaces every hardcoded data source in `Dashboard.jsx` with live API calls backed by the existing Axios service layer. The NN prediction endpoint (`GET /predict/history` → most recent record) is now also wired, so the Health Stability gauge and the Current Condition card display live model output instead of hardcoded values.

**What was implemented:**

| Area | What changed |
|---|---|
| **API service** | New `dashboardService.js` added to `src/services/` |
| **Lab result charts** | T3, T4, TSH chart state arrays now populated by `GET /lab-results/{type}` instead of hardcoded arrays |
| **Symptom tracker** | Radar chart data now populated by `GET /symptoms` instead of hardcoded array |
| **Info cards (3 of 5)** | Current Condition, Medication Status, Next Appointment sourced from `GET /profile` |
| **Health Stability gauge** | `%` value now sourced from `healthScore` field on the most recent `GET /predict/history` record; falls back to `82` when no prediction exists |
| **Condition label** | Diagnosis name now sourced from `diagnosis` field in the latest prediction record (falls back to `profile.medicalInfo.condition`) |
| **Condition subline** | Shows `Confidence: NN%` when a prediction record exists, otherwise shows `profile.medicalInfo.status` |
| **Loading state** | Six independent `useState` boolean flags (`T3loaded`, `T4loaded`, `TSHloaded`, `SymptomsLoaded`, `ProfileLoaded`, `PredictionLoaded`) allow partial renders while individual endpoints are pending |
| **Empty state** | Per-chart empty-state components (`EmptyChartState`, `EmptyRadarState`) display a helpful message when an endpoint returns `[]` |
| **Bug fix** | TypeScript type annotation `: HTMLStyleElement | null` on `_skeletonStyleTag` (a `.jsx` file) replaced with JavaScript `let _skeletonStyleTag = null;` |

---

## 2. Files Created / Modified

### 2.1 Created

| File | Purpose |
|---|---|
| `FrontEndLayer/final_project/src/services/dashboardService.js` | New service module — wraps all five Dashboard data calls plus two prediction helpers |

### 2.2 Modified

| File | Nature of change |
|---|---|
| `FrontEndLayer/final_project/src/components/Dashboard/Dashboard.jsx` | Full rewrite — all hardcoded chart arrays and info-card values swapped for API hooks; skeleton / empty-state components added; `handleDownloadPDF` wired; `fetchLatestPrediction` added to fetch bundle; gauge and condition card now consume live prediction data; `_skeletonStyleTag` type annotation removed |

### 2.3 Unchanged (used as-is)

| File | Note |
|---|---|
| `FrontEndLayer/final_project/src/services/api.js` | Axios instance — already present from Step 3 |
| `FrontEndLayer/final_project/src/services/authService.js` | Auth service — unchanged |
| `FrontEndLayer/final_project/src/services/reportService.js` | Reports service — unchanged |
| `FrontEndLayer/final_project/src/context/UserContext.jsx` | Auth context — unchanged |

---

## 3. Endpoints Wired

### 3.1 Lab Results (ApexCharts charts)

| Method | Path | Chart | Wires |
|---|---|---|---|
| `GET` | `/lab-results/t3` | T3 Levels (vertical bar) | `fetchT3()` → `setT3data()` |
| `GET` | `/lab-results/t4` | T4 Levels (horizontal bar) | `fetchT4()` → `setT4data()` |
| `GET` | `/lab-results/tsh` | TSH Levels (area / datetime) | `fetchTSH()` → `setTSHdata()` |

**Response format normalised:** the Postman body example uses `{date, value}` — `dashboardService.js` maps this to `{date, t3} / {date, t4} / {date, tsh}` via `normaliseLabResult()` in `fetchLabResultRow()`.

### 3.2 Symptoms (Symptom Tracker radar)

| Method | Path | Wires |
|---|---|---|
| `GET` | `/symptoms` | `fetchSymptoms()` → `setSTdata()` |

Response `{date, fatigue, anxiety, insomnia, hairLoss, palpitations, coldIntolerance}` accepted directly; each severity score clamped to 0–10 to match the Radar chart `yaxis` domain.

### 3.3 Profile (info cards)

| Method | Path | Wires |
|---|---|---|
| `GET` | `/profile` | `fetchProfile()` → `setProfileState()` |

Feeds 3 profile-driven info cards (Current Condition, Medication Status, Next Appointment); lab comparison stat cards and Recommended Actions are still static (see Section 4.2).

### 3.4 NN Prediction (`POST /predict` result — read via `GET /predict/history`)

| Method | Path | Wires |
|---|---|---|
| `GET` | `/predict/history` | `fetchPredictionHistory()` → returns full history sorted newest first |
| *(derived)* | — | `fetchLatestPrediction()` → `history[0]` — most recent record |

The most recent record's `healthScore`, `diagnosis`, and `confidence` fields feed the Health Stability gauge and the Current Condition card. The backend NN model auto-enriches the prediction with TSH, FreeT3, FreeT4, and all six symptom scores (fatigue, anxiety, insomnia, hairLoss, palpitations, coldIntolerance) from the patient's MongoDB records, so the frontend needs only to send the optional non-thyroid clinical fields — but `GET /predict/history` requires no body at all.

### 3.5 Bundle helper

| Function | Fires |
|---|---|
| `fetchDashboardData()` | `Promise.all([fetchT3(), fetchT4(), fetchTSH(), fetchSymptoms(), fetchProfile(), fetchLatestPrediction()])` — all six requests in parallel |

---

## 4. Hardcoded Values Replaced

### 4.1 Table — Changes made in Step 5

| Location | Before (hardcoded) | After (from API) | Endpoint |
|---|---|---|---|
| **Welcome greeting** | `Welcome, {user?.firstName}` | `Welcome, {fullName}` where `fullName = profile.name ?? user.firstName` | `GET /profile` fallback `GET /auth/me` |
| **Current Condition — diagnosis label** | `"Hypothyroidism"` | `prediction.diagnosis` (falls back to `profile.medicalInfo.condition`) | `GET /predict/history` then `GET /profile` |
| **Current Condition — subline** | `"Stable condition"` | `Confidence: NN%` from `prediction.confidence` (falls back to `profile.medicalInfo.status`) | `GET /predict/history` then `GET /profile` |
| **Health Stability % (circle gauge)** | `82%` | `prediction.healthScore` (falls back to `82` when no prediction exists) | `GET /predict/history` |
| **Medication Status — name** | `"Levothyroxine"` | `profile.medicalInfo.medication` | `GET /profile` |
| **Medication Status — dosage** | `"75 mcg daily"` | `profile.medicalInfo.dosage` | `GET /profile` |
| **Medication Status — refill** | `"Next refill in 12 days"` | `"Next refill in {profile.medicalInfo.refillDaysLeft} day(s)"` | `GET /profile` |
| **Next Appointment — doctor** | `"Dr. Sarah Johnson"` | `profile.medicalInfo.doctor` | `GET /profile` |
| **Next Appointment — date** | `"June 15, 2023"` | `profile.medicalInfo.nextAppointment` | `GET /profile` |
| **T3 chart** | 13 hardcoded `{date, t3}` objects | `GET /lab-results/t3` response | `GET /lab-results/t3` |
| **T4 chart** | 13 hardcoded `{date, t4}` objects | `GET /lab-results/t4` response | `GET /lab-results/t4` |
| **TSH chart** | 13 hardcoded `{date, tsh}` objects | `GET /lab-results/tsh` response | `GET /lab-results/tsh` |
| **Symptom Tracker** | 14 hardcoded month rows (fatigue … coldIntolerance) | `GET /symptoms` response | `GET /symptoms` |

### 4.2 Table — Values still hardcoded after Step 5

| Location | Hardcoded value | Intended source | Status |
|---|---|---|---|
| **TSH comparison card** | `2.5 / 3.8 mIU/L` | Two most recent TSH records from `/lab-results/tsh` | ⏳ Future step |
| **Free T4 comparison card** | `1.1 / 0.9 ng/dL` | Two most recent T4 records from `/lab-results/t4` | ⏳ Future step |
| **Free T3 comparison card** | `3.2 / 3.0 pg/mL` | Two most recent T3 records from `/lab-results/t3` | ⏳ Future step |
| **Recommended Actions** | 5 static strings | `GET /recommendations` or prediction-response field | ⏳ Future step |

---

## 5. Endpoints Status Checklist

| # | Method | Path | Status |
|---|---|---|---|
| 1 | `GET` | `/lab-results/t3` | ✅ Wired |
| 2 | `GET` | `/lab-results/t4` | ✅ Wired |
| 3 | `GET` | `/lab-results/tsh` | ✅ Wired |
| 4 | `GET` | `/symptoms` | ✅ Wired |
| 5 | `GET` | `/profile` | ✅ Wired |
| 6 | `GET` | `/auth/me` | ✅ Already wired by `UserContext` (Step 3) |
| 7 | `GET` | `/predict/history` | ✅ Wired (reads latest prediction record) |
| 8 | `POST` | `/predict` | ℹ Available — not directly called by Dashboard; called by InsertReport step before predictions are stored in history |
| 9 | `GET` | `/recommendations` | ❌ Not available |

---

## 6. Loading & Empty-State Design

```
mount ──► fetchDashboardData()  [Promise.all]
              ├─ fetchT3()               ─► setT3data([])       + setTimeout → setT3Loaded(true)
              ├─ fetchT4()               ─► setT4data([])       + setTimeout → setT4Loaded(true)
              ├─ fetchTSH()              ─► setTSHdata([])      + setTimeout → setTSHLoaded(true)
              ├─ fetchSymptoms()         ─► setSTdata([])       + setTimeout → setSymptomsLoaded(true)
              ├─ fetchProfile()          ─► setProfile(null)    + setTimeout → setProfileLoaded(true)
              └─ fetchLatestPrediction() ─► setPrediction(null) + setTimeout → setPredictionLoaded(true)
```

- `!loaded` → `SkeletonChart` / `SkeletonRadar` renders first  
- `loaded && data.length === 0` → `EmptyChartState` / `EmptyRadarState` renders (prevents ApexCharts silent failure on empty series)  
- **400 ms artificial minimum** prevents skeleton→content flash on fast localhost connections

---

## 7. Notes & Warnings for the Next Steps

### ⚠️ W-A1 — Profile `medicalInfo` schema

`GET /profile` must return fields `medicalInfo.condition`, `medicalInfo.status`, `medicalInfo.medication`, `medicalInfo.dosage`, `medicalInfo.refillDaysLeft`, `medicalInfo.doctor`, `medicalInfo.nextAppointment` with exactly those names — otherwise all three profile-driven info cards silently fall back to their hardcoded defaults.

### ⚠️ W-A2 — Lab result data shape

`normaliseLabResult()` accepts either `{date, value}` (Postman body example) or `{date, t3}` (already-normalised field name). If the backend returns a different key, all three lab-chart arrays resolve to `[]` and the empty-state message appears — no crash.

### ℹ N-A1 — Lab comparison cards still static

TSH / FreeT4 / FreeT3 "Current / Previous / Change" cards are still hardcoded. They should be computed from the two most recent records returned by `/lab-results/{type}`.

### ℹ N-A2 — Recommended Actions still hardcoded

Five action items are pending a decision on whether to expose them as fields in the prediction response or as a separate `GET /recommendations` endpoint.

### ℹ N-A3 — File size

`Dashboard.jsx` is ~895 lines. Consider splitting:
- `useDashboardHooks.js` — all `useEffect` / `useMemo` / `useState` logic  
- `HealthOverview.jsx` — hero row + info cards  
- `ChartCard.jsx` — reusable labelled-Chart wrapper

### ℹ N-A4 — Bug still carried over

`AiChat.jsx` (`Delete()` undefined) and `ViewReports.jsx` (`Delete(report)` undefined) are unchanged and remain crash risks; fix before production.