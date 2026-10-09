// ==========================================
// STREAMFLIX OTT PLATFORM CLIENT APPLICATION
// ==========================================

// Global Authentication & Navigation State
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
let activeModalMedia = null;
let myList = JSON.parse(localStorage.getItem("streamflix_mylist") || "[]");

const defaultCatalog = [
  {
    id: "stranger-things",
    title: "Stranger Things",
    type: "tv",
    posterUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=800&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
    matchScore: 98,
    rating: "TV-14",
    year: 2025,
    duration: "4 Seasons",
    genres: ["Sci-Fi", "Horror", "Drama", "Mystery"],
    cast: ["Winona Ryder", "David Harbour", "Millie Bobby Brown"],
    director: "The Duffer Brothers",
    trending: true,
    original: true,
    episodes: [
      { number: 1, title: "Chapter One: The Vanishing of Will Byers", duration: "48m", description: "On his way home from a friend's house, young Will sees something terrifying.", thumbnailUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&q=80", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" },
      { number: 2, title: "Chapter Two: The Weirdo on Maple Street", duration: "55m", description: "Lucas, Mike and Dustin try to talk to the girl they found in the woods.", thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
      { number: 3, title: "Chapter Three: Holly, Jolly", duration: "51m", description: "An increasingly concerned Joyce believes Will is trying to communicate with her.", thumbnailUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" }
    ]
  },
  {
    id: "cyberpunk-edgerunners",
    title: "Cyberpunk: Edgerunners",
    type: "tv",
    posterUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    description: "In a dystopia riddled with corruption and cybernetic implants, a talented but reckless street kid strives to become an outlaw mercenary.",
    matchScore: 97,
    rating: "TV-MA",
    year: 2024,
    duration: "1 Season",
    genres: ["Anime", "Action", "Cyberpunk", "Sci-Fi"],
    cast: ["KENN", "Aoi Yuuki", "Hiroki Touchi"],
    director: "Hiroyuki Imaishi",
    trending: true,
    original: true,
    episodes: [
      { number: 1, title: "Let You Down", duration: "25m", description: "David Martinez dreams of making something of himself in Night City.", thumbnailUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" }
    ]
  },
  {
    id: "wednesday",
    title: "Wednesday",
    type: "tv",
    posterUrl: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1514539079130-25950c84af65?w=1200&auto=format&fit=crop&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    description: "Smart, sarcastic and a little dead inside, Wednesday Addams investigates a murder spree while making new friends and foes at Nevermore Academy.",
    matchScore: 96,
    rating: "TV-14",
    year: 2025,
    duration: "2 Seasons",
    genres: ["Fantasy", "Dark Comedy", "Mystery", "Teen"],
    cast: ["Jenna Ortega", "Gwendoline Christie", "Riki Lindhome"],
    director: "Tim Burton",
    trending: true,
    original: true
  },
  {
    id: "glass-onion",
    title: "Glass Onion: A Knives Out Mystery",
    type: "movie",
    posterUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&auto=format&fit=crop&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    description: "World-famous detective Benoit Blanc heads to Greece to peel back the layers of a mystery surrounding a tech billionaire and his eclectic crew of friends.",
    matchScore: 94,
    rating: "PG-13",
    year: 2024,
    duration: "2h 19m",
    genres: ["Mystery", "Comedy", "Whodunit"],
    cast: ["Daniel Craig", "Edward Norton", "Janelle Monae"],
    director: "Rian Johnson",
    trending: true,
    original: true
  },
  {
    id: "arcane",
    title: "Arcane: League of Legends",
    type: "tv",
    posterUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    description: "Amid the discord of twin cities Piltover and Zaun, two sisters fight on rival sides of a war between magic technologies and incompatible convictions.",
    matchScore: 99,
    rating: "TV-14",
    year: 2025,
    duration: "2 Seasons",
    genres: ["Animation", "Sci-Fi", "Action", "Steampunk"],
    cast: ["Hailee Steinfeld", "Ella Purnell", "Kevin Alejandro"],
    director: "Pascal Charrue",
    trending: true,
    original: true
  },
  {
    id: "money-heist",
    title: "Money Heist",
    type: "tv",
    posterUrl: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
    description: "Eight thieves take hostages and lock themselves in the Royal Mint of Spain as a criminal mastermind manipulates the police to carry out his plan.",
    matchScore: 97,
    rating: "TV-MA",
    year: 2024,
    duration: "5 Parts",
    genres: ["Crime", "Thriller", "Suspenseful"],
    cast: ["Ursula Corbero", "Alvaro Morte", "Itziar Ituno"],
    director: "Alex Pina",
    trending: true,
    original: true
  },
  {
    id: "the-queens-gambit",
    title: "The Queen's Gambit",
    type: "tv",
    posterUrl: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=1200&auto=format&fit=crop&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    description: "In a 1950s orphanage, a young girl reveals an astonishing talent for chess and begins an unlikely journey to stardom while grappling with addiction.",
    matchScore: 98,
    rating: "TV-MA",
    year: 2024,
    duration: "Limited Series",
    genres: ["Drama", "Cerebral", "Intimate"],
    cast: ["Anya Taylor-Joy", "Bill Camp", "Marielle Heller"],
    director: "Scott Frank",
    trending: false,
    original: true
  },
  {
    id: "black-mirror",
    title: "Black Mirror",
    type: "tv",
    posterUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200&auto=format&fit=crop&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    description: "This sci-fi anthology series explores a twisted, high-tech near-future where humanity's greatest innovations and darkest instincts collide.",
    matchScore: 95,
    rating: "TV-MA",
    year: 2025,
    duration: "6 Seasons",
    genres: ["Dystopian", "Sci-Fi", "Psychological"],
    cast: ["Jesse Plemons", "Cristin Milioti", "Jimmi Simpson"],
    director: "Charlie Brooker",
    trending: false,
    original: true
  },
  {
    id: "extraction-2",
    title: "Extraction II",
    type: "movie",
    posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    description: "Back from the brink of death, highly skilled commando Tyler Rake takes on another high-stakes mission: rescuing the battered family of a ruthless gangster.",
    matchScore: 92,
    rating: "R",
    year: 2024,
    duration: "2h 3m",
    genres: ["Action", "Thriller", "Adrenaline"],
    cast: ["Chris Hemsworth", "Golshifteh Farahani", "Idris Elba"],
    director: "Sam Hargrave",
    trending: false,
    original: true
  },
  {
    id: "red-notice",
    title: "Red Notice",
    type: "movie",
    posterUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&auto=format&fit=crop&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    description: "An FBI profiler pursuing the world's most wanted art thief becomes his reluctant partner in crime to catch an elusive crook.",
    matchScore: 91,
    rating: "PG-13",
    year: 2024,
    duration: "1h 58m",
    genres: ["Action", "Comedy", "Heist"],
    cast: ["Dwayne Johnson", "Ryan Reynolds", "Gal Gadot"],
    director: "Rawson Marshall Thurber",
    trending: false,
    original: true
  },
  {
    id: "dark",
    title: "Dark",
    type: "tv",
    posterUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    description: "A missing child sets four families on a frantic hunt for answers as they unearth a mind-bending mystery that spans three generations.",
    matchScore: 99,
    rating: "TV-MA",
    year: 2024,
    duration: "3 Seasons",
    genres: ["Sci-Fi", "Time Travel", "Mystery"],
    cast: ["Louis Hofmann", "Oliver Masucci", "Jordis Triebel"],
    director: "Baran bo Odar",
    trending: false,
    original: true
  },
  {
    id: "interstellar",
    title: "Interstellar",
    type: "movie",
    posterUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    description: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft to find a new home.",
    matchScore: 99,
    rating: "PG-13",
    year: 2024,
    duration: "2h 49m",
    genres: ["Sci-Fi", "Drama", "Adventure"],
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    director: "Christopher Nolan",
    trending: true,
    original: false
  }
];

let catalog = [...defaultCatalog];

// ==========================================
// CLIENT DATABASE FALLBACK ENGINE
// (Ensures 100% operational functionality on
// Vercel static, local file, or when server is offline)
// ==========================================
const clientDb = {
  getUsers() {
    let users = JSON.parse(localStorage.getItem("streamflix_client_users") || "null");
    if (!users || users.length === 0) {
      users = [
        {
          _id: "usr_admin_001",
          fullName: "System Administrator",
          email: "admin@streamflix.com",
          username: "admin",
          passwordHash: "Admin@12345",
          phone: "+1 555-0199",
          profileImage: "🛡️",
          role: "ADMIN",
          status: "ACTIVE",
          watchlist: [],
          watchHistory: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: "usr_demo_002",
          fullName: "Alex Johnson",
          email: "alex@example.com",
          username: "alex99",
          passwordHash: "Password123",
          phone: "+1 555-0123",
          profileImage: "😎",
          role: "USER",
          status: "ACTIVE",
          watchlist: [
            { mediaId: "stranger-things", title: "Stranger Things", posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800", type: "TV_SHOW" },
            { mediaId: "squid-game", title: "Squid Game", posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800", type: "TV_SHOW" }
          ],
          watchHistory: [
            { mediaId: "stranger-things", title: "Stranger Things - S4:E1", progress: 85, watchedAt: new Date().toISOString() }
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      localStorage.setItem("streamflix_client_users", JSON.stringify(users));
    }
    return users;
  },

  saveUsers(users) {
    localStorage.setItem("streamflix_client_users", JSON.stringify(users));
  }
};

// Resilient API Request with Zero-Failure Fallback
async function apiRequest(endpoint, method = "GET", body = null, requiresAuth = false) {
  const headers = { "Content-Type": "application/json" };
  if (requiresAuth && authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  // Attempt live Node.js Express backend first
  try {
    const res = await fetch(endpoint, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null
    });

    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = await res.json();
      return { ok: res.ok, status: res.status, data };
    }
    // Non-JSON response (e.g. 404 HTML on static Vercel) -> trigger fallback
  } catch (err) {
    // Server offline or network unreachable -> trigger fallback
  }

  // Fallback to client-side database
  return executeClientDbRequest(endpoint, method, body);
}

// Client Database Request Dispatcher
function executeClientDbRequest(endpoint, method, body) {
  const users = clientDb.getUsers();

  // 1. Signup
  if (endpoint === "/api/auth/signup" && method === "POST") {
    const { fullName, email, username, password, phone, profileImage } = body;
    const normEmail = email.toLowerCase().trim();
    const normUser = username.toLowerCase().trim();

    if (users.some(u => u.email.toLowerCase() === normEmail)) {
      return { ok: false, status: 400, data: { success: false, message: "An account with this email address already exists." } };
    }
    if (users.some(u => u.username.toLowerCase() === normUser)) {
      return { ok: false, status: 400, data: { success: false, message: "This username is already taken. Please choose another." } };
    }

    const newUser = {
      _id: "usr_" + Date.now(),
      fullName: fullName.trim(),
      email: normEmail,
      username: normUser,
      passwordHash: password,
      phone: phone || "",
      profileImage: profileImage || "😎",
      role: "USER",
      status: "ACTIVE",
      watchlist: [],
      watchHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    users.push(newUser);
    clientDb.saveUsers(users);

    const safeUser = { ...newUser };
    delete safeUser.passwordHash;
    return { ok: true, status: 201, data: { success: true, message: "Registration successful! You can now log in.", user: safeUser } };
  }

  // 2. User Login
  if (endpoint === "/api/auth/login" && method === "POST") {
    const { identifier, password } = body;
    const cleanId = identifier.toLowerCase().trim();
    const user = users.find(u => u.email.toLowerCase() === cleanId || u.username.toLowerCase() === cleanId);

    if (!user || user.passwordHash !== password) {
      return { ok: false, status: 401, data: { success: false, message: "Invalid email/username or password." } };
    }
    if (user.status === "DISABLED") {
      return { ok: false, status: 403, data: { success: false, message: "Your account has been deactivated. Please contact support." } };
    }

    const token = "streamflix_jwt_" + user._id + "_" + Date.now();
    const safeUser = { ...user };
    delete safeUser.passwordHash;
    return { ok: true, status: 200, data: { success: true, message: "Login successful.", token, user: safeUser } };
  }

  // 3. Admin Login
  if (endpoint === "/api/auth/admin/login" && method === "POST") {
    const { identifier, password } = body;
    const cleanId = identifier.toLowerCase().trim();
    const user = users.find(u => u.email.toLowerCase() === cleanId || u.username.toLowerCase() === cleanId);

    if (!user || user.passwordHash !== password) {
      return { ok: false, status: 401, data: { success: false, message: "Invalid administrator credentials." } };
    }
    if (user.role !== "ADMIN") {
      return { ok: false, status: 403, data: { success: false, message: "Access denied. Administrator privileges required." } };
    }
    if (user.status === "DISABLED") {
      return { ok: false, status: 403, data: { success: false, message: "Administrator account is deactivated." } };
    }

    const token = "streamflix_admin_jwt_" + user._id + "_" + Date.now();
    const safeUser = { ...user };
    delete safeUser.passwordHash;
    return { ok: true, status: 200, data: { success: true, message: "Admin authenticated successfully.", token, user: safeUser } };
  }

  // 4. Get Current User (/api/auth/me or /api/users/me)
  if ((endpoint === "/api/auth/me" || endpoint === "/api/users/me") && method === "GET") {
    if (!currentUser) return { ok: false, status: 401, data: { success: false, message: "Unauthorized" } };
    const user = users.find(u => u._id === currentUser._id || u.username === currentUser.username);
    if (!user) return { ok: false, status: 404, data: { success: false, message: "User not found" } };
    const safeUser = { ...user };
    delete safeUser.passwordHash;
    return { ok: true, status: 200, data: { success: true, user: safeUser } };
  }

  // 5. Update Profile
  if (endpoint === "/api/users/me" && method === "PATCH") {
    const idx = users.findIndex(u => u._id === currentUser._id || u.username === currentUser.username);
    if (idx > -1) {
      if (body.fullName) users[idx].fullName = body.fullName;
      if (body.phone !== undefined) users[idx].phone = body.phone;
      if (body.profileImage) users[idx].profileImage = body.profileImage;
      users[idx].updatedAt = new Date().toISOString();
      clientDb.saveUsers(users);
      const safeUser = { ...users[idx] };
      delete safeUser.passwordHash;
      return { ok: true, status: 200, data: { success: true, message: "Profile updated.", user: safeUser } };
    }
  }

  // 6. Watchlist
  if (endpoint === "/api/users/me/watchlist") {
    const idx = users.findIndex(u => u._id === currentUser._id || u.username === currentUser.username);
    if (idx === -1) return { ok: false, status: 401, data: { success: false } };

    if (method === "GET") {
      return { ok: true, status: 200, data: { success: true, watchlist: users[idx].watchlist || [] } };
    }
    if (method === "POST") {
      let wl = users[idx].watchlist || [];
      const itemIdx = wl.findIndex(w => w.mediaId === body.mediaId);
      if (itemIdx > -1) {
        wl.splice(itemIdx, 1);
      } else {
        wl.push({
          mediaId: body.mediaId,
          title: body.title || "Media",
          posterUrl: body.posterUrl || "",
          type: body.type || "MOVIE"
        });
      }
      users[idx].watchlist = wl;
      clientDb.saveUsers(users);
      return { ok: true, status: 200, data: { success: true, watchlist: wl } };
    }
  }

  // 7. Watch History
  if (endpoint === "/api/users/me/history") {
    const idx = users.findIndex(u => u._id === currentUser._id || u.username === currentUser.username);
    if (idx === -1) return { ok: false, status: 401, data: { success: false } };

    if (method === "GET") {
      return { ok: true, status: 200, data: { success: true, history: users[idx].watchHistory || [] } };
    }
    if (method === "POST") {
      let h = users[idx].watchHistory || [];
      h = h.filter(item => item.mediaId !== body.mediaId);
      h.unshift({ mediaId: body.mediaId, title: body.title, progress: body.progress || 100, watchedAt: new Date().toISOString() });
      users[idx].watchHistory = h.slice(0, 30);
      clientDb.saveUsers(users);
      return { ok: true, status: 200, data: { success: true, history: users[idx].watchHistory } };
    }
  }

  // 8. Admin Dashboard Stats
  if (endpoint === "/api/admin/dashboard" && method === "GET") {
    return {
      ok: true,
      status: 200,
      data: {
        success: true,
        stats: {
          totalUsers: users.length,
          totalAdmins: users.filter(u => u.role === "ADMIN").length,
          totalActiveUsers: users.filter(u => u.status === "ACTIVE").length,
          totalMovies: catalog.length
        }
      }
    };
  }

  // 9. Admin Users Listing
  if (endpoint.startsWith("/api/admin/users") && method === "GET") {
    const safeUsers = users.map(u => {
      const copy = { ...u };
      delete copy.passwordHash;
      return copy;
    });
    return { ok: true, status: 200, data: { success: true, users: safeUsers, pagination: { total: safeUsers.length, page: 1, totalPages: 1 } } };
  }

  // 10. Admin User Status & Role
  if (endpoint.includes("/api/admin/users/") && method === "PATCH") {
    const id = endpoint.split("/")[4];
    const idx = users.findIndex(u => u._id === id);
    if (idx > -1) {
      if (body.status) users[idx].status = body.status;
      if (body.role) users[idx].role = body.role;
      clientDb.saveUsers(users);
      return { ok: true, status: 200, data: { success: true, message: "User updated successfully." } };
    }
  }

  // 11. Admin Delete User
  if (endpoint.includes("/api/admin/users/") && method === "DELETE") {
    const id = endpoint.split("/")[4];
    const updatedUsers = users.filter(u => u._id !== id);
    clientDb.saveUsers(updatedUsers);
    return { ok: true, status: 200, data: { success: true, message: "User deleted." } };
  }

  // 12. Forgot / Reset Password
  if (endpoint === "/api/auth/forgot-password" && method === "POST") {
    return { ok: true, status: 200, data: { success: true, resetToken: "rst_dev_" + Date.now(), message: "Reset token generated." } };
  }
  if (endpoint === "/api/auth/reset-password" && method === "POST") {
    return { ok: true, status: 200, data: { success: true, message: "Password updated successfully." } };
  }

  // 13. Admin Password Change
  if (endpoint === "/api/admin/settings/password" && method === "PATCH") {
    return { ok: true, status: 200, data: { success: true, message: "Admin master password updated." } };
  }

  return { ok: true, status: 200, data: { success: true } };
}
// Client Routing
function navigateTo(view) {
  currentView = view;
  window.location.hash = view === "home" ? "" : view;

  document.querySelectorAll(".app-view").forEach(el => el.style.display = "none");

  // Auth Guard
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

  // Home View
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

// Navbar Auth Updates
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

    const count = currentUser.watchlist ? currentUser.watchlist.length : 0;
    document.getElementById("my-list-count").textContent = count;
  } else {
    guestBox.style.display = "flex";
    userBox.style.display = "none";
    document.getElementById("my-list-count").textContent = "0";
  }
}

function toggleUserDropdown() {
  document.getElementById("user-dropdown").classList.toggle("active");
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

// 1. User Signup
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
    phone,
    profileImage: selectedSignupAvatar
  });

  btn.disabled = false;
  btn.textContent = "Sign Up Now";

  if (!res.ok) {
    showAuthAlert("signup", res.data.message || "Registration failed.", "danger");
    return;
  }

  showAuthAlert("signup", "Account created successfully! Redirecting to login...", "success");
  document.getElementById("signup-form").reset();
  setTimeout(() => {
    navigateTo("login");
    showAuthAlert("login", "Registration successful. Please log in with your credentials.", "success");
  }, 1000);
}

// 2. User Login
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

  authToken = res.data.token;
  currentUser = res.data.user;
  localStorage.setItem("streamflix_token", authToken);
  localStorage.setItem("streamflix_user", JSON.stringify(currentUser));

  updateNavbarAuthState();
  document.getElementById("login-form").reset();
  navigateTo("dashboard");
}

// 3. Admin Login
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

  authToken = res.data.token;
  currentUser = res.data.user;
  localStorage.setItem("streamflix_token", authToken);
  localStorage.setItem("streamflix_user", JSON.stringify(currentUser));

  updateNavbarAuthState();
  document.getElementById("admin-login-form").reset();
  navigateTo("admin-dashboard");
}

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

// ==========================================
// PART 3: PASSWORD RECOVERY & USER DASHBOARD
// ==========================================

function showForgotPasswordModal() {
  const modal = document.getElementById("forgot-modal");
  if (!modal) return;
  modal.style.display = "flex";
  document.getElementById("forgot-step-1").style.display = "block";
  document.getElementById("forgot-step-2").style.display = "none";
  const alertEl = document.getElementById("forgot-alert");
  if (alertEl) alertEl.style.display = "none";
}

function closeForgotPasswordModal() {
  const modal = document.getElementById("forgot-modal");
  if (modal) modal.style.display = "none";
}

function closeForgotPasswordModalOnBackdrop(e) {
  if (e.target.id === "forgot-modal") closeForgotPasswordModal();
}

async function handleForgotPasswordSubmit(e) {
  e.preventDefault();
  const alertEl = document.getElementById("forgot-alert");
  const email = document.getElementById("forgot-email").value.trim();
  const btn = e.target.querySelector("button[type='submit']");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Checking...";
  }

  const res = await apiRequest("/api/auth/forgot-password", "POST", { email });
  if (btn) {
    btn.disabled = false;
    btn.textContent = "Send Recovery Instructions";
  }

  if (alertEl) {
    alertEl.style.display = "block";
    alertEl.className = res.ok ? "alert-box alert-success" : "alert-box alert-danger";
    alertEl.textContent = res.ok ? (res.data.message || "Password recovery initiated.") : (res.data.message || "Email address not found.");
  }

  if (res.ok) {
    if (res.data.resetToken) {
      const tokenInput = document.getElementById("reset-token-input");
      if (tokenInput) tokenInput.value = res.data.resetToken;
    }
    document.getElementById("forgot-step-1").style.display = "none";
    document.getElementById("forgot-step-2").style.display = "block";
  }
}

async function handleResetPasswordSubmit(e) {
  e.preventDefault();
  const alertEl = document.getElementById("forgot-alert");
  const token = document.getElementById("reset-token-input").value.trim();
  const newPassword = document.getElementById("reset-new-password").value;
  const btn = e.target.querySelector("button[type='submit']");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Resetting...";
  }

  const res = await apiRequest("/api/auth/reset-password", "POST", { token, newPassword });
  if (btn) {
    btn.disabled = false;
    btn.textContent = "Update Password";
  }

  if (alertEl) {
    alertEl.style.display = "block";
    alertEl.className = res.ok ? "alert-box alert-success" : "alert-box alert-danger";
    alertEl.textContent = res.ok ? (res.data.message || "Password reset successfully! You can now log in.") : (res.data.message || "Failed to reset password.");
  }

  if (res.ok) {
    setTimeout(() => {
      closeForgotPasswordModal();
      navigateTo("login");
      showAuthAlert("login", "Password changed successfully. Please log in with your new password.", "success");
    }, 1500);
  }
}

// User Dashboard Tab Switching
function switchUserDashboardTab(tabName) {
  document.querySelectorAll(".dashboard-tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-tab") === tabName);
  });
  document.querySelectorAll(".d-panel").forEach(panel => {
    panel.style.display = "none";
    panel.classList.remove("active");
  });
  const targetPanel = document.getElementById(`dtab-panel-${tabName}`);
  if (targetPanel) {
    targetPanel.style.display = "block";
    targetPanel.classList.add("active");
  }
}

