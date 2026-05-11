const { respond } = require("../utils/helpers");

/**
 * Global error handler — must be the last middleware in app.js
 */
const errorHandler = (err, req, res, next) => {
  console.error("ERROR:", err.message);

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return respond(res, 409, null, `${field} already exists`);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const msg = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    return respond(res, 400, null, msg);
  }

  // Mongoose cast error (bad ObjectId, etc.)
  if (err.name === "CastError") {
    return respond(res, 400, null, `Invalid ${err.path}: ${err.value}`);
  }

  // Default
  const status = err.statusCode || 500;
  return respond(res, status, null, err.message || "Internal server error");
};

module.exports = errorHandler;
