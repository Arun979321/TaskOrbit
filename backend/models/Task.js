// ==========================================
// 1. DEPENDENCIES
// ==========================================
const mongoose = require("mongoose");

// ==========================================
// 2. TASK SCHEMA DEFINITION
// ==========================================
const TaskSchema = new mongoose.Schema(
  {
    // --- A. Core Information ---
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    completed: {
      type: Boolean,
      default: false,
    },

    // --- B. Scheduling ---
    dueDate: {
      type: String, // Stored as YYYY-MM-DD string for easy frontend formatting
      default: "",
    },
    duration: {
      type: String,
      default: "",
    },

    // --- C. Categorization & Metadata ---
    priority: {
      type: String,
      default: "Priority", // e.g., "High", "Low", "Urgent"
    },
    group: {
      type: String,
      default: "No group", // e.g., "Work", "Personal"
    },

    // --- D. Subtasks Array ---
    subtasks: [
      {
        title: String,
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // --- E. Database Relations ---
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Ensures an orphaned task can never be created
    },
  },
  { 
    // Automatically generates 'createdAt' and 'updatedAt' fields
    timestamps: true 
  }
);

// ==========================================
// 3. EXPORTS
// ==========================================
module.exports = mongoose.model("Task", TaskSchema);