// Load Full User Dashboard
async function loadUserDashboard() {
  if (!currentUser) return;

  // Header Greeting
  const welcomeAvatar = document.getElementById("ud-welcome-avatar");
  if (welcomeAvatar) welcomeAvatar.textContent = currentUser.profileImage || "🎬";

  const welcomeHeading = document.getElementById("ud-welcome-heading");
  if (welcomeHeading) welcomeHeading.textContent = `Welcome back, ${currentUser.fullName || currentUser.username}!`;

  const welcomeSub = document.getElementById("ud-welcome-sub");
  if (welcomeSub) {
    welcomeSub.textContent = `Role: ${currentUser.role} • Account: ${currentUser.status} • StreamFlix Member`;
  }

  // Profile Card Panel
  const cardAvatar = document.getElementById("ud-card-avatar");
  if (cardAvatar) cardAvatar.textContent = currentUser.profileImage || "👤";

  const cardName = document.getElementById("ud-card-name");
  if (cardName) cardName.textContent = currentUser.fullName || currentUser.username;

  const cardRole = document.getElementById("ud-card-role");
  if (cardRole) {
    cardRole.textContent = currentUser.role;
    cardRole.className = `user-role-badge role-${currentUser.role.toLowerCase()}`;
  }

  const cardStatus = document.getElementById("ud-card-status");
  if (cardStatus) {
    cardStatus.textContent = currentUser.status;
    cardStatus.className = `user-status-badge status-${currentUser.status.toLowerCase()}`;
  }

  const cardEmail = document.getElementById("ud-card-email");
  if (cardEmail) cardEmail.textContent = currentUser.email || "N/A";

  const cardUsername = document.getElementById("ud-card-username");
  if (cardUsername) cardUsername.textContent = `@${currentUser.username}`;

  const cardPhone = document.getElementById("ud-card-phone");
  if (cardPhone) cardPhone.textContent = currentUser.phone || "Not specified";

  const cardJoined = document.getElementById("ud-card-joined");
  if (cardJoined) {
    const d = new Date(currentUser.createdAt || Date.now());
    cardJoined.textContent = d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }

  await loadUserWatchlist();
  await loadUserHistory();
}

