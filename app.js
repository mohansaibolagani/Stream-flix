// ==========================================
// STREAMFLIX OTT PLATFORM CLIENT APPLICATION
// ==========================================

// Global State
let currentUser = JSON.parse(localStorage.getItem("streamflix_user") || "null");
let authToken = localStorage.getItem("streamflix_token") || null;
let currentActiveMedia = null;
let currentView = "home";
let currentDTab = "watchlist";
let currentATab = "overview";
let adminCurrentPage = 1;
let adminSearchQuery = "";
let adminRoleFilter = "ALL";
let adminStatusFilter = "ALL";
let selectedSignupAvatar = "😎";
let selectedEditAvatar = "😎";

// API Request Helper
async function apiRequest(endpoint, method = "GET", body = null, requiresAuth = false) {
  const headers = { "Content-Type": "application/json" };
  if (requiresAuth && authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const options = { method, headers };
  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(endpoint, options);
    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    console.error("API error:", err);
    return { ok: false, status: 0, data: { success: false, message: "Network error. Please check server." } };
  }
}

// Client Routing (Hash & Navigation)
function navigateTo(view) {
  currentView = view;
  window.location.hash = view === "home" ? "" : view;

  // Hide all views
  document.querySelectorAll(".app-view").forEach(el => el.style.display = "none");

  // Auth Protection Checks
  if (view === "dashboard") {
    if (!authToken || !currentUser) {
      navigateTo("login");
      showAuthAlert("login", "Please sign in to access your dashboard.", "danger");
      return;
    }
    document.getElementById("user-dashboard-view").style.display = "block";
    loadUserDashboard();
    return;
  }

  if (view === "admin-dashboard") {
    if (!authToken || !currentUser || currentUser.role !== "ADMIN") {
      navigateTo("admin-login");
      showAuthAlert("admin-login", "Administrator privileges required to access Admin Console.", "danger");
      return;
    }
    document.getElementById("admin-dashboard-view").style.display = "flex";
    loadAdminDashboard();
    return;
  }

  if (view === "login") {
    document.getElementById("auth-view").style.display = "flex";
    document.getElementById("login-card").style.display = "block";
    document.getElementById("signup-card").style.display = "none";
    document.getElementById("admin-login-card").style.display = "none";
    return;
  }

  if (view === "signup") {
    document.getElementById("auth-view").style.display = "flex";
    document.getElementById("signup-card").style.display = "block";
    document.getElementById("login-card").style.display = "none";
    document.getElementById("admin-login-card").style.display = "none";
    return;
  }

  if (view === "admin-login") {
    document.getElementById("auth-view").style.display = "flex";
    document.getElementById("admin-login-card").style.display = "block";
    document.getElementById("login-card").style.display = "none";
    document.getElementById("signup-card").style.display = "none";
    return;
  }

  // Default: Home View
  document.getElementById("home-view").style.display = "block";
  document.getElementById("billboard").style.display = "flex";
  document.getElementById("main-content").style.display = "block";
  document.getElementById("search-results").style.display = "none";
}

function handleHashChange() {
  const hash = window.location.hash.replace("#", "").trim();
  if (hash === "login") navigateTo("login");
  else if (hash === "signup") navigateTo("signup");
  else if (hash === "admin/login" || hash === "admin-login") navigateTo("admin-login");
  else if (hash === "dashboard") navigateTo("dashboard");
  else if (hash === "admin/dashboard" || hash === "admin-dashboard") navigateTo("admin-dashboard");
  else navigateTo("home");
}

window.addEventListener("hashchange", handleHashChange);
// Navbar UI Updates
function updateNavbarAuthState() {
  const guestBox = document.getElementById("auth-nav-guest");
  const userBox = document.getElementById("auth-nav-user");
  const dropdownAdminItem = document.getElementById("dropdown-admin-item");

  if (authToken && currentUser) {
    guestBox.style.display = "none";
    userBox.style.display = "flex";
    document.getElementById("header-avatar-emoji").textContent = currentUser.profileImage || "😎";
    document.getElementById("dropdown-user-name").textContent = currentUser.fullName || currentUser.username;
    document.getElementById("dropdown-user-email").textContent = currentUser.email;
    document.getElementById("dropdown-user-role").textContent = currentUser.role;

    if (currentUser.role === "ADMIN") {
      dropdownAdminItem.style.display = "flex";
      document.getElementById("nav-dashboard-btn").innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
        <span>Admin</span>
      `;
      document.getElementById("nav-dashboard-btn").onclick = () => navigateTo("admin-dashboard");
    } else {
      dropdownAdminItem.style.display = "none";
      document.getElementById("nav-dashboard-btn").innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
        <span>Dashboard</span>
      `;
      document.getElementById("nav-dashboard-btn").onclick = () => navigateTo("dashboard");
    }

    // Update watchlist badge count
    const watchlistCount = currentUser.watchlist ? currentUser.watchlist.length : 0;
    document.getElementById("my-list-count").textContent = watchlistCount;
  } else {
    guestBox.style.display = "flex";
    userBox.style.display = "none";
    document.getElementById("my-list-count").textContent = "0";
  }
}

function toggleUserDropdown() {
  const dropdown = document.getElementById("user-dropdown");
  dropdown.classList.toggle("active");
}

function closeUserDropdown() {
  document.getElementById("user-dropdown").classList.remove("active");
}

document.addEventListener("click", (e) => {
  const wrapper = document.querySelector(".user-menu-wrapper");
  if (wrapper && !wrapper.contains(e.target)) {
    closeUserDropdown();
  }
});

// UI Helpers
function togglePasswordVisibility(fieldId) {
  const input = document.getElementById(fieldId);
  input.type = input.type === "password" ? "text" : "password";
}

function checkPasswordStrength(val) {
  const fill = document.getElementById("strength-fill");
  const hint = document.getElementById("pwd-hint");
  if (!val) {
    fill.style.width = "0%";
    hint.textContent = "Use 8+ chars with letters & numbers";
    return;
  }
  let score = 0;
  if (val.length >= 8) score++;
  if (/[a-zA-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^a-zA-Z0-9]/.test(val)) score++;

  if (score <= 2) {
    fill.style.width = "33%";
    fill.style.backgroundColor = "#ff5252";
    hint.textContent = "Weak password";
  } else if (score === 3) {
    fill.style.width = "66%";
    fill.style.backgroundColor = "#ffb142";
    hint.textContent = "Medium strength password";
  } else {
    fill.style.width = "100%";
    fill.style.backgroundColor = "#46d369";
    hint.textContent = "Strong password! Ready to go.";
  }
}

function selectSignupAvatar(el, emoji) {
  document.querySelectorAll("#signup-avatar-picker .avatar-opt").forEach(a => a.classList.remove("active"));
  el.classList.add("active");
  selectedSignupAvatar = emoji;
}

