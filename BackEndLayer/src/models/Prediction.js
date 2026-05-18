const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema({
  priority: { type: String, enum: ["high", "medium", "low"] },
  action: { type: String },
  reason: { type: String },
}, { _id: false });

/**
 * Stores every prediction made by the NN model for a patient.
 * Allows viewing history and auditing model outputs.
 */
const predictionSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // The diagnosis string returned by the NN model
    diagnosis: {
      type: String,
      required: true,
    },
    // The probability/certainty of the model
    confidence: {
      type: Number,
      default: 0,
    },
    // The calculated health stability score
    healthScore: {
      type: Number,
      default: 0,
    },
    recommendations: { type: [recommendationSchema], default: [] },
    // The full patient_data object sent to the model (for audit / replay)
    inputData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Prediction", predictionSchema);
