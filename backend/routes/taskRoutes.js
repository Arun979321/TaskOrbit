// ==========================================
// 1. DEPENDENCIES
// ==========================================
const express = require("express");
const router = express.Router();

// ==========================================
// 2. CONTROLLERS & MIDDLEWARE
// ==========================================
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} = require("../controllers/taskControllers");

const { protect } = require("../middleware/authMiddleware");

// ==========================================
// 3. ROUTES
// ==========================================

// --- Global Middleware ---
// Secures all routes in this file. A user MUST provide a valid token to proceed.
router.use(protect); 

// --- Task CRUD Operations ---
router.post("/", createTask);
router.get("/", getTasks);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

// ==========================================
// 4. EXPORTS
// ==========================================
module.exports = router;