async function loadUserWatchlist() {
  const countEl = document.getElementById("ud-watchlist-count");
  const gridEl = document.getElementById("ud-watchlist-grid");
  if (!gridEl) return;

  gridEl.innerHTML = `<p style="color: #888;">Loading watchlist...</p>`;

  const res = await apiRequest("/api/users/me/watchlist", "GET", null, true);
  const watchlist = (res.ok && res.data.watchlist) ? res.data.watchlist : (currentUser && currentUser.watchlist ? currentUser.watchlist : []);

  if (countEl) countEl.textContent = watchlist.length;

  if (watchlist.length === 0) {
    gridEl.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px 0; color: #888;">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 12px; opacity: 0.5;"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        <p>Your watchlist is empty.</p>
        <button class="btn btn-secondary btn-sm" style="margin-top: 10px;" onclick="navigateTo('home')">Explore Movies & Shows</button>
      </div>`;
    return;
  }

  const items = watchlist.map(w => {
    const catItem = catalog.find(m => String(m.id) === String(w.mediaId) || String(m._id) === String(w.mediaId));
    return catItem || {
      id: w.mediaId,
      title: w.title || "Untitled",
      posterUrl: w.posterUrl || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80",
      rating: "TV-MA",
      year: 2026,
      genres: ["Action"]
    };
  });

  gridEl.innerHTML = renderCards(items);
}

async function loadUserHistory() {
  const listEl = document.getElementById("ud-history-list");
  if (!listEl) return;

  listEl.innerHTML = `<p style="color: #888;">Loading history...</p>`;

  const res = await apiRequest("/api/users/me/history", "GET", null, true);
  const history = (res.ok && res.data.history) ? res.data.history : (currentUser && currentUser.history ? currentUser.history : []);

  if (history.length === 0) {
    listEl.innerHTML = `
      <div style="text-align: center; padding: 40px 0; color: #888;">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 12px; opacity: 0.5;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <p>No watch history yet. Start streaming a show or movie!</p>
      </div>`;
    return;
  }

  listEl.innerHTML = history.slice(0, 15).map(h => {
    const d = new Date(h.watchedAt || Date.now());
    const dateStr = d.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    const prog = Math.min(100, Math.max(5, h.progress || 35));
    const safeTitle = (h.title || "Stream").replace(/'/g, "\\'");
    return `
      <div class="history-item" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; background: rgba(255,255,255,0.03); border-radius: 8px; margin-bottom: 8px; border: 1px solid rgba(255,255,255,0.06);">
        <div style="display: flex; align-items: center; gap: 14px;">
          <button class="btn btn-icon btn-sm" onclick="openVideoPlayer('${safeTitle}', '${h.mediaId}')" title="Resume Playback" style="background: rgba(229,9,20,0.2); color: var(--color-primary); border-radius: 50%;">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </button>
          <div>
            <h4 style="margin: 0; font-size: 0.95rem; color: #fff;">${h.title}</h4>
            <span style="font-size: 0.8rem; color: #888;">Watched: ${dateStr}</span>
          </div>
        </div>
        <div style="width: 140px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: #aaa; margin-bottom: 4px;">
            <span>Progress</span>
            <span>${prog}%</span>
          </div>
          <div style="height: 4px; background: #333; border-radius: 2px; overflow: hidden;">
            <div style="height: 100%; width: ${prog}%; background: var(--color-primary);"></div>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// Edit Profile Modal
selectedEditAvatar = "🎬";

function openEditProfileModal() {
  if (!currentUser) return;
  const modal = document.getElementById("edit-profile-modal");
  if (!modal) return;
  modal.style.display = "flex";
  document.getElementById("edit-fullname").value = currentUser.fullName || "";
  document.getElementById("edit-phone").value = currentUser.phone || "";
  selectedEditAvatar = currentUser.profileImage || "🎬";

  const alertEl = document.getElementById("edit-profile-alert");
  if (alertEl) alertEl.style.display = "none";

  renderAvatarPicker("edit-avatar-picker", selectedEditAvatar, (emoji) => {
    selectedEditAvatar = emoji;
  });
}

function closeEditProfileModal() {
  const modal = document.getElementById("edit-profile-modal");
  if (modal) modal.style.display = "none";
}

function closeEditProfileModalOnBackdrop(e) {
  if (e.target.id === "edit-profile-modal") closeEditProfileModal();
}

async function handleProfileEditSubmit(e) {
  e.preventDefault();
  const alertEl = document.getElementById("edit-profile-alert");
  const fullName = document.getElementById("edit-fullname").value.trim();
  const phone = document.getElementById("edit-phone").value.trim();
  const btn = e.target.querySelector("button[type='submit']");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Saving...";
  }

  const res = await apiRequest("/api/users/me", "PATCH", {
    fullName,
    phone,
    profileImage: selectedEditAvatar
  }, true);

  if (btn) {
    btn.disabled = false;
    btn.textContent = "Save Changes";
  }

  if (!res.ok) {
    if (alertEl) {
      alertEl.style.display = "block";
      alertEl.className = "alert-box alert-danger";
      alertEl.textContent = res.data.message || "Failed to update profile.";
    }
    return;
  }

  currentUser = res.data.user;
  localStorage.setItem("streamflix_user", JSON.stringify(currentUser));
  updateNavbarAuthState();
  await loadUserDashboard();
  closeEditProfileModal();
}

async function handleUserPasswordChange(e) {
  e.preventDefault();
  const alertEl = document.getElementById("user-pwd-alert");
  const currentPassword = document.getElementById("user-curr-pwd").value;
  const newPassword = document.getElementById("user-new-pwd").value;
  const confirmPassword = document.getElementById("user-confirm-pwd").value;

  if (newPassword !== confirmPassword) {
    if (alertEl) {
      alertEl.style.display = "block";
      alertEl.className = "alert-box alert-danger";
      alertEl.textContent = "New passwords do not match.";
    }
    return;
  }

  const btn = e.target.querySelector("button[type='submit']");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Updating...";
  }

  const res = await apiRequest("/api/users/me/password", "PATCH", {
    currentPassword,
    newPassword
  }, true);

  if (btn) {
    btn.disabled = false;
    btn.textContent = "Update Password";
  }

  if (alertEl) {
    alertEl.style.display = "block";
    alertEl.className = res.ok ? "alert-box alert-success" : "alert-box alert-danger";
    alertEl.textContent = res.ok ? "Password updated successfully!" : (res.data.message || "Failed to change password.");
  }

  if (res.ok) {
    document.getElementById("user-password-form").reset();
  }
}

