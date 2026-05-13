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
 * Used to convert gender "male" → "Male" to match NN model expectations.
 */
const capitalise = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : str;

/**
 * Builds the patient_data object expected by the NN model.
 * Strategy: the frontend sends all required fields in req.body.patient_data.
 * We then enrich it with data already stored in MongoDB (User, Report, Symptom).
 * MongoDB data takes precedence for fields it owns (age, gender, lab results,
 * core symptoms) so the prediction is always consistent with stored records.
 *
 * @param {object} frontendData  - patient_data sent from the frontend (req.body.patient_data)
 * @param {object} user          - Mongoose User document
 * @param {object|null} report   - Latest Mongoose Report document (or null)
 * @param {object|null} symptom  - Latest symptom record object (or null)
 * @returns {object} patient_data ready for the NN model
 */
const buildPatientData = (frontendData, user, report, symptom) => {
  // Start with whatever the frontend sent so that all 75+ fields are present
  const data = { ...(frontendData || {}) };

  // ── Overwrite with authoritative DB values ──────────────────────────────

  // From User model
  data.Age = user.age;
  data.Gender = capitalise(user.gender); // "male" → "Male"

  // From latest Report (thyroid function + antibodies)
  if (report) {
    if (report.thyroidFunction) {
      if (report.thyroidFunction.tsh != null)
        data.TSH_mIU_L = report.thyroidFunction.tsh;
      if (report.thyroidFunction.freeT3 != null)
        data.FreeT3_pg_mL = report.thyroidFunction.freeT3;
      if (report.thyroidFunction.freeT4 != null)
        data.FreeT4_ng_dL = report.thyroidFunction.freeT4;
    }
    if (report.antibodies) {
      if (report.antibodies.tpo != null)
        data.TPOAb_IU_mL = report.antibodies.tpo;
      if (report.antibodies.antiTg != null)
        data.TgAb_IU_mL = report.antibodies.antiTg;
      if (report.antibodies.tshr != null)
        data.TRAb_IU_L = report.antibodies.tshr;
    }
  }

  // From latest Symptom record
  if (symptom) {
    if (symptom.fatigue != null) data.Fatigue = symptom.fatigue;
    if (symptom.anxiety != null) data.Anxiety = symptom.anxiety;
    if (symptom.insomnia != null) data.Insomnia = symptom.insomnia;
    if (symptom.hairLoss != null) data.HairLoss = symptom.hairLoss;
    if (symptom.palpitations != null) data.Palpitations = symptom.palpitations;
    if (symptom.coldIntolerance != null)
      data.ColdIntolerance = symptom.coldIntolerance;
  }

  return data;
};

// ──────────────────────────────────────────────────────────────────────────────
// Controllers
// ──────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/predict
 *
 * Accepts patient_data from the frontend, enriches it with MongoDB data,
 * forwards it to the NN microservice, persists the result, and returns it.
 *
 * Request body:
 * {
 *   "patient_data": {
 *     "HeightCm": 170, "WeightKg": 70, "BMI": 24.2,
 *     "SmokingStatus": "Never", "AlcoholUse": "Moderate",
 *     "PhysicalActivity": "Moderate", "DietaryIodine": "Adequate",
 *     "Pregnant": 0, "Postpartum_6mo": 0, ...all other NN fields...
 *   }
 * }
 *
 * Response:
 * { "success": true, "data": { "prediction": "Normal", "predictionId": "..." }, "message": "Prediction complete" }
 */
const predict = tryCatch(async (req, res) => {
  const { patient_data } = req.body;

  if (!patient_data || typeof patient_data !== "object") {
    return respond(res, 400, null, "patient_data object is required in the request body");
  }

  const userId = req.user.id;

  // 1. Fetch related MongoDB documents in parallel
  const [user, latestReport, symptomDoc] = await Promise.all([
    User.findById(userId),
    Report.findOne({ patientId: userId }).sort({ createdAt: -1 }),
    Symptom.findOne({ patientId: userId }),
  ]);

  if (!user) return respond(res, 404, null, "User not found");

  // Get latest symptom record (the last entry in records array)
  const latestSymptom =
    symptomDoc && symptomDoc.records.length > 0
      ? symptomDoc.records[symptomDoc.records.length - 1]
      : null;

  // 2. Build the NN model payload by merging frontend data + DB data
  const patientData = buildPatientData(
    patient_data,
    user,
    latestReport,
    latestSymptom,
  );

  // 3. Call the NN microservice
  const nnUrl = process.env.NN_MODEL_URL || "http://127.0.0.1:8000";

  let nnResponse;
  try {
    const response = await fetch(`${nnUrl}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patient_data: patientData }),
      signal: AbortSignal.timeout(15000), // 15-second timeout
    });

    if (!response.ok) {
      const errText = await response.text();
      return respond(
        res,
        502,
        null,
        `NN model returned an error (${response.status}): ${errText}`,
      );
    }

    nnResponse = await response.json();
  } catch (err) {
    if (err.name === "TimeoutError" || err.name === "AbortError") {
      return respond(
        res,
        504,
        null,
        "The prediction service timed out. Please try again.",
      );
    }
    return respond(
      res,
      503,
      null,
      "The prediction service is currently unavailable. Ensure the NN model server is running on port 8000.",
    );
  }

  const prediction = nnResponse.prediction;
  if (!prediction) {
    return respond(res, 502, null, "NN model response did not include a prediction field");
  }

  // 4. Persist the prediction for history / auditing
  const saved = await Prediction.create({
    patientId: userId,
    prediction,
    inputData: patientData,
  });

  // 5. Return the result
  respond(res, 200, { prediction, predictionId: saved._id }, "Prediction complete");
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
