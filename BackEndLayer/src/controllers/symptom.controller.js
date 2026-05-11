const Symptom = require("../models/Symptom");
const { respond, tryCatch } = require("../utils/helpers");

/**
 * GET /api/symptoms  (protected)
 * Returns the records array as-is (field names match front-end).
 */
const getSymptoms = tryCatch(async (req, res) => {
  const doc = await Symptom.findOne({ patientId: req.user.id });
  respond(res, 200, doc ? doc.records : []);
});

/**
 * POST /api/symptoms  (protected)
 * Body: { date, fatigue, anxiety, insomnia, hairLoss, palpitations, coldIntolerance }
 */
const addSymptom = tryCatch(async (req, res) => {
  const {
    date,
    fatigue,
    anxiety,
    insomnia,
    hairLoss,
    palpitations,
    coldIntolerance,
  } = req.body;
  if (!date) return respond(res, 400, null, "date is required");

  const record = {
    date,
    fatigue,
    anxiety,
    insomnia,
    hairLoss,
    palpitations,
    coldIntolerance,
  };

  const doc = await Symptom.findOneAndUpdate(
    { patientId: req.user.id },
    { $push: { records: record } },
    { new: true, upsert: true },
  );

  respond(
    res,
    201,
    doc.records[doc.records.length - 1],
    "Symptom record added",
  );
});

/**
 * PUT /api/symptoms  (protected)
 * Body: { date, fatigue?, anxiety?, ... }  — only send fields you want to change
 */
const updateSymptom = tryCatch(async (req, res) => {
  const { date } = req.body;
  if (!date) return respond(res, 400, null, "date is required");

  const doc = await Symptom.findOne({ patientId: req.user.id });
  if (!doc) return respond(res, 404, null, "No symptom records found");

  const record = doc.records.find((r) => r.date === date);
  if (!record) return respond(res, 404, null, "No record with that date");

  // Merge only provided fields
  const {
    fatigue,
    anxiety,
    insomnia,
    hairLoss,
    palpitations,
    coldIntolerance,
  } = req.body;
  if (fatigue !== undefined) record.fatigue = fatigue;
  if (anxiety !== undefined) record.anxiety = anxiety;
  if (insomnia !== undefined) record.insomnia = insomnia;
  if (hairLoss !== undefined) record.hairLoss = hairLoss;
  if (palpitations !== undefined) record.palpitations = palpitations;
  if (coldIntolerance !== undefined) record.coldIntolerance = coldIntolerance;

  await doc.save();
  respond(res, 200, record, "Symptom record updated");
});

/**
 * DELETE /api/symptoms?date=2025-03-01  (protected)
 */
const deleteSymptom = tryCatch(async (req, res) => {
  const { date } = req.query;
  if (!date) return respond(res, 400, null, "date query param is required");

  const doc = await Symptom.findOne({ patientId: req.user.id });
  if (!doc) return respond(res, 404, null, "No symptom records found");

  const idx = doc.records.findIndex((r) => r.date === date);
  if (idx === -1) return respond(res, 404, null, "No record with that date");

  const removed = doc.records.splice(idx, 1)[0];
  await doc.save();

  respond(res, 200, removed, "Symptom record deleted");
});

/**
 * PUT /api/symptoms/bulk  (protected)
 * Body: [{ date, fatigue, anxiety, ... }, ...]
 * Replaces ALL symptom records for this patient.
 */
const bulkUpdateSymptoms = tryCatch(async (req, res) => {
  const records = req.body;
  if (!Array.isArray(records)) {
    return respond(res, 400, null, "Body must be an array of symptom records");
  }

  const doc = await Symptom.findOneAndUpdate(
    { patientId: req.user.id },
    { records },
    { new: true, upsert: true },
  );

  respond(res, 200, doc.records, "Symptoms bulk updated");
});

module.exports = {
  getSymptoms,
  addSymptom,
  updateSymptom,
  deleteSymptom,
  bulkUpdateSymptoms,
};