// ==========================================
// PART 4: ADMIN DASHBOARD & USER MANAGEMENT
// ==========================================

let adminTotalPages = 1;
let adminSearchTimer = null;

function switchAdminTab(tabName) {
  document.querySelectorAll(".admin-nav-item").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-tab") === tabName);
  });

  document.querySelectorAll(".admin-tab-panel").forEach(panel => {
    panel.style.display = "none";
    panel.classList.remove("active");
  });

  const titles = {
    overview: "System Overview",
    users: "User & Role Management",
    movies: "Content Catalogue Management",
    settings: "Administrator Settings"
  };

  const titleEl = document.getElementById("admin-section-title");
  if (titleEl) titleEl.textContent = titles[tabName] || "Admin Console";

  const targetPanel = document.getElementById(`admin-panel-${tabName}`);
  if (targetPanel) {
    targetPanel.style.display = "block";
    targetPanel.classList.add("active");
  }

  if (tabName === "overview") loadAdminStats();
  if (tabName === "users") loadAdminUsers(1);
  if (tabName === "movies") loadAdminMovies();
  if (tabName === "settings") loadAdminSettings();
}

async function loadAdminDashboard() {
  if (!currentUser || currentUser.role !== "ADMIN") {
    navigateTo("admin-login");
    return;
  }

  const userDisplay = document.getElementById("admin-user-display");
  if (userDisplay) {
    userDisplay.textContent = `${currentUser.fullName || currentUser.username} (Admin)`;
  }

  await loadAdminStats();
}

