const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    dateOfBirth: { type: String, required: true },
    gender: { type: String, enum: ["male", "female"], required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(v);
        },
        message:
          "Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      },
    },
    role: { type: String, enum: ["patient", "admin"], default: "patient" },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, default: null },
    emailVerificationExpires: { type: Date, default: null },
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
