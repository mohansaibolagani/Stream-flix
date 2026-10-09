const jwt = require("jsonwebtoken");
const config = require("../config/config");
const User = require("../models/User");

async function authenticate(req, res, next) {
  try {
    let token = null;

    // 1. Check Authorization Bearer header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.headers["x-access-token"]) {
      token = req.headers["x-access-token"];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing. Please log in."
      });
    }

    // 2. Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwtSecret);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Session expired. Please log in again."
        });
      }
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token."
      });
    }

    // 3. Find user in database
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account no longer exists."
      });
    }

    // 4. Check account status (Disabled Check)
    if (user.status === "DISABLED") {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Please contact support."
      });
    }

    req.user = User.sanitizeUser(user);
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    res.status(500).json({
      success: false,
      message: "Internal server error during authentication."
    });
  }
}

module.exports = { authenticate };