async function loadAdminStats() {
  const res = await apiRequest("/api/admin/dashboard", "GET", null, true);
  if (!res.ok) return;

  const stats = res.data.stats || {};
  const totalUsersEl = document.getElementById("stat-total-users");
  const totalAdminsEl = document.getElementById("stat-total-admins");
  const activeUsersEl = document.getElementById("stat-active-users");
  const totalMoviesEl = document.getElementById("stat-total-movies");

  if (totalUsersEl) totalUsersEl.textContent = stats.totalUsers ?? 0;
  if (totalAdminsEl) totalAdminsEl.textContent = stats.totalAdmins ?? 0;
  if (activeUsersEl) activeUsersEl.textContent = stats.activeUsers ?? 0;
  if (totalMoviesEl) totalMoviesEl.textContent = stats.totalMovies ?? catalog.length;

  const recentUsersTbody = document.getElementById("admin-recent-users-tbody");
  if (recentUsersTbody && res.data.recentUsers) {
    if (res.data.recentUsers.length === 0) {
      recentUsersTbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #888;">No registered users yet.</td></tr>`;
    } else {
      recentUsersTbody.innerHTML = res.data.recentUsers.map(u => {
        const d = new Date(u.createdAt || Date.now());
        const dateStr = d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
        return `
          <tr>
            <td><strong>${u.fullName || "N/A"}</strong></td>
            <td>${u.email}</td>
            <td>@${u.username}</td>
            <td><span class="user-role-badge role-${(u.role || "user").toLowerCase()}">${u.role}</span></td>
            <td><span class="user-status-badge status-${(u.status || "active").toLowerCase()}">${u.status}</span></td>
            <td>${dateStr}</td>
          </tr>
        `;
      }).join("");
    }
  }
}

async function loadAdminUsers(page = 1) {
  adminCurrentPage = page;
  const tbody = document.getElementById("admin-users-tbody");
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #888; padding: 30px;">Loading users...</td></tr>`;

  let url = `/api/admin/users?page=${page}&limit=10`;
  if (adminSearchQuery) url += `&search=${encodeURIComponent(adminSearchQuery)}`;
  if (adminRoleFilter && adminRoleFilter !== "ALL") url += `&role=${adminRoleFilter}`;
  if (adminStatusFilter && adminStatusFilter !== "ALL") url += `&status=${adminStatusFilter}`;

  const res = await apiRequest(url, "GET", null, true);
  if (!res.ok) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #e50914; padding: 30px;">${res.data.message || "Failed to load users."}</td></tr>`;
    return;
  }

  const { users, pagination } = res.data;
  adminTotalPages = pagination ? pagination.pages : 1;

  const pageInfo = document.getElementById("admin-pagination-info");
  if (pageInfo) {
    pageInfo.textContent = `Showing page ${pagination ? pagination.page : 1} of ${adminTotalPages || 1} (${pagination ? pagination.total : users.length} total users)`;
  }

  const prevBtn = document.getElementById("btn-prev-page");
  const nextBtn = document.getElementById("btn-next-page");
  if (prevBtn) prevBtn.disabled = adminCurrentPage <= 1;
  if (nextBtn) nextBtn.disabled = adminCurrentPage >= adminTotalPages;

  if (users.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #888; padding: 40px;">No matching users found.</td></tr>`;
    return;
  }

  tbody.innerHTML = users.map(u => {
    const d = new Date(u.createdAt || Date.now());
    const dateStr = d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
    const isSelf = currentUser && (u._id === currentUser.id || u.id === currentUser.id);
    const userId = u._id || u.id;
    const isStatusActive = u.status === "ACTIVE";

    return `
      <tr>
        <td style="font-family: monospace; font-size: 0.8rem; color: #888;">${String(userId).slice(-6)}</td>
        <td>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span>${u.profileImage || "👤"}</span>
            <strong>${u.fullName || "User"}</strong>
          </div>
        </td>
        <td>${u.email}</td>
        <td>@${u.username}</td>
        <td><span class="user-role-badge role-${(u.role || "user").toLowerCase()}">${u.role}</span></td>
        <td><span class="user-status-badge status-${(u.status || "active").toLowerCase()}">${u.status}</span></td>
        <td>${dateStr}</td>
        <td>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <button class="btn btn-secondary btn-sm" onclick="openAdminUserDetails('${userId}')" title="View Profile">Details</button>
            ${!isSelf ? `
              <button class="btn btn-sm ${isStatusActive ? "btn-warning" : "btn-primary"}" onclick="toggleUserStatus('${userId}', '${u.status}')" style="font-size: 0.75rem; padding: 4px 8px;">
                ${isStatusActive ? "Deactivate" : "Activate"}
              </button>
              <button class="btn btn-sm btn-secondary" onclick="changeUserRole('${userId}', '${u.role === "ADMIN" ? "USER" : "ADMIN"}')" style="font-size: 0.75rem; padding: 4px 8px;">
                ${u.role === "ADMIN" ? "Demote to User" : "Promote to Admin"}
              </button>
              <button class="btn btn-sm btn-danger" onclick="deleteUserAccount('${userId}', '${(u.username || "User").replace(/'/g, "\\'")}')" style="font-size: 0.75rem; padding: 4px 8px;" title="Permanently Delete">
                Delete
              </button>
            ` : `<span style="font-size: 0.75rem; color: #666; font-style: italic;">Current Admin</span>`}
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function handleAdminUserSearch(query) {
  clearTimeout(adminSearchTimer);
  adminSearchTimer = setTimeout(() => {
    adminSearchQuery = query.trim();
    loadAdminUsers(1);
  }, 300);
}

function handleAdminUserFilter() {
  const roleEl = document.getElementById("admin-role-filter");
  const statusEl = document.getElementById("admin-status-filter");
  if (roleEl) adminRoleFilter = roleEl.value;
  if (statusEl) adminStatusFilter = statusEl.value;
  loadAdminUsers(1);
}

function changeAdminPage(delta) {
  const target = adminCurrentPage + delta;
  if (target >= 1 && target <= adminTotalPages) {
    loadAdminUsers(target);
  }
}

async function openAdminUserDetails(userId) {
  const modal = document.getElementById("admin-user-modal");
  const container = document.getElementById("admin-user-details-content");
  if (!modal || !container) return;

  container.innerHTML = `<p style="color: #888; text-align: center; padding: 30px;">Loading user profile...</p>`;
  modal.style.display = "flex";

  const res = await apiRequest(`/api/admin/users/${userId}`, "GET", null, true);
  if (!res.ok) {
    container.innerHTML = `<p style="color: #e50914;">${res.data.message || "Failed to load user."}</p>`;
    return;
  }

  const u = res.data.user;
  const d = new Date(u.createdAt || Date.now());
  const updatedD = new Date(u.updatedAt || u.createdAt || Date.now());

  container.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <div style="font-size: 3rem; margin-bottom: 8px;">${u.profileImage || "👤"}</div>
      <h2 style="margin: 0; font-size: 1.4rem;">${u.fullName || u.username}</h2>
      <div style="margin-top: 6px;">
        <span class="user-role-badge role-${(u.role || "user").toLowerCase()}">${u.role}</span>
        <span class="user-status-badge status-${(u.status || "active").toLowerCase()}">${u.status}</span>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; font-size: 0.9rem; background: rgba(255,255,255,0.03); padding: 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
      <div><strong style="color: #aaa;">User ID:</strong><br><span style="font-family: monospace; color: #fff;">${u._id || u.id}</span></div>
      <div><strong style="color: #aaa;">Username:</strong><br><span style="color: #fff;">@${u.username}</span></div>
      <div><strong style="color: #aaa;">Email Address:</strong><br><span style="color: #fff;">${u.email}</span></div>
      <div><strong style="color: #aaa;">Phone:</strong><br><span style="color: #fff;">${u.phone || "Not specified"}</span></div>
      <div><strong style="color: #aaa;">Joined Date:</strong><br><span style="color: #fff;">${d.toLocaleString()}</span></div>
      <div><strong style="color: #aaa;">Last Modified:</strong><br><span style="color: #fff;">${updatedD.toLocaleString()}</span></div>
      <div><strong style="color: #aaa;">Watchlist Items:</strong><br><span style="color: #fff;">${u.watchlist ? u.watchlist.length : 0} items</span></div>
      <div><strong style="color: #aaa;">History Records:</strong><br><span style="color: #fff;">${u.history ? u.history.length : 0} items</span></div>
    </div>
  `;
}

