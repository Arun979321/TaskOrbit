const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const connectDB = require("./config/db");
connectDB(); 

const app = express();

app.set("trust proxy", 1); 

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
})); 
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173", 
  "http://127.0.0.1:5173", 
  "https://task-orbit-ten.vercel.app"

];

app.use(cors({
  origin: (origin, callback) => {
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

const isDev = process.env.NODE_ENV !== "production";

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

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

app.use("/api/auth", authLimiter, require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

app.get("/", (req, res) => {
  res.send("API is running locally...");
});

app.use((err, req, res, next) => {
  res.status(500).json({
    message: "Something went wrong on the server!",
    error: isDev ? err.message : {} 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});