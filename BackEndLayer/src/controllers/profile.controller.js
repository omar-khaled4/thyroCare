const User = require("../models/User");
const LabResult = require("../models/LabResult");
const Symptom = require("../models/Symptom");
const Report = require("../models/Report");
const { respond, tryCatch } = require("../utils/helpers");

/**
 * GET /api/profile  (protected)
 */
const getProfile = tryCatch(async (req, res) => {
  const user = await User.findById(req.user.id);
  respond(res, 200, user);
});

/**
 * PUT /api/profile  (protected)
 * Body: { name?, profile: { age?, gender?, phone?, birthday? }, medicalInfo: { condition?, status?, medication?, dosage?, refillDaysLeft?, doctor?, nextAppointment? } }
 */
const updateProfile = tryCatch(async (req, res) => {
  const { name, profile, medicalInfo } = req.body;
  const updates = {};

  if (name) updates.name = name;

  if (profile) {
    updates.profile = {};
    if (profile.age !== undefined) updates.profile.age = profile.age;
    if (profile.gender) updates.profile.gender = profile.gender;
    if (profile.phone) updates.profile.phone = profile.phone;
    if (profile.birthday) updates.profile.birthday = profile.birthday;
  }

  if (medicalInfo) {
    updates.medicalInfo = {};
    if (medicalInfo.condition !== undefined)
      updates.medicalInfo.condition = medicalInfo.condition;
    if (medicalInfo.status) updates.medicalInfo.status = medicalInfo.status;
    if (medicalInfo.medication !== undefined)
      updates.medicalInfo.medication = medicalInfo.medication;
    if (medicalInfo.dosage !== undefined)
      updates.medicalInfo.dosage = medicalInfo.dosage;
    if (medicalInfo.refillDaysLeft !== undefined)
      updates.medicalInfo.refillDaysLeft = medicalInfo.refillDaysLeft;
    if (medicalInfo.doctor !== undefined)
      updates.medicalInfo.doctor = medicalInfo.doctor;
    if (medicalInfo.nextAppointment !== undefined)
      updates.medicalInfo.nextAppointment = medicalInfo.nextAppointment;
  }

  const user = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true,
  });

  respond(res, 200, user, "Profile updated");
});

/**
 * DELETE /api/profile  (protected)
 * Also deletes all related data.
 */
const deleteProfile = tryCatch(async (req, res) => {
  const userId = req.user.id;

  await Promise.all([
    User.deleteOne({ _id: userId }),
    LabResult.deleteMany({ patientId: userId }),
    Symptom.deleteOne({ patientId: userId }),
    Report.deleteMany({ patientId: userId }),
  ]);

  respond(res, 200, null, "Account deleted");
});

module.exports = { getProfile, updateProfile, deleteProfile };
