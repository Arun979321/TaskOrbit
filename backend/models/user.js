// ==========================================
// 1. DEPENDENCIES
// ==========================================
const mongoose = require("mongoose");

// ==========================================
// 2. USER SCHEMA DEFINITION
// ==========================================
const userSchema = new mongoose.Schema(
  {
    // --- A. Core Profile ---
    name: { 
      type: String, 
      required: [true, "Please provide a name"],
      trim: true
    },
    email: { 
      type: String, 
      required: [true, "Please provide an email"],
      unique: true,
      trim: true,       // Removes accidental spaces (e.g., " email@gmail.com ")
      lowercase: true,  // Forces email to lowercase so logins are case-insensitive
      match: [
        /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com)$/i,
        "Please register with a valid provider (Gmail, Yahoo, Outlook, or Hotmail)."
      ]
    },

    // --- B. Authentication ---
    password: { 
      type: String, 
      required: [true, "Please provide a password"]
    }, 
    profileImage: { 
    type: String, 
    default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" 
    },
    // --- C. Password Reset Flow ---
    resetPasswordToken: {
      type: String,
      default: undefined
    },
    resetPasswordExpire: {
      type: Date,
      default: undefined
    }
  }, 
  { 
    // Automatically generates 'createdAt' and 'updatedAt' timestamps
    timestamps: true 
  }
);

// ==========================================
// 3. EXPORTS
// ==========================================
module.exports = mongoose.model("User", userSchema);