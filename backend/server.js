const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const connectDB = require("./config/db");
connectDB(); 

const app = express();

// Required when operating behind reverse proxies / local dev limits
app.set("trust proxy", 1); 

// 1. Dynamic Helmet configuration to ensure headers don't drop traffic
const isDev = process.env.NODE_ENV !== "production";
if (!isDev) {
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }));
} else {
  // Relaxed helmet policy for seamless local multi-port routing
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false
  }));
}

app.use(express.json());

// 👉 UPDATED: Added your Railway frontend URL to the allowed origins
const allowedOrigins = [
  "http://localhost:5176",
  "http://127.0.0.1:5176",
  "http://localhost:5173", 
  "http://127.0.0.1:5173", 
  "https://taskorbit-production.up.railway.app"
];

// 2. Comprehensive CORS Management Middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin) || (origin && origin.endsWith(".vercel.app"))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  // CRITICAL: Immediately terminate preflight requests with a clean status code
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

// 3. Request Throttle/Limit Parameters
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: isDev ? 1000 : 100, 
  message: "Too many requests, please try again later."
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 100 : 20, 
  message: "Too many login attempts, please try again after 15 minutes."
});

app.use(globalLimiter);

// 4. API Endpoint Indexing
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

app.use("/api/auth", authLimiter, require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

app.get("/", (req, res) => {
  res.send("API is running...");
});

// 5. Global Exception Fallback Pipeline
app.use((err, req, res, next) => {
  console.error("Caught Exception:", err);
  res.status(500).json({
    message: "Something went wrong on the server!",
    error: isDev ? err.message : {} 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