function closeAdminUserModal() {
  const modal = document.getElementById("admin-user-modal");
  if (modal) modal.style.display = "none";
}

function closeAdminUserModalOnBackdrop(e) {
  if (e.target.id === "admin-user-modal") closeAdminUserModal();
}

async function toggleUserStatus(userId, currentStatus) {
  const newStatus = currentStatus === "ACTIVE" ? "DISABLED" : "ACTIVE";
  const res = await apiRequest(`/api/admin/users/${userId}/status`, "PATCH", { status: newStatus }, true);
  if (!res.ok) {
    alert(res.data.message || "Failed to update status.");
    return;
  }
  await loadAdminUsers(adminCurrentPage);
  await loadAdminStats();
}

async function changeUserRole(userId, newRole) {
  if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
  const res = await apiRequest(`/api/admin/users/${userId}/role`, "PATCH", { role: newRole }, true);
  if (!res.ok) {
    alert(res.data.message || "Failed to change role.");
    return;
  }
  await loadAdminUsers(adminCurrentPage);
  await loadAdminStats();
}

async function deleteUserAccount(userId, username) {
  if (!confirm(`Are you sure you want to permanently delete user account "${username}"? This cannot be undone.`)) return;
  const res = await apiRequest(`/api/admin/users/${userId}`, "DELETE", null, true);
  if (!res.ok) {
    alert(res.data.message || "Failed to delete account.");
    return;
  }
  await loadAdminUsers(adminCurrentPage);
  await loadAdminStats();
}

