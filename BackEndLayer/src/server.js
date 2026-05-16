require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 5000;

// Local development only
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}/`);
  });
}

// Keep Railway ML model awake
setInterval(async () => {
  try {
    await fetch(`${process.env.NN_MODEL_URL}/`)
    console.log("NN model pinged successfully")
  } catch (err) {
    console.error("Failed to ping NN model:", err)
  }
}, 5 * 60 * 1000) // every 5 minutes

// Vercel serverless export
module.exports = app;