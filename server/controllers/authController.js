const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("../config/config");

// In-memory or temporary reset tokens map
const passwordResetTokens = new Map();

// Helper to sign JWT
function generateToken(user, rememberMe = false) {
  const expiresIn = rememberMe ? "30d" : config.jwtExpiresIn;
  return jwt.sign(
    {
      id: user._id || user.id,
      email: user.email,
      username: user.username,
      role: user.role
    },
    config.jwtSecret,
    { expiresIn }
  );
}

// 1. User Signup
async function signup(req, res) {
  try {
    const { fullName, email, username, password, phone, profileImage } = req.body;

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUsername = username.toLowerCase().trim();

    // Check if email already registered
    const existingEmail = await User.findOne({ email: normalizedEmail });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "An account with this email address already exists. Please log in."
      });
    }

    // Check if username already taken
    const existingUsername = await User.findOne({ username: normalizedUsername });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: "This username is already taken. Please choose another."
      });
    }

    // Hash password with 12 salt rounds
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user (Strictly force role to USER to prevent privilege escalation)
    const newUser = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      username: normalizedUsername,
      passwordHash,
      phone: phone ? phone.trim() : "",
      profileImage: profileImage || "😎",
      role: "USER",
      status: "ACTIVE",
      watchlist: [],
      watchHistory: []
    });

    const sanitized = User.sanitizeUser(newUser);

    res.status(201).json({
      success: true,
      message: "Registration successful! You can now log in.",
      user: sanitized
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error during registration. Please try again."
    });
  }
}

// 2. User Login
async function login(req, res) {
  try {
    const { identifier, password, rememberMe } = req.body;
    const cleanIdentifier = identifier.toLowerCase().trim();

    // Find by email or username
    const user = await User.findOne({
      $or: [{ email: cleanIdentifier }, { username: cleanIdentifier }]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email/username or password."
      });
    }

    // Check if account is disabled
    if (user.status === "DISABLED") {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Please contact support."
      });
    }

    // Verify password hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email/username or password."
      });
    }

    const token = generateToken(user, !!rememberMe);
    const sanitized = User.sanitizeUser(user);

    res.json({
      success: true,
      message: "Login successful.",
      token,
      user: sanitized
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error during login. Please try again."
    });
  }
}

// 3. Admin Login
async function adminLogin(req, res) {
  try {
    const { identifier, password } = req.body;
    const cleanIdentifier = identifier.toLowerCase().trim();

    const user = await User.findOne({
      $or: [{ email: cleanIdentifier }, { username: cleanIdentifier }]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid administrator credentials."
      });
    }

    // Verify admin role strictly on backend
    if (user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied. You do not have administrator privileges."
      });
    }

    // Check status
    if (user.status === "DISABLED") {
      return res.status(403).json({
        success: false,
        message: "This administrator account is deactivated. Please contact another administrator."
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid administrator credentials."
      });
    }

    const token = generateToken(user, false);
    const sanitized = User.sanitizeUser(user);

    res.json({
      success: true,
      message: "Admin authentication successful. Welcome back.",
      token,
      user: sanitized
    });
  } catch (err) {
    console.error("Admin login error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error during admin authentication."
    });
  }
}

// 4. Get Current User Info
async function getMe(req, res) {
  try {
    const user = await User.findById(req.user._id || req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    res.json({
      success: true,
      user: User.sanitizeUser(user)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching user profile." });
  }
}

// 5. Logout (Session/Token invalidation confirmation)
async function logout(req, res) {
  res.json({
    success: true,
    message: "Logged out successfully."
  });
}

// 6. Forgot Password
async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // For security, don't reveal whether user exists
      return res.json({
        success: true,
        message: "If an account with that email exists, password reset instructions have been generated."
      });
    }

    const resetToken = "rst_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
    passwordResetTokens.set(resetToken, {
      userId: user._id || user.id,
      expiresAt: Date.now() + 60 * 60 * 1000 // 1 hour
    });

    res.json({
      success: true,
      message: "Password reset token generated successfully.",
      resetToken, // Provided in response for functional recovery flow
      instructions: "Use this token on the reset password screen to update your password."
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error processing forgot password." });
  }
}

// 7. Reset Password
async function resetPassword(req, res) {
  try {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword) {
      return res.status(400).json({ success: false, message: "Reset token and new password are required." });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters." });
    }

    const tokenData = passwordResetTokens.get(resetToken);
    if (!tokenData || tokenData.expiresAt < Date.now()) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset token." });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(tokenData.userId, { passwordHash });
    passwordResetTokens.delete(resetToken);

    res.json({
      success: true,
      message: "Password has been successfully updated. You can now log in with your new password."
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error resetting password." });
  }
}

module.exports = {
  signup,
  login,
  adminLogin,
  getMe,
  logout,
  forgotPassword,
  resetPassword
};
