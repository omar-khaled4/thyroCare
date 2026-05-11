/**
 * Wraps an async route handler so errors go to Express error middleware.
 * Usage: router.get('/', tryCatch(controller.fn))
 */
const tryCatch = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Sends a consistent JSON response.
 */
const respond = (res, statusCode, data = null, message = "") => {
  return res.status(statusCode).json({
    success: statusCode < 400,
    data,
    message,
  });
};

/**
 * Maps a lab record { date, value } to { date, t3/t4/tsh: value }
 * so the front-end gets the exact format it expects.
 */
const mapLabRecord = (type, record) => {
  const { date, value } = record;
  return { date, [type]: value };
};

module.exports = { tryCatch, respond, mapLabRecord };
