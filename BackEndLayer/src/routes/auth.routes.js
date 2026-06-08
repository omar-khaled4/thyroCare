const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
} = require("../controllers/auth.controller");

const sendEmail = require("../utils/sendEmail");

// TEMPORARY — remove after testing
router.get("/test-email", async (req, res) => {
  try {
    await sendEmail({
      to: "omar.khaled30320@gmail.com",
      subject: "ThyroCare Test",
      html: "<h2>Test email from ThyroCare!</h2>",
    });
    res.json({ success: true, message: "Email sent!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);
router.get("/me", auth, getMe);

module.exports = router;
