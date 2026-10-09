const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimiter");
const { validateSignup, validateLogin } = require("../middleware/validate");

// Public auth endpoints
router.post("/signup", authLimiter, validateSignup, authController.signup);
router.post("/login", authLimiter, validateLogin, authController.login);
router.post("/admin/login", authLimiter, validateLogin, authController.adminLogin);
router.post("/forgot-password", authLimiter, authController.forgotPassword);
router.post("/reset-password", authLimiter, authController.resetPassword);

// Authenticated session endpoints
router.post("/logout", authenticate, authController.logout);
router.get("/me", authenticate, authController.getMe);

module.exports = router;
