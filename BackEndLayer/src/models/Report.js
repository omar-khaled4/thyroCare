const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Basic Information
    testDate: { type: String, required: true },
    testingFacility: { type: String, default: "" },
    // Thyroid Function Tests
    thyroidFunction: {
      tsh: Number,
      freeT3: Number,
      freeT4: Number,
      totalT3: Number,
      totalT4: Number,
    },
    // Thyroid Antibody Tests
    antibodies: {
      tpo: Number,
      antiTg: Number,
      tshr: Number,
    },
    // Other Tests
    otherTests: {
      thyroglobulin: Number,
      calcitonin: Number,
      reverseT3: Number,
    },
    // Symptoms at time of test
    symptoms: {
      fatigue: Number,
      weightChange: Number,
      coldIntolerance: Number,
      hairLoss: Number,
      palpitations: Number,
      anxiety: Number,
      insomnia: Number,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Report", reportSchema);