function selectEditAvatar(el, emoji) {
  document.querySelectorAll("#edit-avatar-picker .avatar-opt").forEach(a => a.classList.remove("active"));
  el.classList.add("active");
  selectedEditAvatar = emoji;
}

function showAuthAlert(card, message, type = "danger") {
  const alertEl = document.getElementById(`${card}-alert`);
  if (!alertEl) return;
  alertEl.className = `alert-box alert-${type}`;
  alertEl.textContent = message;
  alertEl.style.display = "block";
}

function clearAuthAlert(card) {
  const alertEl = document.getElementById(`${card}-alert`);
  if (alertEl) alertEl.style.display = "none";
}

// 1. User Signup Handler
async function handleSignupSubmit(e) {
  e.preventDefault();
  clearAuthAlert("signup");
  const btn = document.getElementById("signup-submit-btn");

  const fullName = document.getElementById("signup-fullname").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const username = document.getElementById("signup-username").value.trim();
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById("signup-confirm-password").value;
  const phone = document.getElementById("signup-phone").value.trim();

  if (password !== confirmPassword) {
    showAuthAlert("signup", "Passwords do not match.", "danger");
    return;
  }

  btn.disabled = true;
  btn.textContent = "Creating Account...";

  const res = await apiRequest("/api/auth/signup", "POST", {
    fullName,
    email,
    username,
    password,
    confirmPassword,
    phone,
    profileImage: selectedSignupAvatar
  });

  btn.disabled = false;
  btn.textContent = "Sign Up Now";

  if (!res.ok) {
    showAuthAlert("signup", res.data.message || "Registration failed.", "danger");
    return;
  }

  // Success
  showAuthAlert("signup", "Account created successfully! Redirecting to login...", "success");
  document.getElementById("signup-form").reset();
  setTimeout(() => {
    navigateTo("login");
    showAuthAlert("login", "Registration successful. Please log in with your credentials.", "success");
  }, 1200);
}

// 2. User Login Handler
async function handleLoginSubmit(e) {
  e.preventDefault();
  clearAuthAlert("login");
  const btn = document.getElementById("login-submit-btn");

  const identifier = document.getElementById("login-identifier").value.trim();
  const password = document.getElementById("login-password").value;
  const rememberMe = document.getElementById("login-remember").checked;

  btn.disabled = true;
  btn.textContent = "Signing In...";

  const res = await apiRequest("/api/auth/login", "POST", {
    identifier,
    password,
    rememberMe
  });

  btn.disabled = false;
  btn.textContent = "Sign In";

  if (!res.ok) {
    showAuthAlert("login", res.data.message || "Invalid credentials.", "danger");
    return;
  }

  // Save session
  authToken = res.data.token;
  currentUser = res.data.user;
  localStorage.setItem("streamflix_token", authToken);
  localStorage.setItem("streamflix_user", JSON.stringify(currentUser));

  updateNavbarAuthState();
  document.getElementById("login-form").reset();

  // Redirect to User Dashboard
  navigateTo("dashboard");
}

// 3. Admin Login Handler
async function handleAdminLoginSubmit(e) {
  e.preventDefault();
  clearAuthAlert("admin-login");
  const btn = document.getElementById("admin-submit-btn");

  const identifier = document.getElementById("admin-identifier").value.trim();
  const password = document.getElementById("admin-password").value;

  btn.disabled = true;
  btn.textContent = "Authenticating Admin...";

  const res = await apiRequest("/api/auth/admin/login", "POST", {
    identifier,
    password
  });

  btn.disabled = false;
  btn.textContent = "Authenticate Administrator";

  if (!res.ok) {
    showAuthAlert("admin-login", res.data.message || "Admin authorization rejected.", "danger");
    return;
  }

  // Save Admin session
  authToken = res.data.token;
  currentUser = res.data.user;
  localStorage.setItem("streamflix_token", authToken);
  localStorage.setItem("streamflix_user", JSON.stringify(currentUser));

  updateNavbarAuthState();
  document.getElementById("admin-login-form").reset();

  // Redirect to Admin Dashboard
  navigateTo("admin-dashboard");
}

// Logout Handler
async function handleLogout() {
  if (authToken) {
    await apiRequest("/api/auth/logout", "POST", {}, true);
  }
  authToken = null;
  currentUser = null;
  localStorage.removeItem("streamflix_token");
  localStorage.removeItem("streamflix_user");
  updateNavbarAuthState();
  closeUserDropdown();
  navigateTo("home");
}
// Password Recovery Flow
function openForgotPasswordModal() {
  document.getElementById("forgot-alert").style.display = "none";
  document.getElementById("forgot-step-1").style.display = "block";
  document.getElementById("forgot-step-2").style.display = "none";
  document.getElementById("forgot-email").value = "";
  document.getElementById("forgot-modal").style.display = "flex";
}

function closeForgotPasswordModal() {
  document.getElementById("forgot-modal").style.display = "none";
}

function closeForgotPasswordModalOnBackdrop(e) {
  if (e.target.id === "forgot-modal") closeForgotPasswordModal();
}

async function handleForgotPasswordRequest(e) {
  e.preventDefault();
  const email = document.getElementById("forgot-email").value.trim();
  const alertEl = document.getElementById("forgot-alert");

  const res = await apiRequest("/api/auth/forgot-password", "POST", { email });
  if (res.ok) {
    alertEl.className = "alert-box alert-success";
    alertEl.textContent = res.data.message || "Reset token generated.";
    alertEl.style.display = "block";

    // Advance to step 2 with token pre-filled if returned
    if (res.data.resetToken) {
      document.getElementById("reset-token-input").value = res.data.resetToken;
      document.getElementById("forgot-step-1").style.display = "none";
      document.getElementById("forgot-step-2").style.display = "block";
    }
  } else {
    alertEl.className = "alert-box alert-danger";
    alertEl.textContent = res.data.message || "Failed to process request.";
    alertEl.style.display = "block";
  }
}

async function handleResetPasswordSubmit(e) {
  e.preventDefault();
  const resetToken = document.getElementById("reset-token-input").value.trim();
  const newPassword = document.getElementById("reset-new-password").value;
  const alertEl = document.getElementById("forgot-alert");

  const res = await apiRequest("/api/auth/reset-password", "POST", { resetToken, newPassword });
  if (res.ok) {
    alertEl.className = "alert-box alert-success";
    alertEl.textContent = res.data.message || "Password updated successfully! You can now log in.";
    alertEl.style.display = "block";
    setTimeout(() => {
      closeForgotPasswordModal();
      navigateTo("login");
    }, 1500);
  } else {
    alertEl.className = "alert-box alert-danger";
    alertEl.textContent = res.data.message || "Failed to update password.";
    alertEl.style.display = "block";
  }
}

