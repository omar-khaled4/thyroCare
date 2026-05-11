const LabResult = require("../models/LabResult");
const { respond, tryCatch, mapLabRecord } = require("../utils/helpers");

const VALID_TYPES = ["t3", "t4", "tsh"];

/**
 * GET /api/lab-results/:type  (protected)
 * Returns: [{ date, t3 }, { date, t3 }, ...]  (key name matches the type)
 */
const getLabResults = tryCatch(async (req, res) => {
  const type = req.params.type;
  if (!VALID_TYPES.includes(type)) {
    return respond(res, 400, null, "Type must be t3, t4, or tsh");
  }

  const doc = await LabResult.findOne({ patientId: req.user.id, type });
  const records = doc ? doc.records.map((r) => mapLabRecord(type, r)) : [];

  respond(res, 200, records);
});

/**
 * POST /api/lab-results/:type  (protected)
 * Body: { date: "2025-03-01", value: 2.1 }
 */
const addLabResult = tryCatch(async (req, res) => {
  const type = req.params.type;
  if (!VALID_TYPES.includes(type)) {
    return respond(res, 400, null, "Type must be t3, t4, or tsh");
  }

  const { date, value } = req.body;
  if (!date || value === undefined) {
    return respond(res, 400, null, "date and value are required");
  }

  const doc = await LabResult.findOneAndUpdate(
    { patientId: req.user.id, type },
    { $push: { records: { date, value } } },
    { new: true, upsert: true },
  );

  const added = doc.records[doc.records.length - 1];
  respond(res, 201, mapLabRecord(type, added), "Record added");
});

/**
 * PUT /api/lab-results/:type  (protected)
 * Body: { date: "2025-03-01", value: 2.5 }
 * Finds the record with matching date and updates its value.
 */
const updateLabResult = tryCatch(async (req, res) => {
  const type = req.params.type;
  if (!VALID_TYPES.includes(type)) {
    return respond(res, 400, null, "Type must be t3, t4, or tsh");
  }

  const { date, value } = req.body;
  if (!date || value === undefined) {
    return respond(res, 400, null, "date and value are required");
  }

  const doc = await LabResult.findOne({ patientId: req.user.id, type });
  if (!doc) return respond(res, 404, null, "No records found");

  const record = doc.records.find((r) => r.date === date);
  if (!record) return respond(res, 404, null, "No record with that date");

  record.value = value;
  await doc.save();

  respond(res, 200, mapLabRecord(type, record), "Record updated");
});

/**
 * DELETE /api/lab-results/:type?date=2025-03-01  (protected)
 */
const deleteLabResult = tryCatch(async (req, res) => {
  const type = req.params.type;
  if (!VALID_TYPES.includes(type)) {
    return respond(res, 400, null, "Type must be t3, t4, or tsh");
  }

  const { date } = req.query;
  if (!date) return respond(res, 400, null, "date query param is required");

  const doc = await LabResult.findOne({ patientId: req.user.id, type });
  if (!doc) return respond(res, 404, null, "No records found");

  const idx = doc.records.findIndex((r) => r.date === date);
  if (idx === -1) return respond(res, 404, null, "No record with that date");

  const removed = doc.records.splice(idx, 1)[0];
  await doc.save();

  respond(res, 200, mapLabRecord(type, removed), "Record deleted");
});

/**
 * PUT /api/lab-results/:type/bulk  (protected)
 * Body: [{ date, value }, { date, value }, ...]
 * Replaces ALL records for this patient + type.
 * Useful when the front-end sends the full array after edits.
 */
const bulkUpdateLabResults = tryCatch(async (req, res) => {
  const type = req.params.type;
  if (!VALID_TYPES.includes(type)) {
    return respond(res, 400, null, "Type must be t3, t4, or tsh");
  }

  const records = req.body;
  if (!Array.isArray(records)) {
    return respond(res, 400, null, "Body must be an array of { date, value }");
  }

  // Transform front-end format { date, t3 } → { date, value }
  const mapped = records.map((r) => ({
    date: r.date,
    value: r[type] !== undefined ? r[type] : r.value,
  }));

  const doc = await LabResult.findOneAndUpdate(
    { patientId: req.user.id, type },
    { records: mapped },
    { new: true, upsert: true },
  );

  respond(
    res,
    200,
    doc.records.map((r) => mapLabRecord(type, r)),
    "Bulk updated",
  );
});

module.exports = {
  getLabResults,
  addLabResult,
  updateLabResult,
  deleteLabResult,
  bulkUpdateLabResults,
};
