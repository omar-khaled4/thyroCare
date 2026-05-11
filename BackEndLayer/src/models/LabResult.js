const mongoose = require("mongoose");

const labResultSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["t3", "t4", "tsh"],
      required: true,
    },
    records: [
      {
        date: { type: String, required: true },
        value: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true },
);

// One document per patient per lab type
labResultSchema.index({ patientId: 1, type: 1 }, { unique: true });

module.exports = mongoose.model("LabResult", labResultSchema);
