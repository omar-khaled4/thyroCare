const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, min: 13, max: 120, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["patient", "admin"], default: "patient" },
    profile: {
      phone: String,
      birthday: String,
    },
    // Add these two new fields AFTER profile, before the timestamps
    medicalInfo: {
      condition: { type: String, default: "" },
      status: {
        type: String,
        enum: ["stable", "critical", "improving", "worsening"],
        default: "stable",
      },
      medication: { type: String, default: "" },
      dosage: { type: String, default: "" },
      refillDaysLeft: { type: Number, default: 0 },
      doctor: { type: String, default: "" },
      nextAppointment: { type: String, default: "" },
    },
  },
  { timestamps: true },
);

// Hash password before saving — never store plain text
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare a plain password with the stored hash
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