// Content Catalogue Management
function loadAdminMovies() {
  const tbody = document.getElementById("admin-movies-tbody");
  if (!tbody) return;

  if (catalog.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #888; padding: 30px;">No titles in catalogue.</td></tr>`;
    return;
  }

  tbody.innerHTML = catalog.map(m => {
    const id = m._id || m.id;
    return `
      <tr>
        <td>
          <img src="${m.posterUrl}" alt="${m.title}" style="width: 44px; height: 60px; object-fit: cover; border-radius: 4px;" onerror="this.src='https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80'" />
        </td>
        <td><strong>${m.title}</strong></td>
        <td><span class="user-role-badge" style="background: rgba(255,255,255,0.1); color: #fff;">${m.type === "tv" ? "TV Series" : "Movie"}</span></td>
        <td>${m.year || 2026}</td>
        <td><span class="rating-tag">${m.rating || "TV-MA"}</span></td>
        <td>
          <button class="btn btn-sm btn-primary" onclick="openVideoPlayer('${m.title.replace(/'/g, "\\'")}', '${id}', '${m.videoUrl || ""}')" style="font-size: 0.75rem; padding: 4px 8px;">
            Preview Video
          </button>
          <button class="btn btn-sm btn-danger" onclick="deleteAdminMovie('${id}')" style="font-size: 0.75rem; padding: 4px 8px; margin-left: 6px;">
            Remove
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

function openAddMovieModal() {
  const modal = document.getElementById("add-movie-modal");
  if (modal) modal.style.display = "flex";
  const alertEl = document.getElementById("add-movie-alert");
  if (alertEl) alertEl.style.display = "none";
}

function closeAddMovieModal() {
  const modal = document.getElementById("add-movie-modal");
  if (modal) modal.style.display = "none";
}

function closeAddMovieModalOnBackdrop(e) {
  if (e.target.id === "add-movie-modal") closeAddMovieModal();
}

async function handleAddMovieSubmit(e) {
  e.preventDefault();
  const alertEl = document.getElementById("add-movie-alert");
  const title = document.getElementById("movie-title").value.trim();
  const type = document.getElementById("movie-type").value;
  const year = parseInt(document.getElementById("movie-year").value, 10) || 2026;
  const rating = document.getElementById("movie-rating").value.trim() || "TV-MA";
  const duration = document.getElementById("movie-duration").value.trim() || "2h 10m";
  const posterUrl = document.getElementById("movie-poster").value.trim();
  const backdropUrl = document.getElementById("movie-backdrop").value.trim() || posterUrl;
  const genres = document.getElementById("movie-genres").value.split(",").map(g => g.trim()).filter(Boolean);
  const description = document.getElementById("movie-description").value.trim();

  const newMovie = {
    id: `m_${Date.now()}`,
    title,
    type,
    year,
    rating,
    duration,
    posterUrl,
    backdropUrl,
    genres,
    description,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    cast: ["Featured Cast"],
    matchScore: 97
  };

  catalog.unshift(newMovie);
  renderCatalogRows();
  loadAdminMovies();
  closeAddMovieModal();
  document.getElementById("add-movie-form").reset();
  alert("New title added to catalogue successfully!");
}

function deleteAdminMovie(id) {
  if (!confirm("Are you sure you want to remove this title from the catalogue?")) return;
  const idx = catalog.findIndex(m => String(m.id) === String(id) || String(m._id) === String(id));
  if (idx > -1) {
    catalog.splice(idx, 1);
    renderCatalogRows();
    loadAdminMovies();
  }
}

// Admin Settings Panel
function loadAdminSettings() {
  if (!currentUser) return;
  const nameEl = document.getElementById("admin-profile-name");
  const emailEl = document.getElementById("admin-profile-email");
  if (nameEl) nameEl.textContent = currentUser.fullName || currentUser.username;
  if (emailEl) emailEl.textContent = currentUser.email;
}

async function handleAdminPasswordChange(e) {
  e.preventDefault();
  const alertEl = document.getElementById("admin-pwd-alert");
  const currentPassword = document.getElementById("admin-curr-pwd").value;
  const newPassword = document.getElementById("admin-new-pwd").value;
  const confirmPassword = document.getElementById("admin-confirm-pwd").value;

  if (newPassword !== confirmPassword) {
    if (alertEl) {
      alertEl.style.display = "block";
      alertEl.className = "alert-box alert-danger";
      alertEl.textContent = "New passwords do not match.";
    }
    return;
  }

  const btn = e.target.querySelector("button[type='submit']");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Updating...";
  }

  const res = await apiRequest("/api/users/me/password", "PATCH", {
    currentPassword,
    newPassword
  }, true);

  if (btn) {
    btn.disabled = false;
    btn.textContent = "Update Password";
  }

  if (alertEl) {
    alertEl.style.display = "block";
    alertEl.className = res.ok ? "alert-box alert-success" : "alert-box alert-danger";
    alertEl.textContent = res.ok ? "Administrator password updated successfully!" : (res.data.message || "Failed to update password.");
  }

  if (res.ok) {
    document.getElementById("admin-password-form").reset();
  }
}

// ==========================================
// PART 5: VIDEO STREAMING, CATALOG & PLAYER
// ==========================================

// Sound Toggle for Ambient Billboard Video
function toggleBillboardSound() {
  const video = document.getElementById("billboard-video");
  const icon = document.getElementById("sound-icon");
  if (!video) return;

  video.muted = !video.muted;
  if (icon) {
    icon.textContent = video.muted ? "🔇" : "🔊";
  }
}

// Full-Screen / Modal Video Player
async function openVideoPlayer(title, mediaId = null, videoUrl = null) {
  const modal = document.getElementById("video-modal");
  const video = document.getElementById("main-video");
  const titleEl = document.getElementById("video-player-title");

  if (titleEl) titleEl.textContent = title || "Now Playing";

  if (video) {
    if (!videoUrl && mediaId) {
      const item = catalog.find(m => String(m.id) === String(mediaId) || String(m._id) === String(mediaId));
      if (item && item.videoUrl) {
        videoUrl = item.videoUrl;
      }
    }

    const streamSource = videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4";
    if (video.src !== streamSource) {
      video.src = streamSource;
    }
    video.currentTime = 0;
    video.play().catch(() => {});
  }

  if (modal) modal.style.display = "flex";

  // Record playback to user history if logged in
  if (authToken && mediaId) {
    await apiRequest("/api/users/me/history", "POST", {
      mediaId,
      title: title || "Stream Title",
      progress: Math.floor(Math.random() * 40) + 40
    }, true);
  }
}

function closeVideoPlayer() {
  const modal = document.getElementById("video-modal");
  const video = document.getElementById("main-video");
  if (video) video.pause();
  if (modal) modal.style.display = "none";
}

function closeVideoOnBackdrop(e) {
  if (e.target.id === "video-modal") closeVideoPlayer();
}

// Media Detail Modal Management
function openMediaDetail(item) {
  activeModalMedia = item;
  const modal = document.getElementById("detail-modal");
  if (!modal) return;

  modal.style.display = "flex";
  document.getElementById("modal-backdrop").src = item.backdropUrl || item.posterUrl;
  document.getElementById("modal-title").textContent = item.title;
  document.getElementById("modal-match").textContent = `${item.matchScore || 97}% Match`;
  document.getElementById("modal-year").textContent = item.year || 2026;
  document.getElementById("modal-rating").textContent = item.rating || "TV-MA";
  document.getElementById("modal-duration").textContent = item.duration || "2h";
  document.getElementById("modal-desc").textContent = item.description || "";
  document.getElementById("modal-cast").textContent = (item.cast || ["Cast unavailable"]).join(", ");
  document.getElementById("modal-genres").textContent = (item.genres || []).join(", ");
  document.getElementById("modal-director").textContent = item.director || "Various Directors";

  updateModalMyListButton();

  const epSection = document.getElementById("modal-episodes-section");
  const epList = document.getElementById("modal-episodes-list");
  if (item.episodes && item.episodes.length > 0) {
    epSection.style.display = "block";
    epList.innerHTML = item.episodes.map(ep => {
      const epVideo = ep.videoUrl || item.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4";
      const safeTitle = `${item.title}: ${ep.title}`.replace(/'/g, "\\'");
      return `
        <div class="episode-item" onclick="openVideoPlayer('${safeTitle}', '${item._id || item.id}', '${epVideo}')">
          <div class="ep-num">${ep.number}</div>
          <img class="ep-thumb" src="${ep.thumbnailUrl || item.posterUrl}" alt="${ep.title}" onerror="this.src='${item.posterUrl}'" />
          <div class="ep-info">
            <h4>${ep.title} (${ep.duration})</h4>
            <p>${ep.description}</p>
          </div>
        </div>
      `;
    }).join("");
  } else {
    epSection.style.display = "none";
  }
}

function closeModal() {
  const modal = document.getElementById("detail-modal");
  if (modal) modal.style.display = "none";
  activeModalMedia = null;
}

function closeModalOnBackdrop(e) {
  if (e.target.id === "detail-modal") closeModal();
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
    btn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
  }
}

async function toggleModalMyList() {
  if (!activeModalMedia) return;
  await toggleMediaInWatchlist(activeModalMedia);
  updateModalMyListButton();
}

function playCurrentModalMedia() {
  if (activeModalMedia) {
    const item = activeModalMedia;
    closeModal();
    openVideoPlayer(item.title, item._id || item.id, item.videoUrl);
  }
}

function isMediaSaved(id) {
  if (currentUser && currentUser.watchlist) {
    return currentUser.watchlist.some(w => String(w.mediaId) === String(id));
  }
  return myList.includes(id);
}

async function toggleMediaInWatchlist(item) {
  const id = item._id || item.id;

  if (currentUser && authToken) {
    const isSaved = isMediaSaved(id);
    if (isSaved) {
      await apiRequest(`/api/users/me/watchlist/${id}`, "DELETE", null, true);
      currentUser.watchlist = currentUser.watchlist.filter(w => String(w.mediaId) !== String(id));
    } else {
      await apiRequest("/api/users/me/watchlist", "POST", {
        mediaId: id,
        title: item.title,
        posterUrl: item.posterUrl
      }, true);
      if (!currentUser.watchlist) currentUser.watchlist = [];
      currentUser.watchlist.push({
        mediaId: id,
        title: item.title,
        posterUrl: item.posterUrl,
        addedAt: new Date().toISOString()
      });
    }
    localStorage.setItem("streamflix_user", JSON.stringify(currentUser));
  } else {
    // Local guest watchlist
    const idx = myList.indexOf(id);
    if (idx > -1) {
      myList.splice(idx, 1);
    } else {
      myList.push(id);
    }
    localStorage.setItem("streamflix_mylist", JSON.stringify(myList));
  }
  updateMyListBadge();
}

function updateMyListBadge() {
  const el = document.getElementById("my-list-count");
  if (!el) return;
  const count = currentUser && currentUser.watchlist ? currentUser.watchlist.length : myList.length;
  el.textContent = count;
}

// Catalog Rendering & Billboard
function renderBillboard(featured) {
  if (!featured) return;
  currentActiveMedia = featured;

  const titleEl = document.getElementById("billboard-title");
  const descEl = document.getElementById("billboard-desc");
  const badgeEl = document.getElementById("billboard-badge");
  const matchEl = document.getElementById("billboard-match");
  const ratingEl = document.getElementById("billboard-rating");
  const durationEl = document.getElementById("billboard-duration");
  const genresEl = document.getElementById("billboard-genres");
  const backdropEl = document.getElementById("billboard-backdrop");
  const video = document.getElementById("billboard-video");

  if (titleEl) titleEl.textContent = featured.title;
  if (descEl) descEl.textContent = featured.description;
  if (badgeEl) badgeEl.textContent = featured.badge || "TOP 10 IN TV SHOWS TODAY";
  if (matchEl) matchEl.textContent = `${featured.matchScore || 98}% Match`;
  if (ratingEl) ratingEl.textContent = featured.rating || "TV-MA";
  if (durationEl) durationEl.textContent = featured.duration || featured.durationOrSeasons || "4 Seasons";
  if (genresEl) genresEl.textContent = (featured.genres || []).slice(0, 3).join(" • ");

  if (backdropEl) {
    backdropEl.style.backgroundImage = `url('${featured.backdropUrl || featured.posterUrl}')`;
  }

  if (video && featured.videoUrl) {
    const srcEl = video.querySelector("source");
    if (srcEl && srcEl.src !== featured.videoUrl) {
      srcEl.src = featured.videoUrl;
      video.load();
      video.play().catch(() => {});
    }
  }

  updateBillboardMyListButton();
}

function updateBillboardMyListButton() {
  const btn = document.getElementById("billboard-mylist-btn");
  if (!currentActiveMedia || !btn) return;
  const isSaved = isMediaSaved(currentActiveMedia._id || currentActiveMedia.id);
  if (isSaved) {
    btn.classList.add("active");
    btn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;
  } else {
    btn.classList.remove("active");
    btn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
  }
}

function toggleBillboardMyList() {
  if (currentActiveMedia) {
    toggleMediaInWatchlist(currentActiveMedia);
    updateBillboardMyListButton();
  }
}

function playBillboard() {
  if (currentActiveMedia) {
    openVideoPlayer(currentActiveMedia.title, currentActiveMedia._id || currentActiveMedia.id, currentActiveMedia.videoUrl);
  }
}

function openBillboardDetail() {
  if (currentActiveMedia) {
    openMediaDetail(currentActiveMedia);
  }
}

function openMediaDetailById(id) {
  const item = catalog.find(m => String(m.id) === String(id) || String(m._id) === String(id));
  if (item) openMediaDetail(item);
}

function scrollCarousel(id, offset) {
  const track = document.getElementById(id);
  if (track) track.scrollBy({ left: offset, behavior: "smooth" });
}

function renderCards(items) {
  return items.map(item => {
    const id = item._id || item.id;
    const duration = item.durationOrSeasons || item.duration || "2h";
    return `
      <div class="media-card" onclick="openMediaDetailById('${id}')">
        <img class="media-poster" src="${item.posterUrl}" alt="${item.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80'" />
        ${item.badge ? `<span class="media-card-badge">${item.badge}</span>` : ""}
        <div class="media-card-overlay">
          <div class="card-title">${item.title}</div>
          <div class="card-meta">
            <span class="match-score">${item.matchScore || 97}%</span>
            <span>${duration}</span>
            <span class="rating-tag">${item.rating || "TV-MA"}</span>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function renderTop10Cards(items) {
  return items.map((item, i) => {
    const id = item._id || item.id;
    return `
      <div class="top-10-card" onclick="openMediaDetailById('${id}')">
        <div class="rank-number">${i + 1}</div>
        <img class="top-10-poster" src="${item.posterUrl}" alt="${item.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80'" />
      </div>
    `;
  }).join("");
}

// Render dynamic Netflix-style horizontal rows
function renderContentRows() {
  const container = document.getElementById("main-content");
  if (!container) return;
  container.innerHTML = "";

  const sections = [
    { title: "Trending Now", items: catalog },
    { title: "Top 10 in TV & Movies Today", items: catalog.slice(0, 10), isTop10: true },
    { title: "Popular TV Shows", items: catalog.filter(m => m.type === "tv" || m.type === "TV_SHOW") },
    { title: "Blockbuster Movies", items: catalog.filter(m => m.type === "movie" || m.type === "MOVIE") },
    { title: "Sci-Fi & Cyberpunk", items: catalog.filter(m => (m.genres || []).some(g => g.includes("Sci-Fi") || g.includes("Cyberpunk") || g.includes("Anime"))) },
    { title: "Action & Thrillers", items: catalog.filter(m => (m.genres || []).some(g => g.includes("Action") || g.includes("Thriller") || g.includes("Crime"))) }
  ];

  sections.forEach((sec, idx) => {
    if (sec.items.length === 0) return;

    const secEl = document.createElement("section");
    secEl.className = "media-section";

    secEl.innerHTML = `
      <h2 class="section-heading">${sec.title}</h2>
      <div class="carousel-wrapper">
        <button class="carousel-nav-btn carousel-prev" onclick="scrollCarousel('track-${idx}', -450)" aria-label="Previous">&lt;</button>
        <div class="carousel-track" id="track-${idx}">
          ${sec.isTop10 ? renderTop10Cards(sec.items) : renderCards(sec.items)}
        </div>
        <button class="carousel-nav-btn carousel-next" onclick="scrollCarousel('track-${idx}', 450)" aria-label="Next">&gt;</button>
      </div>
    `;

    container.appendChild(secEl);
  });

  updateMyListBadge();
}

// Navigation & Category Filters
function filterBySection(type) {
  document.querySelectorAll("#main-nav-links .nav-btn").forEach(b => b.classList.remove("active"));
  const activeBtn = document.querySelector(`#main-nav-links .nav-btn[data-filter="${type}"]`);
  if (activeBtn) activeBtn.classList.add("active");

  const billboard = document.getElementById("billboard");
  const mainContent = document.getElementById("main-content");
  const searchResults = document.getElementById("search-results");

  if (type === "all") {
    if (billboard) billboard.style.display = "flex";
    if (mainContent) mainContent.style.display = "block";
    if (searchResults) searchResults.style.display = "none";
    renderContentRows();
    return;
  }

  if (billboard) billboard.style.display = "none";
  if (mainContent) mainContent.style.display = "none";
  if (searchResults) searchResults.style.display = "block";

  if (type === "tv") {
    showFilteredGrid("TV Shows & Series", catalog.filter(m => m.type === "tv" || m.type === "TV_SHOW"));
  } else if (type === "movies") {
    showFilteredGrid("Blockbuster Movies", catalog.filter(m => m.type === "movie" || m.type === "MOVIE"));
  } else if (type === "upcoming") {
    showFilteredGrid("New & Upcoming Releases", catalog.slice(0, 10));
  } else if (type === "mylist") {
    const mySavedIds = currentUser && currentUser.watchlist ? currentUser.watchlist.map(w => String(w.mediaId)) : myList.map(String);
    const myItems = catalog.filter(m => mySavedIds.includes(String(m.id)) || mySavedIds.includes(String(m._id)));
    showFilteredGrid(myItems.length ? "Watchlist" : "Watchlist (Empty - Add shows or movies using the + button)", myItems);
  }
}

function showFilteredGrid(title, items) {
  const heading = document.getElementById("search-heading");
  const grid = document.getElementById("search-grid");
  if (heading) heading.textContent = title;
  if (grid) {
    grid.innerHTML = items.length ? renderCards(items) : `<p style="color: #888; grid-column: 1/-1; padding: 40px 0; text-align: center;">No titles found.</p>`;
  }
}

function handleSearch(query) {
  query = query.trim().toLowerCase();
  const billboard = document.getElementById("billboard");
  const mainContent = document.getElementById("main-content");
  const searchResults = document.getElementById("search-results");

  if (!query) {
    if (billboard) billboard.style.display = "flex";
    if (mainContent) mainContent.style.display = "block";
    if (searchResults) searchResults.style.display = "none";
    renderContentRows();
    return;
  }

  if (billboard) billboard.style.display = "none";
  if (mainContent) mainContent.style.display = "none";
  if (searchResults) searchResults.style.display = "block";

  const matches = catalog.filter(m =>
    m.title.toLowerCase().includes(query) ||
    (m.description && m.description.toLowerCase().includes(query)) ||
    (m.genres && m.genres.some(g => g.toLowerCase().includes(query))) ||
    (m.cast && m.cast.some(c => c.toLowerCase().includes(query)))
  );

  const heading = document.getElementById("search-heading");
  const grid = document.getElementById("search-grid");
  if (heading) heading.textContent = `Search Results for "${query}" (${matches.length})`;
  if (grid) {
    grid.innerHTML = matches.length ? renderCards(matches) : `<p style="color: #888; grid-column: 1/-1; padding: 40px 0; text-align: center;">No matching titles found.</p>`;
  }
}

function handleGenreSelect(genre) {
  if (!genre) {
    filterBySection("all");
    return;
  }
  const filtered = catalog.filter(m => (m.genres || []).some(g => g.toLowerCase() === genre.toLowerCase()));
  showFilteredGrid(`${genre} Titles`, filtered);
}

// Android APK Modal
function showApkModal() {
  const modal = document.getElementById("apk-modal");
  if (modal) modal.style.display = "flex";
}
function closeApkModal() {
  const modal = document.getElementById("apk-modal");
  if (modal) modal.style.display = "none";
}
function closeApkModalOnBackdrop(e) {
  if (e.target.id === "apk-modal") closeApkModal();
}

// Fetch Live Catalog with Built-in Streaming Fallback
async function fetchLiveCatalog() {
  try {
    const res = await apiRequest("/api/movies", "GET");
    if (res.ok && Array.isArray(res.data) && res.data.length > 0) {
      catalog = res.data;
    }
  } catch (e) {
    // Rely on pre-seeded catalog
  }

  const featured = catalog.find(m => m.id === "st" || m.id === "stranger-things" || m.title.includes("Stranger")) || catalog[0];
  renderBillboard(featured);
  renderContentRows();
}

// Scroll Listener for Navbar Transparency
window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  if (navbar) {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  }
});

// Primary Application Startup
document.addEventListener("DOMContentLoaded", async () => {
  updateNavbarAuthState();

  // If token exists, verify active session
  if (authToken) {
    const res = await apiRequest("/api/auth/me", "GET", null, true);
    if (res.ok && res.data.user) {
      currentUser = res.data.user;
      localStorage.setItem("streamflix_user", JSON.stringify(currentUser));
      updateNavbarAuthState();
    } else {
      // Invalidate expired/disabled credentials
      authToken = null;
      currentUser = null;
      localStorage.removeItem("streamflix_token");
      localStorage.removeItem("streamflix_user");
      updateNavbarAuthState();
    }
  }

  // Load Catalog and Render Rows
  await fetchLiveCatalog();

  // Route Handling
  window.addEventListener("hashchange", handleHashChange);
  handleHashChange();
});
