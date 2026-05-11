const Report = require("../models/Report");
const { respond, tryCatch } = require("../utils/helpers");

/**
 * GET /api/reports  (protected)
 * Returns all reports for the logged-in patient, newest first.
 */
const getReports = tryCatch(async (req, res) => {
  const reports = await Report.find({ patientId: req.user.id }).sort({
    createdAt: -1,
  });
  respond(res, 200, reports);
});

/**
 * GET /api/reports/:id  (protected)
 */
const getReportById = tryCatch(async (req, res) => {
  const report = await Report.findOne({
    _id: req.params.id,
    patientId: req.user.id,
  });
  if (!report) return respond(res, 404, null, "Report not found");
  respond(res, 200, report);
});

/**
 * POST /api/reports  (protected)
 * Body: full report object
 */
const createReport = tryCatch(async (req, res) => {
  const {
    testDate,
    testingFacility,
    thyroidFunction,
    antibodies,
    otherTests,
    symptoms,
  } = req.body;

  if (!testDate) {
    return respond(res, 400, null, "testDate is required");
  }

  const report = await Report.create({
    patientId: req.user.id,
    testDate,
    testingFacility,
    thyroidFunction,
    antibodies,
    otherTests,
    symptoms,
  });

  respond(res, 201, report, "Report created");
});

/**
 * PUT /api/reports/:id  (protected)
 * Body: any fields to update
 */
const updateReport = tryCatch(async (req, res) => {
  const {
    testDate,
    testingFacility,
    thyroidFunction,
    antibodies,
    otherTests,
    symptoms,
  } = req.body;

  const report = await Report.findOne({
    _id: req.params.id,
    patientId: req.user.id,
  });
  if (!report) return respond(res, 404, null, "Report not found");

  if (testDate) report.testDate = testDate;
  if (testingFacility !== undefined) report.testingFacility = testingFacility;
  if (thyroidFunction)
    report.thyroidFunction = { ...report.thyroidFunction, ...thyroidFunction };
  if (antibodies) report.antibodies = { ...report.antibodies, ...antibodies };
  if (otherTests) report.otherTests = { ...report.otherTests, ...otherTests };
  if (symptoms) report.symptoms = { ...report.symptoms, ...symptoms };

  await report.save();
  respond(res, 200, report, "Report updated");
});

/**
 * DELETE /api/reports/:id  (protected)
 */
const deleteReport = tryCatch(async (req, res) => {
  const report = await Report.findOneAndDelete({
    _id: req.params.id,
    patientId: req.user.id,
  });
  if (!report) return respond(res, 404, null, "Report not found");
  respond(res, 200, null, "Report deleted");
});

module.exports = {
  getReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
};
