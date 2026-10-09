const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Movie = require("../models/Movie");

// 1. Dashboard Statistics
async function getDashboardStats(req, res) {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "ADMIN" });
    const totalActiveUsers = await User.countDocuments({ status: "ACTIVE" });
    const totalMovies = await Movie.countDocuments();

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalAdmins,
        totalActiveUsers,
        totalMovies,
        serverTime: new Date()
      }
    });
  } catch (err) {
    console.error("Admin stats error:", err.message);
    res.status(500).json({ success: false, message: "Failed to load dashboard statistics." });
  }
}

// 2. User Management: Get Users (Search, Filter, Pagination)
async function getUsers(req, res) {
  try {
    let { search, role, status, page = 1, limit = 10 } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    let users = await User.find();

    // Filter by search
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      users = users.filter(u =>
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        (u._id && u._id.toString().includes(q))
      );
    }

    // Filter by role
    if (role && role !== "ALL") {
      users = users.filter(u => u.role === role);
    }

    // Filter by status
    if (status && status !== "ALL") {
      users = users.filter(u => u.status === status);
    }

    const total = users.length;
    const startIndex = (page - 1) * limit;
    const paginated = users.slice(startIndex, startIndex + limit).map(User.sanitizeUser);

    res.json({
      success: true,
      users: paginated,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1
      }
    });
  } catch (err) {
    console.error("Admin getUsers error:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch users." });
  }
}

// 3. User Details
async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    res.json({ success: true, user: User.sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch user details." });
  }
}

// 4. Update User Status (Activate / Deactivate) with Last-Admin Safeguard
async function updateUserStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["ACTIVE", "DISABLED"].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be ACTIVE or DISABLED." });
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // SAFEGUARD: Prevent deactivating the last active administrator
    if (targetUser.role === "ADMIN" && status === "DISABLED") {
      const activeAdmins = (await User.find({ role: "ADMIN", status: "ACTIVE" })).filter(
        u => (u._id || u.id).toString() !== id.toString()
      );
      if (activeAdmins.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Action rejected: You cannot deactivate the only remaining active administrator."
        });
      }
    }

    const updated = await User.findByIdAndUpdate(id, { status }, { new: true });

    res.json({
      success: true,
      message: `User account has been ${status === "ACTIVE" ? "activated" : "deactivated"}.`,
      user: User.sanitizeUser(updated)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update user status." });
  }
}

// 5. Update User Role (USER <-> ADMIN) with Last-Admin Safeguard
async function updateUserRole(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["USER", "ADMIN"].includes(role)) {
      return res.status(400).json({ success: false, message: "Role must be USER or ADMIN." });
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // SAFEGUARD: Prevent demoting the last active administrator
    if (targetUser.role === "ADMIN" && role === "USER") {
      const activeAdmins = (await User.find({ role: "ADMIN", status: "ACTIVE" })).filter(
        u => (u._id || u.id).toString() !== id.toString()
      );
      if (activeAdmins.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Action rejected: You cannot demote the only remaining active administrator."
        });
      }
    }

    const updated = await User.findByIdAndUpdate(id, { role }, { new: true });

    res.json({
      success: true,
      message: `User role updated to ${role}.`,
      user: User.sanitizeUser(updated)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update user role." });
  }
}

// 6. Delete User with Last-Admin Safeguard
async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // SAFEGUARD: Prevent deleting the last active administrator
    if (targetUser.role === "ADMIN") {
      const activeAdmins = (await User.find({ role: "ADMIN", status: "ACTIVE" })).filter(
        u => (u._id || u.id).toString() !== id.toString()
      );
      if (activeAdmins.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Action rejected: You cannot delete the only remaining active administrator."
        });
      }
    }

    await User.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "User account deleted successfully."
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete user." });
  }
}

// 7. Content Management: Movies & Series
async function getMovies(req, res) {
  try {
    const movies = await Movie.find();
    res.json({ success: true, count: movies.length, movies });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch movies catalog." });
  }
}

async function createMovie(req, res) {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json({
      success: true,
      message: "Title added to catalog successfully.",
      movie
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to create title." });
  }
}

async function updateMovie(req, res) {
  try {
    const updated = await Movie.findByIdAndUpdate(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Title not found." });
    }
    res.json({
      success: true,
      message: "Title updated successfully.",
      movie: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update title." });
  }
}

async function deleteMovie(req, res) {
  try {
    const removed = await Movie.findByIdAndDelete(req.params.id);
    if (!removed) {
      return res.status(404).json({ success: false, message: "Title not found." });
    }
    res.json({
      success: true,
      message: "Title deleted from catalog successfully."
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete title." });
  }
}

// 8. Admin Settings: Change Password
async function changeAdminPassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.user._id || req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Current and new password are required." });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: "New password must be at least 8 characters long." });
    }

    const admin = await User.findById(adminId);
    const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password is incorrect." });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(adminId, { passwordHash });

    res.json({
      success: true,
      message: "Admin password updated successfully."
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update admin password." });
  }
}

module.exports = {
  getDashboardStats,
  getUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
  deleteUser,
  getMovies,
  createMovie,
  updateMovie,
  deleteMovie,
  changeAdminPassword
};
