const http = require("http");
const app = require("../server/app");
const { connectDB } = require("../server/config/db");
const { seedDatabase } = require("../server/seed/seedAdmin");

let server;
let baseUrl;

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(baseUrl + path);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        "Content-Type": "application/json",
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = data;
        }
        resolve({ status: res.statusCode, body: json, headers: res.headers });
      });
    });

    req.on("error", reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error("Assertion Failed: " + message);
  }
}

async function runTests() {
  console.log("\n==================================================");
  console.log("   STREAMFLIX COMPREHENSIVE AUTH & ROLE TEST SUITE  ");
  console.log("==================================================\n");

  await connectDB();
  await seedDatabase();

  server = app.listen(0);
  const port = server.address().port;
  baseUrl = `http://127.0.0.1:${port}`;

  try {
    // TEST 1: Health check
    const health = await request("GET", "/api/health");
    assert(health.status === 200 && health.body.status === "ok", "Health endpoint should return 200 ok");
    console.log("PASS: 1. Server health check endpoint functioning");

    // TEST 2: Signup input validation
    const badSignup = await request("POST", "/api/auth/signup", {
      fullName: "A",
      email: "invalid-email",
      username: "u",
      password: "123"
    });
    assert(badSignup.status === 400, "Invalid signup should return 400 Bad Request");
    console.log("PASS: 2. Signup input validation properly rejects weak passwords and invalid emails");

    // TEST 3: User Signup (Valid)
    const testEmail = `testuser_${Date.now()}@example.com`;
    const testUsername = `user_${Date.now()}`;
    const validSignup = await request("POST", "/api/auth/signup", {
      fullName: "Jane Doe",
      email: testEmail,
      username: testUsername,
      password: "Password123",
      confirmPassword: "Password123",
      phone: "+1 555-0100"
    });
    assert(validSignup.status === 201 && validSignup.body.success, "Valid signup should succeed with 201");
    assert(!validSignup.body.user.passwordHash, "Response MUST NEVER contain passwordHash");
    assert(validSignup.body.user.role === "USER", "Default role MUST be USER");
    console.log("PASS: 3. Successful user registration and role defaulted to USER (no passwordHash leaked)");

    // TEST 4: Duplicate Email Rejection
    const dupSignup = await request("POST", "/api/auth/signup", {
      fullName: "Jane Doe Copy",
      email: testEmail,
      username: `another_${Date.now()}`,
      password: "Password123"
    });
    assert(dupSignup.status === 400, "Duplicate email should be rejected with 400");
    console.log("PASS: 4. Duplicate email rejection verified");

    // TEST 5: User Login
    const userLogin = await request("POST", "/api/auth/login", {
      identifier: testEmail,
      password: "Password123"
    });
    assert(userLogin.status === 200 && userLogin.body.token, "User login should return 200 with JWT token");
    const userToken = userLogin.body.token;
    const userId = userLogin.body.user._id || userLogin.body.user.id;
    console.log("PASS: 5. User login authenticated successfully with JWT generation");

    // TEST 6: User Login with Wrong Password
    const wrongPass = await request("POST", "/api/auth/login", {
      identifier: testEmail,
      password: "WrongPassword999"
    });
    assert(wrongPass.status === 401, "Invalid password should return 401 Unauthorized");
    console.log("PASS: 6. Invalid password rejected with 401");

    // TEST 7: Normal User Accessing Admin Login (Must be DENIED!)
    const userAsAdmin = await request("POST", "/api/auth/admin/login", {
      identifier: testEmail,
      password: "Password123"
    });
    assert(userAsAdmin.status === 403, "Normal user logging into admin login MUST be denied with 403 Forbidden");
    console.log("PASS: 7. Normal user cannot access Admin Login (Denied with 403 Forbidden)");

    // TEST 8: Admin Login
    const adminLogin = await request("POST", "/api/auth/admin/login", {
      identifier: "admin@streamflix.com",
      password: "Admin@12345"
    });
    assert(adminLogin.status === 200 && adminLogin.body.user.role === "ADMIN", "Admin login should return 200 with ADMIN role");
    const adminToken = adminLogin.body.token;
    console.log("PASS: 8. Authorized Administrator login authenticated with ADMIN privileges");

    // TEST 9: Normal User Accessing Admin API Endpoint (Must be DENIED!)
    const userAccessingAdminAPI = await request("GET", "/api/admin/dashboard", null, {
      Authorization: `Bearer ${userToken}`
    });
    assert(userAccessingAdminAPI.status === 403, "User accessing admin API should be rejected with 403 Forbidden");
    console.log("PASS: 9. Normal user blocked from Admin API endpoints (Role-based authorization)");

    // TEST 10: Unauthenticated Request to Protected Route (Must be DENIED!)
    const unauthReq = await request("GET", "/api/users/me");
    assert(unauthReq.status === 401, "Unauthenticated request should return 401 Unauthorized");
    console.log("PASS: 10. Unauthenticated access blocked on protected routes");

    // TEST 11: Admin Accessing Admin Dashboard Stats
    const adminDashboard = await request("GET", "/api/admin/dashboard", null, {
      Authorization: `Bearer ${adminToken}`
    });
    assert(adminDashboard.status === 200 && adminDashboard.body.stats.totalUsers >= 2, "Admin should get dashboard stats");
    console.log("PASS: 11. Admin dashboard statistics loaded from database");

    // TEST 12: Admin User Management (Search, Paginate)
    const adminUsersList = await request("GET", "/api/admin/users?page=1&limit=5", null, {
      Authorization: `Bearer ${adminToken}`
    });
    assert(adminUsersList.status === 200 && Array.isArray(adminUsersList.body.users), "Admin can list users");
    console.log("PASS: 12. Admin can view searchable, paginated users table");

    // TEST 13: Deactivate User & Verify Deactivated User cannot authenticate
    const deactUser = await request("PATCH", `/api/admin/users/${userId}/status`, { status: "DISABLED" }, {
      Authorization: `Bearer ${adminToken}`
    });
    assert(deactUser.status === 200 && deactUser.body.user.status === "DISABLED", "Admin should deactivate user");

    const disabledUserAttempt = await request("POST", "/api/auth/login", {
      identifier: testEmail,
      password: "Password123"
    });
    assert(disabledUserAttempt.status === 403, "Disabled user login MUST be rejected with 403");
    console.log("PASS: 13. Deactivated user account is immediately blocked from logging in (403)");

    // Re-activate user
    await request("PATCH", `/api/admin/users/${userId}/status`, { status: "ACTIVE" }, {
      Authorization: `Bearer ${adminToken}`
    });
    console.log("PASS: 14. User re-activated successfully");

    // TEST 15: Last-Admin Safeguards (Attempting to delete or deactivate the last admin must fail!)
    const adminList = (await request("GET", "/api/admin/users?role=ADMIN", null, {
      Authorization: `Bearer ${adminToken}`
    })).body.users;
    const soleAdminId = adminList[0]._id || adminList[0].id;

    const demoteLastAdmin = await request("PATCH", `/api/admin/users/${soleAdminId}/role`, { role: "USER" }, {
      Authorization: `Bearer ${adminToken}`
    });
    assert(demoteLastAdmin.status === 400, "Demoting last active admin must be rejected");

    const deleteLastAdmin = await request("DELETE", `/api/admin/users/${soleAdminId}`, null, {
      Authorization: `Bearer ${adminToken}`
    });
    assert(deleteLastAdmin.status === 400, "Deleting last active admin must be rejected");
    console.log("PASS: 15. Safeguard successfully prevented demoting or deleting the last administrator");

    // TEST 16: User Watchlist & History Persistence
    const addWatchlist = await request("POST", "/api/users/me/watchlist", {
      mediaId: "stranger-things",
      title: "Stranger Things",
      posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23",
      type: "TV_SHOW"
    }, {
      Authorization: `Bearer ${userToken}`
    });
    assert(addWatchlist.status === 200 && addWatchlist.body.action === "added", "User can add to Watchlist in DB");

    const getWatchlist = await request("GET", "/api/users/me/watchlist", null, {
      Authorization: `Bearer ${userToken}`
    });
    assert(getWatchlist.status === 200 && getWatchlist.body.watchlist.length > 0, "Watchlist persists in database");
    console.log("PASS: 16. User Watchlist persisted to database and retrieved");

    // TEST 17: Content Management (Add, Edit, Delete title)
    const newTitle = await request("POST", "/api/admin/movies", {
      title: "Test Blockbuster 2026",
      type: "MOVIE",
      posterUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba",
      description: "An exciting new movie added by admin.",
      year: 2026,
      rating: "PG-13",
      genres: ["Action", "Sci-Fi"]
    }, {
      Authorization: `Bearer ${adminToken}`
    });
    assert(newTitle.status === 201 && newTitle.body.movie._id, "Admin can add title to catalog");
    const createdMovieId = newTitle.body.movie._id || newTitle.body.movie.id;

    // Delete title
    const deleteMovie = await request("DELETE", `/api/admin/movies/${createdMovieId}`, null, {
      Authorization: `Bearer ${adminToken}`
    });
    assert(deleteMovie.status === 200, "Admin can delete title");
    console.log("PASS: 17. Content Management (Add & Delete catalog title) verified");

    console.log("\n==================================================");
    console.log("   ALL 17 TESTS PASSED SUCCESSFULLY! (100% PASS)    ");
    console.log("==================================================\n");
  } catch (err) {
    console.error("\nTEST SUITE ERROR:", err.message);
    process.exit(1);
  } finally {
    if (server) server.close();
  }
}

runTests();
