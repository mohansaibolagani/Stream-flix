const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const config = require("./config");

let dbType = "unknown";
const dataDir = path.join(__dirname, "../../data");
const dbFilePath = path.join(dataDir, "streamflix.json");

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// In-file JSON storage fallback helpers
function readData() {
  try {
    if (!fs.existsSync(dbFilePath)) {
      const initialData = { users: [], movies: [], settings: {} };
      fs.writeFileSync(dbFilePath, JSON.stringify(initialData, null, 2), "utf8");
      return initialData;
    }
    const content = fs.readFileSync(dbFilePath, "utf8");
    return JSON.parse(content || '{"users":[],"movies":[],"settings":{}}');
  } catch (err) {
    console.error("Error reading fallback DB:", err.message);
    return { users: [], movies: [], settings: {} };
  }
}

function writeData(data) {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing fallback DB:", err.message);
  }
}

// Connect function
async function connectDB() {
  if (config.mongoUri && config.mongoUri !== "memory" && config.mongoUri !== "none") {
    try {
      // 2.5 second timeout for quick fallback if local mongod is not running
      await mongoose.connect(config.mongoUri, {
        serverSelectionTimeoutMS: 2500,
        connectTimeoutMS: 2500
      });
      dbType = "mongodb";
      console.log(`[Database] Successfully connected to MongoDB: ${mongoose.connection.host}`);
      return { type: "mongodb" };
    } catch (err) {
      console.warn(`[Database] MongoDB not reachable (${err.message}). Activating persistent JSON file database at: data/streamflix.json`);
    }
  }

  dbType = "json";
  console.log(`[Database] Using persistent JSON file database (data/streamflix.json)`);
  return { type: "json" };
}

function getDbType() {
  return dbType;
}

module.exports = {
  connectDB,
  getDbType,
  readData,
  writeData,
  dbFilePath
};
