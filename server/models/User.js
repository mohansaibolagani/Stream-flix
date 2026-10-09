const mongoose = require("mongoose");
const { getDbType, readData, writeData } = require("../config/db");

// 1. Mongoose Schema
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      default: ""
    },
    profileImage: {
      type: String,
      default: "😎"
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER"
    },
    status: {
      type: String,
      enum: ["ACTIVE", "DISABLED"],
      default: "ACTIVE"
    },
    watchlist: [
      {
        mediaId: { type: String, required: true },
        title: String,
        posterUrl: String,
        type: String,
        addedAt: { type: Date, default: Date.now }
      }
    ],
    watchHistory: [
      {
        mediaId: { type: String, required: true },
        title: String,
        progress: { type: Number, default: 0 },
        watchedAt: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true
  }
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

const MongooseUser = mongoose.models.User || mongoose.model("User", userSchema);

// Helper to sanitize user object
function sanitizeUser(u) {
  if (!u) return null;
  const user = { ...u };
  delete user.passwordHash;
  return user;
}

// 2. Hybrid Model Adapter
const User = {
  async findOne(filter = {}) {
    if (getDbType() === "mongodb") {
      return await MongooseUser.findOne(filter);
    }
    const data = readData();
    return data.users.find(u => {
      if (filter.email && u.email.toLowerCase() === filter.email.toLowerCase()) return true;
      if (filter.username && u.username.toLowerCase() === filter.username.toLowerCase()) return true;
      if (filter._id && (u._id === filter._id || u.id === filter._id)) return true;
      if (filter.$or) {
        return filter.$or.some(clause => {
          if (clause.email && u.email.toLowerCase() === clause.email.toLowerCase()) return true;
          if (clause.username && u.username.toLowerCase() === clause.username.toLowerCase()) return true;
          return false;
        });
      }
      return false;
    }) || null;
  },

  async findById(id) {
    if (getDbType() === "mongodb") {
      return await MongooseUser.findById(id);
    }
    const data = readData();
    return data.users.find(u => u._id === id || u.id === id) || null;
  },

  async find(filter = {}) {
    if (getDbType() === "mongodb") {
      return await MongooseUser.find(filter).sort({ createdAt: -1 });
    }
    const data = readData();
    let result = [...data.users];
    if (filter.role) {
      result = result.filter(u => u.role === filter.role);
    }
    if (filter.status) {
      result = result.filter(u => u.status === filter.status);
    }
    return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async create(userData) {
    if (getDbType() === "mongodb") {
      return await MongooseUser.create(userData);
    }
    const data = readData();
    const now = new Date().toISOString();
    const newUser = {
      _id: "usr_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      fullName: userData.fullName,
      email: userData.email.toLowerCase().trim(),
      username: userData.username.toLowerCase().trim(),
      passwordHash: userData.passwordHash,
      phone: userData.phone || "",
      profileImage: userData.profileImage || "😎",
      role: userData.role || "USER",
      status: userData.status || "ACTIVE",
      watchlist: userData.watchlist || [],
      watchHistory: userData.watchHistory || [],
      createdAt: now,
      updatedAt: now
    };
    data.users.push(newUser);
    writeData(data);
    return newUser;
  },

  async findByIdAndUpdate(id, updateData, options = { new: true }) {
    if (getDbType() === "mongodb") {
      return await MongooseUser.findByIdAndUpdate(id, updateData, options);
    }
    const data = readData();
    const idx = data.users.findIndex(u => u._id === id || u.id === id);
    if (idx === -1) return null;

    // Handle updates
    const current = data.users[idx];
    const updated = {
      ...current,
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    data.users[idx] = updated;
    writeData(data);
    return updated;
  },

  async findByIdAndDelete(id) {
    if (getDbType() === "mongodb") {
      return await MongooseUser.findByIdAndDelete(id);
    }
    const data = readData();
    const idx = data.users.findIndex(u => u._id === id || u.id === id);
    if (idx === -1) return null;
    const removed = data.users.splice(idx, 1)[0];
    writeData(data);
    return removed;
  },

  async countDocuments(filter = {}) {
    if (getDbType() === "mongodb") {
      return await MongooseUser.countDocuments(filter);
    }
    const data = readData();
    if (Object.keys(filter).length === 0) return data.users.length;
    return data.users.filter(u => {
      if (filter.role && u.role !== filter.role) return false;
      if (filter.status && u.status !== filter.status) return false;
      return true;
    }).length;
  },

  sanitizeUser
};

module.exports = User;
