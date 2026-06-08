const User = require("../models/User");
const Report = require("../models/Report");
const Symptom = require("../models/Symptom");
const Prediction = require("../models/Prediction");
const { respond, tryCatch } = require("../utils/helpers");

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Capitalises the first letter of a string.
 */
const capitalise = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : str;

/**
 * Builds the clean patient_data object for the LLM microservice.
 * Only uses real data from the DB — no fake or NaN fields.
 *
 * @param {object} user          - Mongoose User document
 * @param {object|null} report   - Latest Mongoose Report document (or null)
 * @param {object|null} symptom  - Latest symptom record object (or null)
 * @returns {object} patient_data ready for the LLM model
 */
const buildPatientData = (user, report, symptom) => {
  const data = {
    // From User
    age: user.age ?? 0,
    gender: capitalise(user.gender) ?? "Unknown",

    // From Report — thyroid function
    tsh: report?.thyroidFunction?.tsh ?? 0,
    freeT3: report?.thyroidFunction?.freeT3 ?? 0,
    freeT4: report?.thyroidFunction?.freeT4 ?? 0,
    totalT3: report?.thyroidFunction?.totalT3 ?? 0,
    totalT4: report?.thyroidFunction?.totalT4 ?? 0,

    // From Report — antibodies
    tpo: report?.antibodies?.tpo ?? 0,
    antiTg: report?.antibodies?.antiTg ?? 0,
    tshr: report?.antibodies?.tshr ?? 0,

    // From Report — other tests
    thyroglobulin: report?.otherTests?.thyroglobulin ?? 0,
    calcitonin: report?.otherTests?.calcitonin ?? 0,
    reverseT3: report?.otherTests?.reverseT3 ?? 0,

    // From latest Symptom record
    symptoms: {
      fatigue: symptom?.fatigue ?? 0,
      weightChange: symptom?.weightChange ?? 0,
      coldIntolerance: symptom?.coldIntolerance ?? 0,
      hairLoss: symptom?.hairLoss ?? 0,
      palpitations: symptom?.palpitations ?? 0,
      anxiety: symptom?.anxiety ?? 0,
      insomnia: symptom?.insomnia ?? 0,
    },
  };

  return data;
};

// ──────────────────────────────────────────────────────────────────────────────
// Controllers
// ──────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/predict
 *
 * Reads patient data from MongoDB, forwards it to the LLM microservice,
 * persists the result, and returns it to the frontend.
 *
 * No patient_data required in the request body — everything comes from the DB.
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "diagnosis": "Hashimoto's Thyroiditis",
 *     "severity": "Moderate",
 *     "confidence": 0.95,
 *     "healthScore": 45,
 *     "recommendations": [...],
 *     "predictionId": "...",
 *     "createdAt": "..."
 *   },
 *   "message": "Prediction complete"
 * }
 */
const predict = tryCatch(async (req, res) => {
  const userId = req.user.id;

  // 1. Fetch all required data from MongoDB in parallel
  const [user, latestReport, symptomDoc] = await Promise.all([
    User.findById(userId),
    Report.findOne({ patientId: userId }).sort({ createdAt: -1 }),
    Symptom.findOne({ patientId: userId }),
  ]);

  if (!user) return respond(res, 404, null, "User not found");

  if (!latestReport) {
    return respond(res, 400, null, "No report found. Please submit a thyroid report before requesting a prediction.");
  }

  // Get latest symptom record (last entry in records array)
  const latestSymptom =
    symptomDoc && symptomDoc.records?.length > 0
      ? symptomDoc.records[symptomDoc.records.length - 1]
      : null;

  // 2. Build the clean LLM payload from real DB data only
  const patientData = buildPatientData(user, latestReport, latestSymptom);

  // 3. Call the LLM microservice
  const llmUrl = process.env.NN_MODEL_URL || "http://127.0.0.1:8000";
  

  let llmResponse;
  try {
    const response = await fetch(`${llmUrl}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patient_data: patientData }),
      signal: AbortSignal.timeout(30000), // 30s timeout — LLM needs more time than NN
    });

    if (!response.ok) {
      const errText = await response.text();
      return respond(
        res,
        502,
        null,
        `LLM service returned an error (${response.status}): ${errText}`,
      );
    }

    llmResponse = await response.json();
    
  } catch (err) {
    if (err.name === "TimeoutError" || err.name === "AbortError") {
      return respond(res, 504, null, "The prediction service timed out. Please try again.");
    }
    return respond(res, 503, null, "The prediction service is currently unavailable. Ensure the LLM server is running on port 8000.");
  }

  // 4. Extract fields from LLM response
  const diagnosis = llmResponse.diagnosis ?? "Unknown";
  const severity = llmResponse.severity ?? "Unknown";
  const confidence = llmResponse.confidence ?? 0.0;
  const healthScore = llmResponse.healthScore ?? 50;
  const recommendations = llmResponse.recommendations ?? [];

  if (!diagnosis || diagnosis === "Unknown") {
    return respond(res, 502, null, "LLM response did not include a valid diagnosis");
  }

  // 5. Persist the prediction for history / dashboard
  const saved = await Prediction.create({
    patientId: userId,
    diagnosis,
    severity,
    confidence,
    healthScore,
    recommendations,
    inputData: patientData,
  });

  // 6. Return full result to frontend
  respond(
    res,
    200,
    {
      diagnosis,
      severity,
      confidence,
      healthScore,
      recommendations,
      predictionId: saved._id,
      createdAt: saved.createdAt,
    },
    "Prediction complete"
  );
});

// ──────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/predict/history
 * Returns all predictions for the logged-in patient, newest first.
 */
const getPredictionHistory = tryCatch(async (req, res) => {
  const predictions = await Prediction.find({ patientId: req.user.id })
    .sort({ createdAt: -1 })
    .select("-inputData"); // Exclude large inputData by default

  respond(res, 200, predictions);
});

// ──────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/predict/history/:id
 * Returns a single prediction including its full inputData.
 */
const getPredictionById = tryCatch(async (req, res) => {
  const prediction = await Prediction.findOne({
    _id: req.params.id,
    patientId: req.user.id,
  });

  if (!prediction) return respond(res, 404, null, "Prediction not found");
  respond(res, 200, prediction);
});

// ──────────────────────────────────────────────────────────────────────────────

/**
 * DELETE /api/predict/history/:id
 * Deletes a single prediction record.
 */
const deletePrediction = tryCatch(async (req, res) => {
  const prediction = await Prediction.findOneAndDelete({
    _id: req.params.id,
    patientId: req.user.id,
  });

  if (!prediction) return respond(res, 404, null, "Prediction not found");
  respond(res, 200, null, "Prediction deleted");
});

// ──────────────────────────────────────────────────────────────────────────────

module.exports = { predict, getPredictionHistory, getPredictionById, deletePrediction };