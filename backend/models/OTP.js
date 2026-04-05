// ==========================================
// 1. DEPENDENCIES
// ==========================================
const mongoose = require("mongoose");

// ==========================================
// 2. OTP SCHEMA DEFINITION
// ==========================================
const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // Magic trick: MongoDB will automatically delete this document after 300 seconds (5 minutes)!
  },
});

// ==========================================
// 3. EXPORTS
// ==========================================
module.exports = mongoose.model("OTP", otpSchema);