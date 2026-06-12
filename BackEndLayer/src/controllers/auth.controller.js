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

  const userExists = await User.findOne({ email });
  if (userExists) {
    return respond(res, 400, null, "email already exists");
  }

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

    // Don't throw — user can resend verification from the verify page
  });

  respond(res, 201, { user }, "Registered successfully. Please check your email to verify your account.");
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
    subject: "Verify your ThyroCare account",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #00B3A1; margin: 0;">ThyroCare</h1>
      </div>
      <h2 style="color: #333;">Welcome, ${firstName}!</h2>
      <p style="color: #555; line-height: 1.6;">
        Thank you for registering with ThyroCare. Please verify your email address to activate your account.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verifyUrl}" style="
          display: inline-block; padding: 14px 28px;
          background-color: #00B3A1; color: white;
          text-decoration: none; border-radius: 8px;
          font-weight: bold; font-size: 16px;
        ">Verify My Email</a>
      </div>
      <p style="color: #777; font-size: 14px;">
        Or copy this link: ${verifyUrl}
      </p>
      <p style="color: #999; font-size: 13px;">
        This link expires in 24 hours. If you didn't create an account, please ignore this email.
      </p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #aaa; font-size: 12px; text-align: center;">
        ThyroCare — AI-Powered Thyroid Health Platform
      </p>
    </div>
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

  // Send actual reset email
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  await sendEmail({
    to: email,
    subject: "Reset your ThyroCare password",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #00B3A1; margin: 0;">ThyroCare</h1>
      </div>
      <h2 style="color: #333;">Password Reset</h2>
      <p style="color: #555; line-height: 1.6;">
        We received a request to reset your password. Click the button below to set a new password.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="
          display: inline-block; padding: 14px 28px;
          background-color: #00B3A1; color: white;
          text-decoration: none; border-radius: 8px;
          font-weight: bold; font-size: 16px;
        ">Reset Password</a>
      </div>
      <p style="color: #777; font-size: 14px;">
        Or copy this link: ${resetUrl}
      </p>
      <p style="color: #999; font-size: 13px;">
        This link expires in 1 hour. If you didn't request this, please ignore this email.
      </p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #aaa; font-size: 12px; text-align: center;">
        ThyroCare — AI-Powered Thyroid Health Platform
      </p>
    </div>
  `,
  }).catch((err) => {

  });

  respond(res, 200, null, "Reset link sent to your email. Please check your inbox.");
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
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    return respond(
      res,
      400,
      null,
      "Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character."
    );
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