const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile.routes");
const labResultRoutes = require("./routes/labResult.routes");
const symptomRoutes = require("./routes/symptom.routes");
const reportRoutes = require("./routes/report.routes");
const chatRoutes = require("./routes/chat.routes");
const predictionRoutes = require("./routes/prediction.routes");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- DB Connection Middleware (runs before every request) ---
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ success: false, message: "Database connection failed" });
  }
});

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/lab-results", labResultRoutes);
app.use("/api/symptoms", symptomRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/predict", predictionRoutes);

// --- Health check ---
app.get("/api", (req, res) => {
  res.json({ success: true, message: "API is running" });
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Thyroid Lab API is running. Go to /api",
  });
});

// test DB connection

app.get("/api/dbtest", async (req, res) => {
  try {
    await connectDB();
    res.json({ success: true, message: "DB connected!" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// --- Global error handler (MUST be last) ---
app.use(errorHandler);

module.exports = app;