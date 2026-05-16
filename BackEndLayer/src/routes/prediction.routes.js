const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const {
  predict,
  getPredictionHistory,
  getPredictionById,
  deletePrediction,
} = require("../controllers/prediction.controller");

// All routes are protected — require a valid JWT
router.use(auth);

/**
 * POST /api/predict
 * Body: { patient_data: { ...all 75 NN fields... } }
 * Calls the NN model and stores + returns the prediction.
 */
router.post("/", predict);

/**
 * GET /api/predict/history
 * Returns all predictions for the logged-in patient, newest first.
 */
router.get("/history", getPredictionHistory);

/**
 * GET /api/predict/history/:id
 * Returns a single prediction by its MongoDB ID.
 */
router.get("/history/:id", getPredictionById);

/**
 * DELETE /api/predict/history/:id
 * Deletes a single prediction record.
 */
router.delete("/history/:id", deletePrediction);

module.exports = router;

export const maxDuration = 60; // seconds
