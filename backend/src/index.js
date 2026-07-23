// ===============================
// HARD-LOAD .env (bypasses injectors)
// ===============================
import fs from "fs";
import path from "path";
import url from "url";

// Resolve backend/.env path
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env");

// Read .env manually
const rawEnv = fs.readFileSync(envPath, "utf-8");

// Parse .env lines
rawEnv.split("\n").forEach(line => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return;

  const [key, ...rest] = trimmed.split("=");
  const value = rest.join("=").trim();

  if (key && value) {
    process.env[key] = value;
  }
});

// Debug print
console.log("DEBUG MONGO_URI:", process.env.MONGO_URI);

// ===============================
// NORMAL BACKEND CODE
// ===============================
import express from "express";
import cors from "cors";
import connectDB from "./db/mongo.js";
import searchRoutes from "./routes/search.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/search", searchRoutes);

// Connect to MongoDB
connectDB();

// Start server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
