const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const ResetToken = require("../models/ResetToken");
const { respond, tryCatch } = require("../utils/helpers");

/**
 * POST /api/auth/register
 * Body: { name, email, password }
 */
const register = tryCatch(async (req, res) => {
  const { firstName, lastName, email, phone, password, dateOfBirth, gender } = req.body;

  if (!firstName || !lastName || !email || !phone || !password || !dateOfBirth || !gender) {
    return respond(
      res,
      400,
      null,
      "All fields are required",
    );
  }
  if (password.length < 6) {
    return respond(res, 400, null, "Password must be at least 6 characters");
  }
  if (!["male", "female"].includes(gender.toLowerCase())) {
    return respond(res, 400, null, "Gender must be male or female");
  }

  const user = await User.create({ firstName, lastName, email, phone, password, dateOfBirth, gender });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  respond(res, 201, { user, token }, "Registered successfully");
});
/**
 * POST /api/auth/login
 * Body: { email, password }
 */
const login = tryCatch(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return respond(res, 400, null, "email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return respond(res, 401, null, "Invalid email or password");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  respond(res, 200, { user, token }, "Logged in successfully");
});

/**
 * GET /api/auth/me  (protected)
 */
const getMe = tryCatch(async (req, res) => {
  const user = await User.findById(req.user.id);
  respond(res, 200, user);
});

/**
 * POST /api/auth/forgot-password
 * Body: { email }
 *
 * NOTE: In production you'd email the token. For this project the token
 *       is returned in the response so you can test it directly.
 */
const forgotPassword = tryCatch(async (req, res) => {
  const { email } = req.body;
  if (!email) return respond(res, 400, null, "email is required");

  const user = await User.findOne({ email });
  if (!user) return respond(res, 404, null, "No user with that email");

  // Delete any old tokens for this user
  await ResetToken.deleteMany({ userId: user._id });

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await ResetToken.create({ userId: user._id, token, expiresAt });

  respond(
    res,
    200,
    { token },
    "Reset token generated (in production, email it)",
  );
});

/**
 * POST /api/auth/reset-password
 * Body: { token, newPassword }
 */
const resetPassword = tryCatch(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return respond(res, 400, null, "token and newPassword are required");
  }
  if (newPassword.length < 6) {
    return respond(res, 400, null, "Password must be at least 6 characters");
  }

  const resetDoc = await ResetToken.findOne({
    token,
    expiresAt: { $gt: new Date() },
  });

  if (!resetDoc) {
    return respond(res, 400, null, "Token is invalid or expired");
  }

  const user = await User.findById(resetDoc.userId);
  user.password = newPassword;
  await user.save();

  // Delete used token
  await ResetToken.deleteOne({ _id: resetDoc._id });

  respond(res, 200, null, "Password reset successfully");
});

module.exports = { register, login, getMe, forgotPassword, resetPassword };
