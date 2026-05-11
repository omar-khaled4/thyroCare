const mongoose = require("mongoose");

const symptomSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one document per patient
    },
    records: [
      {
        date: { type: String, required: true },
        fatigue: Number,
        anxiety: Number,
        insomnia: Number,
        hairLoss: Number,
        palpitations: Number,
        coldIntolerance: Number,
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Symptom", symptomSchema);
