// middleware/authMiddleware.js
// ==========================================
// 1. DEPENDENCIES
// ==========================================
const jwt = require("jsonwebtoken");

// ==========================================
// 2. AUTH MIDDLEWARE FUNCTION
// ==========================================
const protect = (req, res, next) => {
  try {
    // --- A. Extract Token ---
    // Looks for "Bearer [token]" in the headers and grabs just the token part
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    // --- B. Verify & Decode ---
    // Checks if the token is real and hasn't expired using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // --- C. Pass Data Forward ---
    // Attaches the user's ID to the request so the next function knows exactly who is logged in
    req.user = { id: decoded.id }; 
    
    // Move on to the actual controller route (like updateProfile or createTask)
    next();

  } catch (error) {
    // --- D. Error Handling ---
    // If the token is fake, tampered with, or expired, reject the request
    res.status(401).json({ message: "Not authorized, token failed or expired" });
  }
};

// ==========================================
// 3. EXPORTS
// ==========================================
module.exports = { protect };