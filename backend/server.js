const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const connectDB = require("./config/db");
connectDB(); 

const app = express();

// 1. SECURITY & PARSING ---
app.use(helmet()); 
app.use(express.json());

// 2. DYNAMIC CORS ---
// This allows local testing AND your future deployed frontend
const allowedOrigins = [
  "http://localhost:5173", 
  "https://task-orbit-arundq52.vercel.app",
  "https://task-orbit-dq52-git-main-arun979321s-projects.vercel.app" 
];

app.use(cors({
  origin: (origin, callback) => {
    // 1. Allow local development
    // 2. Allow your specific production domains
    // 3. Allow ANY vercel.app subdomain belonging to your project
    if (!origin || 
        allowedOrigins.includes(origin) || 
        origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }
    return callback(new Error("CORS policy blocked this origin"), false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 3. RATE LIMITING ---
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests, please try again later."
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, 
  message: "Too many login attempts, please try again after 15 minutes."
});

// Apply global limit to everything, auth limit only to auth routes
app.use(globalLimiter);

// 4. ROUTES ---
// Health Check for Render (This is very important for deployment)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

app.use("/api/auth", authLimiter, require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

app.get("/", (req, res) => {
  res.send("API is secured and running...");
});

// 5. GLOBAL ERROR HANDLER ---
// This prevents the server from crashing if an error occurs in a route
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong on the server!",
    error: process.env.NODE_ENV === "production" ? {} : err.message
  });
});

// 6. SERVER START ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});