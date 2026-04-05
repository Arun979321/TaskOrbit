// ==========================================
// 1. DEPENDENCIES
// ==========================================

const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
// ==========================================
// 2. CONTROLLERS & MIDDLEWARE
// ==========================================
const { 
  sendOtp,
  register, 
  login, 
  forgotPassword, 
  resetPassword, 
  getMe,
  updateProfile, 
  deleteAccount,
  sendProfileOtp
} = require("../controllers/authControllers");

const { protect } = require("../middleware/authMiddleware"); 

// ==========================================
// 3. ROUTES
// ==========================================

// --- Public Routes ---
router.post("/send-otp", sendOtp);
router.post("/register", register);
router.post("/login", login);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:token", resetPassword);

// --- Protected Routes ---
router.get("/me", protect, getMe);
router.post("/send-profile-otp", protect, sendProfileOtp);
router.delete("/profile", protect, deleteAccount);

router.put("/profile", protect, upload.single("profileImage"), updateProfile);

module.exports = router;