const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { respond } = require("../utils/helpers");

/**
 * Verifies the JWT from the Authorization header.
 * Attaches req.user = { id, role }
 */
const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return respond(res, 401, null, "No token provided");
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return respond(res, 401, null, "User no longer exists");
    }

    req.user = { id: user._id, role: user.role };
    next();
  } catch (err) {
    return respond(res, 401, null, "Invalid or expired token");
  }
};

module.exports = auth;
