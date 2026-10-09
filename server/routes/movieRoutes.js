const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");

// Public endpoints to browse catalog
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    const movies = await Movie.find(filter);
    res.json({ success: true, count: movies.length, movies });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching catalog." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: "Title not found." });
    }
    res.json({ success: true, movie });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching title." });
  }
});

module.exports = router;
