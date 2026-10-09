const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Movie = require("../models/Movie");

// 1. Get Profile
async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user._id || req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    res.json({ success: true, user: User.sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch profile." });
  }
}

// 2. Update Profile
async function updateProfile(req, res) {
  try {
    const { fullName, phone, profileImage } = req.body;
    const userId = req.user._id || req.user.id;

    const updates = {};
    if (fullName && fullName.trim()) updates.fullName = fullName.trim();
    if (phone !== undefined) updates.phone = phone.trim();
    if (profileImage !== undefined) updates.profileImage = profileImage;

    const updated = await User.findByIdAndUpdate(userId, updates, { new: true });
    res.json({
      success: true,
      message: "Profile updated successfully.",
      user: User.sanitizeUser(updated)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update profile." });
  }
}

// 3. Update Password
async function updatePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id || req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required."
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters long."
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect."
      });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(userId, { passwordHash });

    res.json({
      success: true,
      message: "Password changed successfully."
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to change password." });
  }
}

// 4. Watchlist
async function getWatchlist(req, res) {
  try {
    const user = await User.findById(req.user._id || req.user.id);
    res.json({ success: true, watchlist: user.watchlist || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to load watchlist." });
  }
}

async function toggleWatchlist(req, res) {
  try {
    const { mediaId, title, posterUrl, type } = req.body;
    const userId = req.user._id || req.user.id;

    if (!mediaId) {
      return res.status(400).json({ success: false, message: "mediaId is required." });
    }

    const user = await User.findById(userId);
    let watchlist = user.watchlist || [];

    const existingIdx = watchlist.findIndex(item => item.mediaId === mediaId);
    let action = "added";

    if (existingIdx > -1) {
      watchlist.splice(existingIdx, 1);
      action = "removed";
    } else {
      watchlist.push({
        mediaId,
        title: title || "Media Item",
        posterUrl: posterUrl || "",
        type: type || "MOVIE",
        addedAt: new Date()
      });
      action = "added";
    }

    const updated = await User.findByIdAndUpdate(userId, { watchlist }, { new: true });

    res.json({
      success: true,
      action,
      message: action === "added" ? "Added to your Watchlist" : "Removed from your Watchlist",
      watchlist: updated.watchlist
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update watchlist." });
  }
}

// 5. Watch History
async function getHistory(req, res) {
  try {
    const user = await User.findById(req.user._id || req.user.id);
    res.json({ success: true, history: user.watchHistory || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to load watch history." });
  }
}

async function addHistory(req, res) {
  try {
    const { mediaId, title, progress } = req.body;
    const userId = req.user._id || req.user.id;

    if (!mediaId) {
      return res.status(400).json({ success: false, message: "mediaId is required." });
    }

    const user = await User.findById(userId);
    let history = user.watchHistory || [];

    // Filter out existing entry for this media if present
    history = history.filter(h => h.mediaId !== mediaId);

    // Add to top of list
    history.unshift({
      mediaId,
      title: title || "Media Title",
      progress: Number(progress) || 100,
      watchedAt: new Date()
    });

    // Keep last 30 items
    if (history.length > 30) history = history.slice(0, 30);

    const updated = await User.findByIdAndUpdate(userId, { watchHistory: history }, { new: true });

    res.json({
      success: true,
      history: updated.watchHistory
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to record watch history." });
  }
}

module.exports = {
  getProfile,
  updateProfile,
  updatePassword,
  getWatchlist,
  toggleWatchlist,
  getHistory,
  addHistory
};
