// Email regex validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Username regex: 3-30 chars, alphanumeric and underscore
const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;

function validateSignup(req, res, next) {
  const { fullName, email, username, password, confirmPassword } = req.body;

  if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: "Full name must be at least 2 characters long."
    });
  }

  if (!email || !emailRegex.test(email.trim())) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address."
    });
  }

  if (!username || !usernameRegex.test(username.trim())) {
    return res.status(400).json({
      success: false,
      message: "Username must be 3-30 characters long and contain only letters, numbers, and underscores."
    });
  }

  if (!password || typeof password !== "string" || password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters long."
    });
  }

  // Password strength: require at least 1 number and 1 letter
  if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)) {
    return res.status(400).json({
      success: false,
      message: "Password must contain both letters and at least one number."
    });
  }

  if (confirmPassword !== undefined && password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Passwords do not match."
    });
  }

  next();
}

function validateLogin(req, res, next) {
  const { identifier, password } = req.body;

  if (!identifier || typeof identifier !== "string" || !identifier.trim()) {
    return res.status(400).json({
      success: false,
      message: "Please enter your email or username."
    });
  }

  if (!password || typeof password !== "string") {
    return res.status(400).json({
      success: false,
      message: "Please enter your password."
    });
  }

  next();
}

function validateMovie(req, res, next) {
  const { title, posterUrl } = req.body;

  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      success: false,
      message: "Title is required."
    });
  }

  if (!posterUrl || typeof posterUrl !== "string" || !posterUrl.trim()) {
    return res.status(400).json({
      success: false,
      message: "Poster URL is required."
    });
  }

  next();
}

module.exports = {
  validateSignup,
  validateLogin,
  validateMovie
};
