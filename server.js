const app = require("./server/app");
const config = require("./server/config/config");
const { connectDB } = require("./server/config/db");
const { seedDatabase } = require("./server/seed/seedAdmin");

async function startServer() {
  try {
    console.log("--------------------------------------------------");
    console.log("          Starting StreamFlix OTT Platform        ");
    console.log("--------------------------------------------------");

    // 1. Connect Database
    await connectDB();

    // 2. Bootstrap first admin & catalog if needed
    await seedDatabase();

    // 3. Listen on configured port
    const server = app.listen(config.port, () => {
      console.log(`[StreamFlix] Server running at http://localhost:${config.port}`);
      console.log(`[StreamFlix] Environment: ${config.nodeEnv}`);
      console.log(`[StreamFlix] User Login: http://localhost:${config.port}/#/login`);
      console.log(`[StreamFlix] Admin Login: http://localhost:${config.port}/#/admin/login`);
      console.log("--------------------------------------------------");
    });

    return server;
  } catch (err) {
    console.error("[StreamFlix Fatal] Could not start server:", err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { startServer };
