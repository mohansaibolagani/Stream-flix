const express = require("express");
const cors = require("cors");
const path = require("path");
const { apiLimiter } = require("./middleware/rateLimiter");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const movieRoutes = require("./routes/movieRoutes");

const app = express();

// Security & Parsing Middlewares
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

// Apply general rate limiting to /api routes
app.use("/api", apiLimiter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "StreamFlix OTT API",
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/movies", movieRoutes);

// Serve static frontend files from project root
const staticPath = path.join(__dirname, "..");
app.use(express.static(staticPath));

// Fallback for HTML5 client-side routing (Express 5 compatible)
app.use((req, res) => {
  // If request is for an API endpoint that wasn't matched, return 404 JSON
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ success: false, message: "API endpoint not found." });
  }
  res.sendFile(path.join(staticPath, "index.html"));
});

// Global Safe Error Handler
app.use((err, req, res, next) => {
  console.error("[ServerError]", err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "An unexpected internal server error occurred."
  });
});

module.exports = app;