// ==========================================
// USER DASHBOARD LOGIC
// ==========================================
async function loadUserDashboard() {
  if (!authToken) return;

  // 1. Fetch fresh profile
  const profileRes = await apiRequest("/api/users/me", "GET", null, true);
  if (profileRes.ok && profileRes.data.user) {
    currentUser = profileRes.data.user;
    localStorage.setItem("streamflix_user", JSON.stringify(currentUser));
  }

  // Populate Dashboard Banner & Card
  document.getElementById("ud-welcome-avatar").textContent = currentUser.profileImage || "😎";
  document.getElementById("ud-welcome-heading").textContent = `Welcome back, ${currentUser.fullName}!`;
  document.getElementById("ud-card-avatar").textContent = currentUser.profileImage || "😎";
  document.getElementById("ud-card-name").textContent = currentUser.fullName;
  document.getElementById("ud-card-email").textContent = currentUser.email;
  document.getElementById("ud-card-username").textContent = currentUser.username;
  document.getElementById("ud-card-phone").textContent = currentUser.phone || "Not specified";
  document.getElementById("ud-card-role").textContent = currentUser.role;
  document.getElementById("ud-card-status").textContent = currentUser.status;

  const joinDate = currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "Recent";
  document.getElementById("ud-card-joined").textContent = joinDate;

  // 2. Fetch & Render Watchlist
  await loadUserWatchlist();

  // 3. Fetch & Render History
  await loadUserHistory();
}

function switchUserDashboardTab(tabName) {
  currentDTab = tabName;
  document.querySelectorAll(".dashboard-tabs .d-tab").forEach(tab => {
    tab.classList.toggle("active", tab.dataset.dtab === tabName);
  });

  document.querySelectorAll(".dashboard-tab-content .d-panel").forEach(panel => {
    panel.style.display = panel.id === `dtab-panel-${tabName}` ? "block" : "none";
  });
}

async function loadUserWatchlist() {
  const grid = document.getElementById("ud-watchlist-grid");
  const countSpan = document.getElementById("ud-watchlist-count");

  const res = await apiRequest("/api/users/me/watchlist", "GET", null, true);
  const list = (res.ok && res.data.watchlist) ? res.data.watchlist : (currentUser.watchlist || []);
  countSpan.textContent = list.length;
  document.getElementById("my-list-count").textContent = list.length;

  if (list.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; color: #888; padding: 30px 0;">Your watchlist is currently empty. Explore movies and series on the home screen to add titles!</div>`;
    return;
  }

  grid.innerHTML = list.map(item => `
    <div class="media-card" onclick="openMediaDetailById('${item.mediaId}')">
      <img class="media-poster" src="${item.posterUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500'}" alt="${item.title}" />
      <div class="media-card-overlay">
        <div class="card-title">${item.title}</div>
        <div class="card-meta">
          <span>${item.type || 'TITLE'}</span>
          <button class="btn btn-sm btn-secondary" onclick="event.stopPropagation(); removeFromWatchlist('${item.mediaId}')">Remove</button>
        </div>
      </div>
    </div>
  `).join("");
}

async function loadUserHistory() {
  const historyList = document.getElementById("ud-history-list");
  const res = await apiRequest("/api/users/me/history", "GET", null, true);
  const history = (res.ok && res.data.history) ? res.data.history : (currentUser.watchHistory || []);

  if (history.length === 0) {
    historyList.innerHTML = `<div style="color: #888; padding: 20px 0;">No watch history yet. Start watching trailers or episodes to track your progress!</div>`;
    return;
  }

  historyList.innerHTML = history.map(h => `
    <div class="history-item">
      <div>
        <div class="history-title">${h.title}</div>
        <small style="color: #888;">Watched on ${new Date(h.watchedAt).toLocaleDateString()}</small>
      </div>
      <div style="display: flex; align-items: center; gap: 14px;">
        <div class="history-progress-bar"><div class="history-progress-fill" style="width: ${h.progress}%;"></div></div>
        <button class="btn btn-sm btn-primary" onclick="openVideoPlayer('${h.title}')">Resume</button>
      </div>
    </div>
  `).join("");
}

function handleNavWatchlistClick() {
  if (authToken && currentUser) {
    navigateTo("dashboard");
    switchUserDashboardTab("watchlist");
  } else {
    filterBySection("mylist");
  }
}

async function removeFromWatchlist(mediaId) {
  await apiRequest("/api/users/me/watchlist", "POST", { mediaId }, true);
  await loadUserWatchlist();
  updateNavbarAuthState();
}

// Edit Profile Modal
function openEditProfileModal() {
  document.getElementById("edit-fullname").value = currentUser.fullName || "";
  document.getElementById("edit-phone").value = currentUser.phone || "";
  selectedEditAvatar = currentUser.profileImage || "😎";

  document.querySelectorAll("#edit-avatar-picker .avatar-opt").forEach(opt => {
    opt.classList.toggle("active", opt.textContent.trim() === selectedEditAvatar);
  });

  document.getElementById("edit-profile-alert").style.display = "none";
  document.getElementById("edit-profile-modal").style.display = "flex";
}

function closeEditProfileModal() {
  document.getElementById("edit-profile-modal").style.display = "none";
}

function closeEditProfileModalOnBackdrop(e) {
  if (e.target.id === "edit-profile-modal") closeEditProfileModal();
}

async function handleProfileEditSubmit(e) {
  e.preventDefault();
  const fullName = document.getElementById("edit-fullname").value.trim();
  const phone = document.getElementById("edit-phone").value.trim();
  const alertEl = document.getElementById("edit-profile-alert");

  const res = await apiRequest("/api/users/me", "PATCH", {
    fullName,
    phone,
    profileImage: selectedEditAvatar
  }, true);

  if (res.ok) {
    currentUser = res.data.user;
    localStorage.setItem("streamflix_user", JSON.stringify(currentUser));
    updateNavbarAuthState();
    closeEditProfileModal();
    loadUserDashboard();
  } else {
    alertEl.className = "alert-box alert-danger";
    alertEl.textContent = res.data.message || "Failed to update profile.";
    alertEl.style.display = "block";
  }
}

// User Password Change
async function handleUserPasswordChange(e) {
  e.preventDefault();
  const currentPassword = document.getElementById("user-curr-pwd").value;
  const newPassword = document.getElementById("user-new-pwd").value;
  const confirmPassword = document.getElementById("user-confirm-pwd").value;
  const alertEl = document.getElementById("user-pwd-alert");

  if (newPassword !== confirmPassword) {
    alertEl.className = "alert-box alert-danger";
    alertEl.textContent = "New passwords do not match.";
    alertEl.style.display = "block";
    return;
  }

  const res = await apiRequest("/api/users/me/password", "PATCH", { currentPassword, newPassword }, true);
  if (res.ok) {
    alertEl.className = "alert-box alert-success";
    alertEl.textContent = res.data.message || "Password updated successfully.";
    alertEl.style.display = "block";
    document.getElementById("user-password-form").reset();
  } else {
    alertEl.className = "alert-box alert-danger";
    alertEl.textContent = res.data.message || "Failed to update password.";
    alertEl.style.display = "block";
  }
}
// ==========================================
// ADMIN DASHBOARD LOGIC
// ==========================================
async function loadAdminDashboard() {
  if (!authToken || !currentUser || currentUser.role !== "ADMIN") return;

  document.getElementById("admin-user-display").textContent = currentUser.fullName || currentUser.username;
  document.getElementById("admin-profile-name").textContent = currentUser.fullName;
  document.getElementById("admin-profile-email").textContent = currentUser.email;

  // Load Overview Stats
  await loadAdminStats();

  // Load Users
  await loadAdminUsers();

  // Load Movies
  await loadAdminMovies();
}

