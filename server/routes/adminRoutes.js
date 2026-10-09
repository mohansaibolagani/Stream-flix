const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { authenticate } = require("../middleware/auth");
const { requireRole } = require("../middleware/requireRole");
const { validateMovie } = require("../middleware/validate");

// All admin routes strictly require valid authentication and ADMIN role
router.use(authenticate, requireRole("ADMIN"));

// Dashboard Statistics
router.get("/dashboard", adminController.getDashboardStats);

// User Management
router.get("/users", adminController.getUsers);
router.get("/users/:id", adminController.getUserById);
router.patch("/users/:id/status", adminController.updateUserStatus);
router.patch("/users/:id/role", adminController.updateUserRole);
router.delete("/users/:id", adminController.deleteUser);

// Content Management
router.get("/movies", adminController.getMovies);
router.post("/movies", validateMovie, adminController.createMovie);
router.put("/movies/:id", validateMovie, adminController.updateMovie);
router.delete("/movies/:id", adminController.deleteMovie);

// Admin Settings
router.patch("/settings/password", adminController.changeAdminPassword);

module.exports = router;
