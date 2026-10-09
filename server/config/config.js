require("dotenv").config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "streamflix_super_secure_jwt_secret_key_2026_change_in_prod",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/streamflix",
  adminEmail: process.env.ADMIN_EMAIL || "admin@streamflix.com",
  adminPassword: process.env.ADMIN_PASSWORD || "Admin@12345",
  adminUsername: process.env.ADMIN_USERNAME || "admin",
  adminFullName: process.env.ADMIN_FULLNAME || "System Administrator",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5000"
};