function switchAdminTab(tabName) {
  currentATab = tabName;
  document.querySelectorAll(".admin-nav .admin-nav-item").forEach(item => {
    item.classList.toggle("active", item.dataset.atab === tabName);
  });

  document.querySelectorAll(".admin-main .admin-tab-panel").forEach(panel => {
    panel.style.display = panel.id === `admin-panel-${tabName}` ? "block" : "none";
  });

  const titles = {
    overview: "System Overview",
    users: "User Management & Access Control",
    movies: "Content Catalog Management",
    settings: "Administrator Settings"
  };
  document.getElementById("admin-section-title").textContent = titles[tabName] || "Admin Console";
}

async function loadAdminStats() {
  const res = await apiRequest("/api/admin/dashboard", "GET", null, true);
  if (res.ok && res.data.stats) {
    const s = res.data.stats;
    document.getElementById("stat-total-users").textContent = s.totalUsers;
    document.getElementById("stat-total-admins").textContent = s.totalAdmins;
    document.getElementById("stat-active-users").textContent = s.totalActiveUsers;
    document.getElementById("stat-total-movies").textContent = s.totalMovies;
  }
}

async function loadAdminUsers() {
  const tbody = document.getElementById("admin-users-tbody");
  const recentTbody = document.getElementById("admin-recent-users-tbody");
  const paginationInfo = document.getElementById("admin-pagination-info");

  let query = `/api/admin/users?page=${adminCurrentPage}&limit=8`;
  if (adminSearchQuery) query += `&search=${encodeURIComponent(adminSearchQuery)}`;
  if (adminRoleFilter !== "ALL") query += `&role=${adminRoleFilter}`;
  if (adminStatusFilter !== "ALL") query += `&status=${adminStatusFilter}`;

  const res = await apiRequest(query, "GET", null, true);
  if (!res.ok || !res.data.users) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #888;">Error loading users.</td></tr>`;
    return;
  }

  const { users, pagination } = res.data;

  // Overview recent users (top 5)
  if (recentTbody) {
    recentTbody.innerHTML = users.slice(0, 5).map(u => `
      <tr>
        <td><strong>${u.fullName}</strong></td>
        <td>${u.email}</td>
        <td>@${u.username}</td>
        <td><span class="user-role-badge">${u.role}</span></td>
        <td><span class="user-status-badge ${u.status === 'ACTIVE' ? 'status-active' : 'status-disabled'}">${u.status}</span></td>
        <td>${new Date(u.createdAt).toLocaleDateString()}</td>
      </tr>
    `).join("");
  }

  if (users.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #888; padding: 24px;">No users found matching your filters.</td></tr>`;
    return;
  }

  tbody.innerHTML = users.map(u => {
    const isSelf = u._id === currentUser._id || u.id === currentUser.id;
    return `
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 20px;">${u.profileImage || '😎'}</span>
            <div>
              <strong>${u.fullName}</strong>
              <div style="font-size: 11px; color: #888;">ID: ${u._id || u.id}</div>
              <div style="font-size: 12px; color: #aaa;">${u.email}</div>
            </div>
          </div>
        </td>
        <td>@${u.username}</td>
        <td><span class="user-role-badge">${u.role}</span></td>
        <td><span class="user-status-badge ${u.status === 'ACTIVE' ? 'status-active' : 'status-disabled'}">${u.status}</span></td>
        <td>${new Date(u.createdAt).toLocaleDateString()}</td>
        <td>
          <div class="table-actions">
            <button class="btn btn-sm btn-secondary" onclick="viewUserDetails('${u._id || u.id}')" title="View Audit Details">View</button>
            <button class="btn btn-sm ${u.status === 'ACTIVE' ? 'btn-secondary' : 'btn-primary'}" onclick="toggleUserStatus('${u._id || u.id}', '${u.status}')">
              ${u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
            </button>
            <button class="btn btn-sm btn-secondary" onclick="toggleUserRole('${u._id || u.id}', '${u.role}')" title="Change Role">
              ${u.role === 'ADMIN' ? 'Make User' : 'Make Admin'}
            </button>
            <button class="btn btn-sm btn-secondary" style="color: #ff5252;" onclick="confirmDeleteUser('${u._id || u.id}', '${u.username}')" title="Delete User">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");

  // Pagination controls
  if (pagination) {
    paginationInfo.textContent = `Showing page ${pagination.page} of ${pagination.totalPages} (${pagination.total} total users)`;
    document.getElementById("btn-prev-page").disabled = pagination.page <= 1;
    document.getElementById("btn-next-page").disabled = pagination.page >= pagination.totalPages;
  }
}

function handleAdminUserSearch(val) {
  adminSearchQuery = val;
  adminCurrentPage = 1;
  loadAdminUsers();
}

function handleAdminUserFilter() {
  adminRoleFilter = document.getElementById("admin-role-filter").value;
  adminStatusFilter = document.getElementById("admin-status-filter").value;
  adminCurrentPage = 1;
  loadAdminUsers();
}

function changeAdminPage(delta) {
  adminCurrentPage += delta;
  if (adminCurrentPage < 1) adminCurrentPage = 1;
  loadAdminUsers();
}

// User Actions
async function viewUserDetails(id) {
  const res = await apiRequest(`/api/admin/users/${id}`, "GET", null, true);
  if (!res.ok || !res.data.user) return;
  const u = res.data.user;

  const content = document.getElementById("admin-user-details-content");
  content.innerHTML = `
    <div style="display: flex; align-items: center; gap: 16px; margin: 16px 0;">
      <span style="font-size: 42px;">${u.profileImage || '😎'}</span>
      <div>
        <h3 style="margin: 0;">${u.fullName}</h3>
        <p style="color: #888; margin: 4px 0;">@${u.username} • ${u.email}</p>
        <span class="user-role-badge">${u.role}</span>
        <span class="user-status-badge ${u.status === 'ACTIVE' ? 'status-active' : 'status-disabled'}">${u.status}</span>
      </div>
    </div>
    <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 16px 0;" />
    <div class="profile-details-grid">
      <div class="detail-item"><label>User ID</label><span>${u._id || u.id}</span></div>
      <div class="detail-item"><label>Phone</label><span>${u.phone || 'None'}</span></div>
      <div class="detail-item"><label>Watchlist Count</label><span>${u.watchlist ? u.watchlist.length : 0} items</span></div>
      <div class="detail-item"><label>Watch History Count</label><span>${u.watchHistory ? u.watchHistory.length : 0} items</span></div>
      <div class="detail-item"><label>Joined At</label><span>${new Date(u.createdAt).toLocaleString()}</span></div>
      <div class="detail-item"><label>Last Updated</label><span>${new Date(u.updatedAt).toLocaleString()}</span></div>
    </div>
  `;
  document.getElementById("admin-user-modal").style.display = "flex";
}

function closeAdminUserModal() {
  document.getElementById("admin-user-modal").style.display = "none";
}

function closeAdminUserModalOnBackdrop(e) {
  if (e.target.id === "admin-user-modal") closeAdminUserModal();
}

async function toggleUserStatus(id, currentStatus) {
  const newStatus = currentStatus === "ACTIVE" ? "DISABLED" : "ACTIVE";
  const confirmMsg = newStatus === "DISABLED" ? "Are you sure you want to deactivate this account? The user will be blocked from logging in." : "Activate this user account?";
  if (!confirm(confirmMsg)) return;

  const res = await apiRequest(`/api/admin/users/${id}/status`, "PATCH", { status: newStatus }, true);
  const alertEl = document.getElementById("admin-user-alert");
  if (res.ok) {
    alertEl.className = "alert-box alert-success";
    alertEl.textContent = res.data.message || "User status updated.";
    alertEl.style.display = "block";
    loadAdminUsers();
    loadAdminStats();
  } else {
    alertEl.className = "alert-box alert-danger";
    alertEl.textContent = res.data.message || "Failed to update status.";
    alertEl.style.display = "block";
  }
}

async function toggleUserRole(id, currentRole) {
  const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
  const confirmMsg = `Change role from ${currentRole} to ${newRole}?`;
  if (!confirm(confirmMsg)) return;

  const res = await apiRequest(`/api/admin/users/${id}/role`, "PATCH", { role: newRole }, true);
  const alertEl = document.getElementById("admin-user-alert");
  if (res.ok) {
    alertEl.className = "alert-box alert-success";
    alertEl.textContent = res.data.message || "User role updated.";
    alertEl.style.display = "block";
    loadAdminUsers();
    loadAdminStats();
  } else {
    alertEl.className = "alert-box alert-danger";
    alertEl.textContent = res.data.message || "Failed to update role.";
    alertEl.style.display = "block";
  }
}

async function confirmDeleteUser(id, username) {
  if (!confirm(`CAUTION: Are you sure you want to permanently delete user @${username}? This action cannot be undone.`)) return;

  const res = await apiRequest(`/api/admin/users/${id}`, "DELETE", null, true);
  const alertEl = document.getElementById("admin-user-alert");
  if (res.ok) {
    alertEl.className = "alert-box alert-success";
    alertEl.textContent = res.data.message || "User deleted.";
    alertEl.style.display = "block";
    loadAdminUsers();
    loadAdminStats();
  } else {
    alertEl.className = "alert-box alert-danger";
    alertEl.textContent = res.data.message || "Failed to delete user.";
    alertEl.style.display = "block";
  }
}

// Content Catalog Management (Movies & Series)
async function loadAdminMovies() {
  const tbody = document.getElementById("admin-movies-tbody");
  const res = await apiRequest("/api/admin/movies", "GET", null, true);
  if (!res.ok || !res.data.movies) return;

  const movies = res.data.movies;
  tbody.innerHTML = movies.map(m => `
    <tr>
      <td><img src="${m.posterUrl}" alt="${m.title}" style="width: 44px; height: 60px; object-fit: cover; border-radius: 4px;" /></td>
      <td><strong>${m.title}</strong></td>
      <td><span class="user-role-badge">${m.type}</span></td>
      <td><span class="rating-tag">${m.rating}</span></td>
      <td>${m.year}</td>
      <td><small style="color: #aaa;">${m.genres ? m.genres.join(", ") : ""}</small></td>
      <td>
        <button class="btn btn-sm btn-secondary" style="color: #ff5252;" onclick="confirmDeleteMovie('${m._id || m.id}', '${m.title}')">Delete</button>
      </td>
    </tr>
  `).join("");
}

function openAddMovieModal() {
  document.getElementById("add-movie-alert").style.display = "none";
  document.getElementById("add-movie-form").reset();
  document.getElementById("add-movie-modal").style.display = "flex";
}

function closeAddMovieModal() {
  document.getElementById("add-movie-modal").style.display = "none";
}

function closeAddMovieModalOnBackdrop(e) {
  if (e.target.id === "add-movie-modal") closeAddMovieModal();
}

async function handleAddMovieSubmit(e) {
  e.preventDefault();
  const alertEl = document.getElementById("add-movie-alert");
  const movieData = {
    title: document.getElementById("movie-title").value.trim(),
    type: document.getElementById("movie-type").value,
    year: parseInt(document.getElementById("movie-year").value) || 2026,
    rating: document.getElementById("movie-rating").value.trim(),
    durationOrSeasons: document.getElementById("movie-duration").value.trim(),
    posterUrl: document.getElementById("movie-poster").value.trim(),
    backdropUrl: document.getElementById("movie-backdrop").value.trim() || document.getElementById("movie-poster").value.trim(),
    genres: document.getElementById("movie-genres").value.split(",").map(s => s.trim()),
    description: document.getElementById("movie-description").value.trim()
  };

  const res = await apiRequest("/api/admin/movies", "POST", movieData, true);
  if (res.ok) {
    alertEl.className = "alert-box alert-success";
    alertEl.textContent = "Title added to catalog successfully!";
    alertEl.style.display = "block";
    setTimeout(() => {
      closeAddMovieModal();
      loadAdminMovies();
      loadAdminStats();
      fetchLiveCatalog(); // Refresh home catalog too!
    }, 1200);
  } else {
    alertEl.className = "alert-box alert-danger";
    alertEl.textContent = res.data.message || "Failed to add title.";
    alertEl.style.display = "block";
  }
}

async function confirmDeleteMovie(id, title) {
  if (!confirm(`Delete "${title}" from the public streaming catalog?`)) return;
  const res = await apiRequest(`/api/admin/movies/${id}`, "DELETE", null, true);
  if (res.ok) {
    loadAdminMovies();
    loadAdminStats();
    fetchLiveCatalog();
  }
}

// Admin Settings
async function handleAdminPasswordChange(e) {
  e.preventDefault();
  const currentPassword = document.getElementById("admin-curr-pwd").value;
  const newPassword = document.getElementById("admin-new-pwd").value;
  const confirmPassword = document.getElementById("admin-confirm-pwd").value;
  const alertEl = document.getElementById("admin-pwd-alert");

  if (newPassword !== confirmPassword) {
    alertEl.className = "alert-box alert-danger";
    alertEl.textContent = "New passwords do not match.";
    alertEl.style.display = "block";
    return;
  }

  const res = await apiRequest("/api/admin/settings/password", "PATCH", { currentPassword, newPassword }, true);
  if (res.ok) {
    alertEl.className = "alert-box alert-success";
    alertEl.textContent = res.data.message || "Admin master password updated.";
    alertEl.style.display = "block";
    document.getElementById("admin-password-form").reset();
  } else {
    alertEl.className = "alert-box alert-danger";
    alertEl.textContent = res.data.message || "Failed to update admin password.";
    alertEl.style.display = "block";
  }
}
// ==========================================
// STREAMING CATALOG, BILLBOARD & CAROUSELS
// ==========================================

let catalog = [
  {
    id: "stranger-things",
    title: "Stranger Things",
    type: "TV_SHOW",
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80",
    description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
    matchScore: 98,
    rating: "TV-MA",
    year: 2024,
    durationOrSeasons: "4 Seasons",
    genres: ["Sci-Fi", "Suspenseful", "Mind-Bending", "Horror"],
    cast: ["Winona Ryder", "David Harbour", "Millie Bobby Brown", "Finn Wolfhard"],
    director: "The Duffer Brothers",
    badge: "TOP 10 IN TV SHOWS TODAY",
    isOriginal: true,
    isBillboard: true,
    episodes: [
      {
        id: "st-s4-e1",
        number: 1,
        title: "Chapter One: The Hellfire Club",
        duration: "1h 16m",
        description: "El struggles to fit in at school in California, while Mike and Dustin join a new D&D club. A strange new horror begins to terrorize Hawkins.",
        thumbnailUrl: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&auto=format&fit=crop&q=80"
      },
      {
        id: "st-s4-e2",
        number: 2,
        title: "Chapter Two: Vecna's Curse",
        duration: "1h 17m",
        description: "A plane brings Mike to California and a dead body brings Hawkins to a halt. Nancy starts digging for answers.",
        thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80"
      }
    ]
  },
  {
    id: "squid-game",
    title: "Squid Game",
    type: "TV_SHOW",
    posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1200&auto=format&fit=crop&q=80",
    description: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits with deadly high stakes.",
    matchScore: 99,
    rating: "TV-MA",
    year: 2024,
    durationOrSeasons: "2 Seasons",
    genres: ["Thriller", "Suspense", "Dystopian", "Dark"],
    cast: ["Lee Jung-jae", "Park Hae-soo", "Wi Ha-jun"],
    director: "Hwang Dong-hyuk",
    badge: "#1 IN MOVIES & SHOWS",
    isOriginal: true,
    episodes: [
      {
        id: "sg-e1",
        number: 1,
        title: "Bread and Lottery",
        duration: "58m",
        description: "Determined to dismantle the deadly games, Gi-hun sets off on a perilous undercover pursuit with surprising new allies.",
        thumbnailUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80"
      }
    ]
  },
  {
    id: "cyberpunk-edgerunners",
    title: "Cyberpunk: Edgerunners",
    type: "TV_SHOW",
    posterUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80",
    description: "In a dystopia riddled with corruption and cybernetic implants, a talented but reckless street kid strives to become an outlaw mercenary.",
    matchScore: 97,
    rating: "TV-MA",
    year: 2023,
    durationOrSeasons: "1 Season",
    genres: ["Anime", "Action", "Cyberpunk", "Sci-Fi"],
    cast: ["KENN", "Aoi Yuuki", "Hiroki Touchi"],
    director: "Hiroyuki Imaishi",
    badge: "CRITICS CHOICE",
    isOriginal: true
  },
  {
    id: "wednesday",
    title: "Wednesday",
    type: "TV_SHOW",
    posterUrl: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1514539079130-25950c84af65?w=1200&auto=format&fit=crop&q=80",
    description: "Smart, sarcastic and a little dead inside, Wednesday Addams investigates a murder spree while making new friends and foes at Nevermore Academy.",
    matchScore: 96,
    rating: "TV-14",
    year: 2024,
    durationOrSeasons: "2 Seasons",
    genres: ["Fantasy", "Dark Comedy", "Mystery", "Teen"],
    cast: ["Jenna Ortega", "Gwendoline Christie", "Riki Lindhome"],
    director: "Tim Burton",
    badge: "NEW SEASON COMING",
    isOriginal: true
  },
  {
    id: "glass-onion",
    title: "Glass Onion: A Knives Out Mystery",
    type: "MOVIE",
    posterUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&auto=format&fit=crop&q=80",
    description: "World-famous detective Benoit Blanc heads to Greece to peel back the layers of a mystery surrounding a tech billionaire and his eclectic crew of friends.",
    matchScore: 94,
    rating: "PG-13",
    year: 2023,
    durationOrSeasons: "2h 19m",
    genres: ["Mystery", "Comedy", "Whodunit", "Witty"],
    cast: ["Daniel Craig", "Edward Norton", "Janelle Monáe"],
    director: "Rian Johnson",
    badge: "AWARD WINNER",
    isOriginal: true
  },
  {
    id: "arcane",
    title: "Arcane: League of Legends",
    type: "TV_SHOW",
    posterUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80",
    description: "Amid the discord of twin cities Piltover and Zaun, two sisters fight on rival sides of a war between magic technologies and incompatible convictions.",
    matchScore: 99,
    rating: "TV-14",
    year: 2024,
    durationOrSeasons: "2 Seasons",
    genres: ["Animation", "Sci-Fi", "Action", "Steampunk"],
    cast: ["Hailee Steinfeld", "Ella Purnell", "Kevin Alejandro"],
    director: "Pascal Charrue",
    badge: "MASTERPIECE",
    isOriginal: true
  },
  {
    id: "extraction-2",
    title: "Extraction II",
    type: "MOVIE",
    posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
    description: "Back from the brink of death, highly skilled commando Tyler Rake takes on another high-stakes mission: rescuing the battered family of a ruthless gangster.",
    matchScore: 92,
    rating: "R",
    year: 2023,
    durationOrSeasons: "2h 3m",
    genres: ["Action", "Thriller", "Adrenaline"],
    cast: ["Chris Hemsworth", "Golshifteh Farahani", "Idris Elba"],
    director: "Sam Hargrave",
    badge: "NON-STOP ACTION",
    isOriginal: true
  },
  {
    id: "dark",
    title: "Dark",
    type: "TV_SHOW",
    posterUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
    description: "A missing child sets four families on a frantic hunt for answers as they unearth a mind-bending mystery that spans three generations.",
    matchScore: 99,
    rating: "TV-MA",
    year: 2021,
    durationOrSeasons: "3 Seasons",
    genres: ["Sci-Fi", "Time Travel", "Mystery"],
    cast: ["Louis Hofmann", "Oliver Masucci", "Jördis Triebel"],
    director: "Baran bo Odar",
    badge: "CRITICALLY ACCLAIMED",
    isOriginal: true
  }
];

async function fetchLiveCatalog() {
  const res = await apiRequest("/api/movies", "GET");
  if (res.ok && res.data.movies && res.data.movies.length > 0) {
    catalog = res.data.movies;
  }
  renderBillboard(catalog[0]);
  renderContentRows();
}

function renderBillboard(item) {
  if (!item) return;
  currentActiveMedia = item;
  document.getElementById("billboard-backdrop").style.backgroundImage = `url('${item.backdropUrl || item.posterUrl}')`;
  document.getElementById("billboard-title").textContent = item.title;
  document.getElementById("billboard-desc").textContent = item.description || "";
  document.getElementById("billboard-badge").textContent = item.badge || "STREAMFLIX ORIGINAL";
  document.getElementById("billboard-match").textContent = `${item.matchScore || 98}% Match`;
  document.getElementById("billboard-rating").textContent = item.rating || "TV-MA";
  document.getElementById("billboard-duration").textContent = item.durationOrSeasons || "1 Season";
  document.getElementById("billboard-genres").textContent = (item.genres || []).slice(0, 3).join(" • ");

  updateBillboardMyListButton();
}

function updateBillboardMyListButton() {
  const btn = document.getElementById("billboard-mylist-btn");
  if (!btn || !currentActiveMedia) return;
  const isSaved = isMediaSaved(currentActiveMedia._id || currentActiveMedia.id);
  if (isSaved) {
    btn.classList.add("active");
    btn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;
  } else {
    btn.classList.remove("active");
    btn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
  }
}

function isMediaSaved(id) {
  if (currentUser && currentUser.watchlist) {
    return currentUser.watchlist.some(w => w.mediaId === id || w._id === id);
  }
  const localList = JSON.parse(localStorage.getItem("streamflix_mylist") || "[]");
  return localList.includes(id);
}

async function toggleBillboardMyList() {
  if (!currentActiveMedia) return;
  await toggleMediaInWatchlist(currentActiveMedia);
  updateBillboardMyListButton();
}

async function toggleMediaInWatchlist(media) {
  const mediaId = media._id || media.id;

  if (authToken && currentUser) {
    // Cloud sync with backend database
    const res = await apiRequest("/api/users/me/watchlist", "POST", {
      mediaId,
      title: media.title,
      posterUrl: media.posterUrl,
      type: media.type
    }, true);

    if (res.ok && res.data.watchlist) {
      currentUser.watchlist = res.data.watchlist;
      localStorage.setItem("streamflix_user", JSON.stringify(currentUser));
      updateNavbarAuthState();
    }
  } else {
    // Local fallback for guest visitors
    let list = JSON.parse(localStorage.getItem("streamflix_mylist") || "[]");
    const idx = list.indexOf(mediaId);
    if (idx > -1) list.splice(idx, 1);
    else list.push(mediaId);
    localStorage.setItem("streamflix_mylist", JSON.stringify(list));
    document.getElementById("my-list-count").textContent = list.length;
  }
}

function playBillboard() {
  if (currentActiveMedia) openVideoPlayer(currentActiveMedia.title, currentActiveMedia._id || currentActiveMedia.id);
}

function openBillboardDetail() {
  if (currentActiveMedia) openMediaDetail(currentActiveMedia);
}

function renderContentRows() {
  const container = document.getElementById("main-content");
  container.innerHTML = "";

  const sections = [
    { title: "Trending Now", items: catalog },
    { title: "Top 10 in Your Country Today", items: catalog.slice(0, 8), isTop10: true },
    { title: "Popular TV Shows", items: catalog.filter(m => m.type === "TV_SHOW") },
    { title: "Blockbuster Movies", items: catalog.filter(m => m.type === "MOVIE") },
    { title: "Sci-Fi & Cyberpunk", items: catalog.filter(m => (m.genres || []).some(g => g.includes("Sci-Fi") || g.includes("Cyberpunk"))) },
    { title: "Action & Thrillers", items: catalog.filter(m => (m.genres || []).some(g => g.includes("Action") || g.includes("Thriller"))) }
  ];

  sections.forEach((sec, idx) => {
    if (sec.items.length === 0) return;
    const secEl = document.createElement("section");
    secEl.className = "media-section";
    secEl.innerHTML = `
      <h2 class="section-heading">${sec.title}</h2>
      <div class="carousel-wrapper">
        <button class="carousel-nav-btn carousel-prev" onclick="scrollCarousel('track-${idx}', -400)">‹</button>
        <div class="carousel-track" id="track-${idx}">
          ${sec.isTop10 ? renderTop10Cards(sec.items) : renderCards(sec.items)}
        </div>
        <button class="carousel-nav-btn carousel-next" onclick="scrollCarousel('track-${idx}', 400)">›</button>
      </div>
    `;
    container.appendChild(secEl);
  });
}

function renderCards(items) {
  return items.map(item => `
    <div class="media-card" onclick="openMediaDetailById('${item._id || item.id}')">
      <img class="media-poster" src="${item.posterUrl}" alt="${item.title}" loading="lazy" />
      ${item.badge ? `<span class="media-card-badge">${item.badge}</span>` : ""}
      <div class="media-card-overlay">
        <div class="card-title">${item.title}</div>
        <div class="card-meta">
          <span class="match-score">${item.matchScore || 95}%</span>
          <span>${item.durationOrSeasons || ''}</span>
          <span class="rating-tag">${item.rating || 'TV-MA'}</span>
        </div>
      </div>
    </div>
  `).join("");
}

function renderTop10Cards(items) {
  return items.map((item, i) => `
    <div class="top-10-card" onclick="openMediaDetailById('${item._id || item.id}')">
      <div class="rank-number">${i + 1}</div>
      <img class="top-10-poster" src="${item.posterUrl}" alt="${item.title}" loading="lazy" />
    </div>
  `).join("");
}

function scrollCarousel(id, offset) {
  const track = document.getElementById(id);
  if (track) track.scrollBy({ left: offset, behavior: "smooth" });
}

// Media Detail Modal
let activeModalMedia = null;

function openMediaDetailById(id) {
  const item = catalog.find(m => m.id === id || m._id === id);
  if (item) openMediaDetail(item);
}

function openMediaDetail(item) {
  activeModalMedia = item;
  document.getElementById("modal-backdrop").src = item.backdropUrl || item.posterUrl;
  document.getElementById("modal-title").textContent = item.title;
  document.getElementById("modal-desc").textContent = item.description || "";
  document.getElementById("modal-match").textContent = `${item.matchScore || 96}% Match`;
  document.getElementById("modal-year").textContent = item.year || 2024;
  document.getElementById("modal-rating").textContent = item.rating || "TV-MA";
  document.getElementById("modal-duration").textContent = item.durationOrSeasons || "1 Season";
  document.getElementById("modal-cast").textContent = (item.cast || []).join(", ");
  document.getElementById("modal-genres").textContent = (item.genres || []).join(", ");
  document.getElementById("modal-director").textContent = item.director || "Various";

  updateModalMyListButton();

  // Episodes
  const epSection = document.getElementById("modal-episodes-section");
  const epList = document.getElementById("modal-episodes-list");
  if (item.episodes && item.episodes.length > 0) {
    epSection.style.display = "block";
    epList.innerHTML = item.episodes.map(ep => `
      <div class="episode-item" onclick="openVideoPlayer('${item.title}: ${ep.title}', '${item._id || item.id}')">
        <div class="ep-num">${ep.number}</div>
        <img class="ep-thumb" src="${ep.thumbnailUrl || item.posterUrl}" alt="${ep.title}" />
        <div class="ep-info">
          <h4>${ep.title} (${ep.duration})</h4>
          <p>${ep.description}</p>
        </div>
      </div>
    `).join("");
  } else {
    epSection.style.display = "none";
  }

  document.getElementById("detail-modal").style.display = "flex";
}

function updateModalMyListButton() {
  const btn = document.getElementById("modal-mylist-btn");
  if (!activeModalMedia || !btn) return;
  const isSaved = isMediaSaved(activeModalMedia._id || activeModalMedia.id);
  if (isSaved) {
    btn.classList.add("active");
    btn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;
  } else {
    btn.classList.remove("active");
    btn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
  }
}

async function toggleModalMyList() {
  if (!activeModalMedia) return;
  await toggleMediaInWatchlist(activeModalMedia);
  updateModalMyListButton();
}

function closeModal() {
  document.getElementById("detail-modal").style.display = "none";
}

function closeModalOnBackdrop(e) {
  if (e.target.id === "detail-modal") closeModal();
}

function playCurrentModalMedia() {
  closeModal();
  if (activeModalMedia) {
    openVideoPlayer(activeModalMedia.title, activeModalMedia._id || activeModalMedia.id);
  }
}

// Video Player Modal & History Tracking
async function openVideoPlayer(title, mediaId = null) {
  document.getElementById("video-player-title").textContent = title || "Now Playing";
  const modal = document.getElementById("video-modal");
  const video = document.getElementById("main-video");
  modal.style.display = "flex";
  video.currentTime = 0;
  video.play().catch(() => {});

  // Record to Watch History if authenticated
  if (authToken && mediaId) {
    await apiRequest("/api/users/me/history", "POST", {
      mediaId,
      title,
      progress: Math.floor(Math.random() * 40) + 40
    }, true);
  }
}

function closeVideoPlayer() {
  const modal = document.getElementById("video-modal");
  const video = document.getElementById("main-video");
  video.pause();
  modal.style.display = "none";
}

// Navigation Category & Search
function filterBySection(type) {
  document.querySelectorAll("#main-nav-links .nav-btn").forEach(b => b.classList.remove("active"));
  const activeBtn = document.querySelector(`#main-nav-links .nav-btn[data-filter="${type}"]`);
  if (activeBtn) activeBtn.classList.add("active");

  const billboard = document.getElementById("billboard");
  const mainContent = document.getElementById("main-content");
  const searchResults = document.getElementById("search-results");

  searchResults.style.display = "none";
  mainContent.style.display = "block";
  billboard.style.display = "flex";

  if (type === "all") {
    renderContentRows();
  } else if (type === "tv") {
    const tvItems = catalog.filter(m => m.type === "TV_SHOW");
    renderBillboard(tvItems[0]);
    showFilteredGrid("TV Shows", tvItems);
  } else if (type === "movies") {
    const movieItems = catalog.filter(m => m.type === "MOVIE");
    renderBillboard(movieItems[0]);
    showFilteredGrid("Movies", movieItems);
  } else if (type === "upcoming") {
    showFilteredGrid("New & Upcoming Releases", catalog.slice(0, 6));
  } else if (type === "mylist") {
    const mySavedIds = currentUser ? (currentUser.watchlist || []).map(w => w.mediaId) : JSON.parse(localStorage.getItem("streamflix_mylist") || "[]");
    const myItems = catalog.filter(m => mySavedIds.includes(m.id) || mySavedIds.includes(m._id));
    showFilteredGrid(myItems.length ? "Watchlist" : "Watchlist (Empty)", myItems);
  }
}

function showFilteredGrid(title, items) {
  const billboard = document.getElementById("billboard");
  const mainContent = document.getElementById("main-content");
  const searchResults = document.getElementById("search-results");

  billboard.style.display = "none";
  mainContent.style.display = "none";
  searchResults.style.display = "block";

  document.getElementById("search-heading").textContent = title;
  const grid = document.getElementById("search-grid");
  grid.innerHTML = items.length ? renderCards(items) : `<p style="color: #888; grid-column: 1/-1; padding: 40px 0;">No titles found.</p>`;
}

function handleSearch(query) {
  query = query.trim().toLowerCase();
  const billboard = document.getElementById("billboard");
  const mainContent = document.getElementById("main-content");
  const searchResults = document.getElementById("search-results");

  if (!query) {
    searchResults.style.display = "none";
    mainContent.style.display = "block";
    billboard.style.display = "flex";
    return;
  }

  billboard.style.display = "none";
  mainContent.style.display = "none";
  searchResults.style.display = "block";

  const matches = catalog.filter(m =>
    m.title.toLowerCase().includes(query) ||
    (m.description && m.description.toLowerCase().includes(query)) ||
    (m.genres && m.genres.some(g => g.toLowerCase().includes(query))) ||
    (m.cast && m.cast.some(c => c.toLowerCase().includes(query)))
  );

  document.getElementById("search-heading").textContent = `Search Results for "${query}" (${matches.length})`;
  document.getElementById("search-grid").innerHTML = matches.length ? renderCards(matches) : `<p style="color: #888; grid-column: 1/-1; padding: 40px 0;">No matching titles found.</p>`;
}

function handleGenreSelect(genre) {
  if (!genre) {
    filterBySection("all");
    return;
  }
  const filtered = catalog.filter(m => (m.genres || []).some(g => g.toLowerCase() === genre.toLowerCase()));
  showFilteredGrid(`${genre} Titles`, filtered);
}

// APK Modal
function showApkModal() {
  document.getElementById("apk-modal").style.display = "flex";
}
function closeApkModal() {
  document.getElementById("apk-modal").style.display = "none";
}
function closeApkModalOnBackdrop(e) {
  if (e.target.id === "apk-modal") closeApkModal();
}

// Navbar scroll listener
window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  if (navbar) {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  }
});

// App Initialization
document.addEventListener("DOMContentLoaded", async () => {
  updateNavbarAuthState();

  // If token exists, verify with backend
  if (authToken) {
    const res = await apiRequest("/api/auth/me", "GET", null, true);
    if (res.ok && res.data.user) {
      currentUser = res.data.user;
      localStorage.setItem("streamflix_user", JSON.stringify(currentUser));
      updateNavbarAuthState();
    } else {
      // Token invalid or user deactivated
      authToken = null;
      currentUser = null;
      localStorage.removeItem("streamflix_token");
      localStorage.removeItem("streamflix_user");
      updateNavbarAuthState();
    }
  }

  // Load Catalog from API
  await fetchLiveCatalog();

  // Handle Initial Route
  handleHashChange();
});
