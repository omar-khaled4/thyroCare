const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return; // reuse existing connection

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not defined");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    throw err; // don't call process.exit() — just throw
  }
};

module.exports = connectDB;