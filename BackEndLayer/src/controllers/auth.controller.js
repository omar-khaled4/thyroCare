const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const ResetToken = require("../models/ResetToken");
const { respond, tryCatch } = require("../utils/helpers");

/**
 * POST /api/auth/register
 * Body: { name, email, password }
 */
const register = tryCatch(async (req, res) => {
  const { firstName, lastName, email, phone, password, dateOfBirth, gender } = req.body;

  // ... existing validation ...

  // Generate verification token
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const user = await User.create({
    firstName, lastName, email, phone, password, dateOfBirth, gender,
    emailVerificationToken: verificationToken,
    emailVerificationExpires: verificationExpires,
    isEmailVerified: false,
  });

  // Send verification email (don't block registration if email fails)
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
  sendEmail({
    to: email,
    subject: "ThyroCare — Verify Your Email",
    html: `
      <h2>Welcome to ThyroCare, ${firstName}!</h2>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verifyUrl}" style="
        display: inline-block; padding: 12px 24px;
        background-color: #00b3a1; color: white;
        text-decoration: none; border-radius: 8px;
        font-weight: bold;
      ">Verify Email</a>
      <p>This link expires in 24 hours.</p>
      <p>If you didn't create an account, please ignore this email.</p>
    `,
  }).catch((err) => {
    console.error("[register] Failed to send verification email:", err.message);
    // Don't throw — user can resend verification from the verify page
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  respond(res, 201, { user, token }, "Registered successfully. Please check your email to verify your account.");
});


/**
 * GET /api/auth/verify-email?token=xxx
 * Marks the user's email as verified.
 */
const verifyEmail = tryCatch(async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return respond(res, 400, null, "Verification token is required");
  }

  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationExpires: { $gt: new Date() },
  });

  if (!user) {
    return respond(res, 400, null, "Invalid or expired verification token");
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  respond(res, 200, null, "Email verified successfully! You can now log in.");
});

/**
 * POST /api/auth/resend-verification
 * Body: { email }
 * Resends the verification email.
 */
const resendVerification = tryCatch(async (req, res) => {
  const { email } = req.body;
  if (!email) return respond(res, 400, null, "Email is required");

  const user = await User.findOne({ email });
  if (!user) return respond(res, 404, null, "No user found with that email");

  if (user.isEmailVerified) {
    return respond(res, 400, null, "Email is already verified");
  }

  // Generate new token
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  user.emailVerificationToken = verificationToken;
  user.emailVerificationExpires = verificationExpires;
  await user.save();

  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
  await sendEmail({
    to: email,
    subject: "ThyroCare — Verify Your Email",
    html: `
      <h2>Email Verification</h2>
      <p>Click the link below to verify your email:</p>
      <a href="${verifyUrl}" style="
        display: inline-block; padding: 12px 24px;
        background-color: #00b3a1; color: white;
        text-decoration: none; border-radius: 8px;
        font-weight: bold;
      ">Verify Email</a>
      <p>This link expires in 24 hours.</p>
    `,
  });

  respond(res, 200, null, "Verification email resent successfully");
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

  if (!user.isEmailVerified) {
    return respond(res, 403, null, "Please verify your email before logging in. Check your inbox for the verification link.");
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

module.exports = { register, login, getMe, forgotPassword, resetPassword, verifyEmail, resendVerification };