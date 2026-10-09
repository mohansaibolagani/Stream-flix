const mongoose = require("mongoose");
const { getDbType, readData, writeData } = require("../config/db");

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ["MOVIE", "TV_SHOW"], default: "MOVIE" },
    posterUrl: { type: String, required: true },
    backdropUrl: { type: String, default: "" },
    description: { type: String, default: "" },
    matchScore: { type: Number, default: 95 },
    rating: { type: String, default: "TV-MA" },
    year: { type: Number, default: 2024 },
    durationOrSeasons: { type: String, default: "1 Season" },
    genres: [{ type: String }],
    cast: [{ type: String }],
    director: { type: String, default: "" },
    badge: { type: String, default: "" },
    isOriginal: { type: Boolean, default: false },
    isBillboard: { type: Boolean, default: false },
    episodes: [
      {
        id: String,
        number: Number,
        title: String,
        duration: String,
        description: String,
        thumbnailUrl: String
      }
    ]
  },
  { timestamps: true }
);

const MongooseMovie = mongoose.models.Movie || mongoose.model("Movie", movieSchema);

const Movie = {
  async find(filter = {}) {
    if (getDbType() === "mongodb") {
      return await MongooseMovie.find(filter).sort({ createdAt: -1 });
    }
    const data = readData();
    let result = [...(data.movies || [])];
    if (filter.type) {
      result = result.filter(m => m.type === filter.type);
    }
    return result;
  },

  async findById(id) {
    if (getDbType() === "mongodb") {
      return await MongooseMovie.findById(id);
    }
    const data = readData();
    return (data.movies || []).find(m => m._id === id || m.id === id) || null;
  },

  async create(movieData) {
    if (getDbType() === "mongodb") {
      return await MongooseMovie.create(movieData);
    }
    const data = readData();
    if (!data.movies) data.movies = [];
    const now = new Date().toISOString();
    const newMovie = {
      _id: "mov_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      title: movieData.title,
      type: movieData.type || "MOVIE",
      posterUrl: movieData.posterUrl,
      backdropUrl: movieData.backdropUrl || movieData.posterUrl,
      description: movieData.description || "",
      matchScore: Number(movieData.matchScore) || 95,
      rating: movieData.rating || "TV-MA",
      year: Number(movieData.year) || new Date().getFullYear(),
      durationOrSeasons: movieData.durationOrSeasons || "1 Season",
      genres: Array.isArray(movieData.genres) ? movieData.genres : (movieData.genres ? movieData.genres.split(",").map(s => s.trim()) : ["Action"]),
      cast: Array.isArray(movieData.cast) ? movieData.cast : (movieData.cast ? movieData.cast.split(",").map(s => s.trim()) : []),
      director: movieData.director || "",
      badge: movieData.badge || "",
      isOriginal: !!movieData.isOriginal,
      isBillboard: !!movieData.isBillboard,
      episodes: movieData.episodes || [],
      createdAt: now,
      updatedAt: now
    };
    data.movies.unshift(newMovie);
    writeData(data);
    return newMovie;
  },

  async findByIdAndUpdate(id, updateData) {
    if (getDbType() === "mongodb") {
      return await MongooseMovie.findByIdAndUpdate(id, updateData, { new: true });
    }
    const data = readData();
    if (!data.movies) data.movies = [];
    const idx = data.movies.findIndex(m => m._id === id || m.id === id);
    if (idx === -1) return null;
    const current = data.movies[idx];
    const updated = {
      ...current,
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    data.movies[idx] = updated;
    writeData(data);
    return updated;
  },

  async findByIdAndDelete(id) {
    if (getDbType() === "mongodb") {
      return await MongooseMovie.findByIdAndDelete(id);
    }
    const data = readData();
    if (!data.movies) data.movies = [];
    const idx = data.movies.findIndex(m => m._id === id || m.id === id);
    if (idx === -1) return null;
    const removed = data.movies.splice(idx, 1)[0];
    writeData(data);
    return removed;
  },

  async countDocuments(filter = {}) {
    if (getDbType() === "mongodb") {
      return await MongooseMovie.countDocuments(filter);
    }
    const data = readData();
    return (data.movies || []).length;
  }
};

module.exports = Movie;
