require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 5000;

// Local development only
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}/`);
  });
}

// Keep the LLM service alive by pinging it every 10 minutes
const LLM_URL = process.env.NN_MODEL_URL || "http://127.0.0.1:8000";

setInterval(async () => {
  try {
    await fetch(`${LLM_URL}/`);
    console.log("[keep-alive] LLM service pinged successfully");
  } catch (err) {
    console.log("[keep-alive] LLM service ping failed:", err.message);
  }
}, 10 * 60 * 1000); // every 10 minutes

// Vercel serverless export
module.exports = app;