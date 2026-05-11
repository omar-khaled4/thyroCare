const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile.routes");
const labResultRoutes = require("./routes/labResult.routes");
const symptomRoutes = require("./routes/symptom.routes");
const reportRoutes = require("./routes/report.routes");
const chatRoutes = require("./routes/chat.routes");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/lab-results", labResultRoutes);
app.use("/api/symptoms", symptomRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/chat", chatRoutes);

// --- Health check ---
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API is running" });
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Thyroid Lab API is running. Go to /api/health",
  });
});

// --- Global error handler (MUST be last) ---
app.use(errorHandler);

module.exports = app;
