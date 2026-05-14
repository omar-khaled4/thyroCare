require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// Connect to DB on cold start
connectDB().catch((err) => console.error("DB connection failed:", err));

// For local development
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}/`);
  });
}

// For Vercel (serverless export)
module.exports = app;