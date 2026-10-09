const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticate } = require("../middleware/auth");
const { requireRole } = require("../middleware/requireRole");

// All user routes require authentication and USER or ADMIN role
router.use(authenticate, requireRole("USER", "ADMIN"));

router.get("/me", userController.getProfile);
router.patch("/me", userController.updateProfile);
router.patch("/me/password", userController.updatePassword);

router.get("/me/watchlist", userController.getWatchlist);
router.post("/me/watchlist", userController.toggleWatchlist);

router.get("/me/history", userController.getHistory);
router.post("/me/history", userController.addHistory);

module.exports = router;
