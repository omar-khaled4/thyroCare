const mongoose = require("mongoose");

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
    prediction: {
      type: String,
      required: true,
    },
    // The full patient_data object sent to the model (for audit / replay)
    inputData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Prediction", predictionSchema);
