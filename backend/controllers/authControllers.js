const User = require("../models/user");
const Task = require("../models/Task");
const OTP = require("../models/OTP");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

// @desc    Register new user
// @route   POST /api/auth/register
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Check if the user already exists in the main database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // 2. Generate a 6-digit random OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Save the OTP to the database (it will auto-delete in 5 minutes)
    await OTP.create({ email, otp });

    // 4. Send the email
    const message = `Welcome to Task Manager! \n\nYour email verification code is: ${otp} \n\nThis code will expire in 5 minutes.`;
    
    await sendEmail({
      email,
      subject: "Your Registration OTP",
      message,
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP Error:", error);
    res.status(500).json({ message: "Error sending OTP" });
  }
};
exports.register = async (req, res) => {
  try {
    // Now we also expect the OTP from the frontend!
    const { name, email, password, otp } = req.body;

    // 1. Find the most recent OTP for this email
    const otpRecord = await OTP.findOne({ email }).sort({ createdAt: -1 });

    // 2. Check if OTP exists and matches
    if (!otpRecord) {
      return res.status(400).json({ message: "OTP has expired or wasn't requested. Please try again." });
    }
    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // 3. If OTP is correct, hash password and create the user!
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    // 4. Clean up: Delete the OTP so it can't be used again
    await OTP.deleteOne({ _id: otpRecord._id });

    // 5. Optionally, generate a token immediately so they log in automatically
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(201).json({ user, token, message: "Registration successful!" });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};
// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ msg: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.json({ token });
};

// @desc    Forgot Password
// @route   POST /api/auth/forgotpassword
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(200).json({ message: "If an account exists, an email was sent." });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const message = `You are receiving this email because you (or someone else) has requested a password reset. \n\nPlease click this link to reset your password: \n\n${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Token",
        message,
      });

      res.status(200).json({ message: "Email sent successfully" });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return res.status(500).json({ message: "Email could not be sent" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword/:token
exports.resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: "Server Error" });
  }
};
// @desc    Get current user profile data
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    // req.user.id comes from your 'protect' middleware!
    // .select("-password") ensures we don't accidentally send the hashed password back
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Get User Error:", error);
    res.status(500).json({ message: "Server error fetching user data." });
  }
};
// @desc    Send OTP for changing email address
// @route   POST /api/auth/send-profile-otp
// @desc    Send OTP to existing email for an email change request
// @route   POST /api/auth/send-profile-otp
exports.sendProfileOtp = async (req, res) => {
  try {
    const { newEmail } = req.body;
    
    // 1. Get the currently logged-in user
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Make sure the new email isn't already taken by someone else
    const emailExists = await User.findOne({ email: newEmail });
    if (emailExists) {
      return res.status(400).json({ message: "The requested email is already in use by another account." });
    }

    // 3. Generate the OTP and save it securely against the user's CURRENT email
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.create({ email: user.email, otp });

    // 4. Send the email to the CURRENT email address
    const message = `Security Alert: You requested to change your Task Manager account email to ${newEmail}. \n\nTo authorize this change, please use the following verification code: ${otp} \n\nThis code will expire in 5 minutes. If you did not request this, please ignore this email.`;
    
    await sendEmail({
      email: user.email, // SEND TO OLD EMAIL
      subject: "Security: Verify Email Change",
      message,
    });

    res.status(200).json({ message: "OTP sent to your CURRENT email successfully" });
  } catch (error) {
    console.error("Send Profile OTP Error:", error);
    res.status(500).json({ message: "Error sending OTP" });
  }
};

// @desc    Update user profile (Verifies OTP from existing email)
// @route   PUT /api/auth/profile
// @desc    Update user profile (Name, Image, and Email with OTP)
// @route   PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    console.log("--- INCOMING UPLOAD DATA ---");
    console.log("Text Data:", req.body);
    console.log("Image File:", req.file);
    console.log("----------------------------");
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, newEmail, otp, removeImage } = req.body;

    // --- 1. HANDLE EMAIL CHANGE (WITH OTP) ---
    if (newEmail && newEmail !== user.email) {
      if (!otp) return res.status(400).json({ message: "OTP is required to change your email." });

      const otpRecord = await OTP.findOne({ email: user.email }).sort({ createdAt: -1 });
      if (!otpRecord || otpRecord.otp !== otp) {
        return res.status(400).json({ message: "Invalid or expired OTP. Please try again." });
      }

      await OTP.deleteOne({ _id: otpRecord._id });
      user.email = newEmail; 
    }

    // --- 2. HANDLE PROFILE PICTURE ---
    // Note: FormData sends boolean values as strings ("true" or "false")
    if (removeImage === "true") {
      user.profileImage = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
    }

    // If Cloudinary caught and processed a new image file, save the URL
    if (req.file) {
      user.profileImage = req.file.path; 
    }

    // --- 3. HANDLE NAME ---
    user.name = name || user.name;

    // Save everything!
    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: { 
        id: updatedUser._id, 
        name: updatedUser.name, 
        email: updatedUser.email,
        profileImage: updatedUser.profileImage // <-- Don't forget to send this back!
      }
    });
  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ message: "Server Error updating profile." });
  }
};
// @desc    Update user profile
// @route   PUT /api/auth/profile
// @desc    Update user profile (Name & Email with OTP)
// @route   PUT /api/auth/profile
// @desc    Send OTP to existing email for an email change request
// @route   POST /api/auth/send-profile-otp
exports.sendProfileOtp = async (req, res) => {
  try {
    const { newEmail } = req.body;
    
    // 1. Get the currently logged-in user
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Make sure the new email isn't already taken by someone else
    const emailExists = await User.findOne({ email: newEmail });
    if (emailExists) {
      return res.status(400).json({ message: "The requested email is already in use by another account." });
    }

    // 3. Generate the OTP and save it securely against the user's CURRENT email
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.create({ email: user.email, otp });

    // 4. Send the email to the CURRENT email address
    const message = `Security Alert: You requested to change your Task Manager account email to ${newEmail}. \n\nTo authorize this change, please use the following verification code: ${otp} \n\nThis code will expire in 5 minutes. If you did not request this, please ignore this email.`;
    
    await sendEmail({
      email: user.email, // SEND TO OLD EMAIL
      subject: "Security: Verify Email Change",
      message,
    });

    res.status(200).json({ message: "OTP sent to your CURRENT email successfully" });
  } catch (error) {
    console.error("Send Profile OTP Error:", error);
    res.status(500).json({ message: "Error sending OTP" });
  }
};

// @desc    Update user profile (Verifies OTP from existing email)
// @route   PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    // 1. Get user from DB
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Destructure data from req.body
    // NOTE: Multi-part form data (files) might make everything in req.body a string
    const { name, newEmail, otp, removeImage } = req.body;

    // --- LOGIC: CHANGE EMAIL WITH OTP ---
    if (newEmail && newEmail !== user.email) {
      if (!otp) return res.status(400).json({ message: "OTP is required to change your email." });

      const otpRecord = await OTP.findOne({ email: user.email }).sort({ createdAt: -1 });
      if (!otpRecord || otpRecord.otp !== otp) {
        return res.status(400).json({ message: "Invalid or expired OTP. Please try again." });
      }

      await OTP.deleteOne({ _id: otpRecord._id });
      user.email = newEmail; 
    }

    // --- LOGIC: PROFILE PICTURE ---
    if (removeImage === "true") {
      // Reset to default if user clicked "Remove"
      user.profileImage = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
    }

    if (req.file) {
      // If a new file was uploaded to Cloudinary, save its URL
      user.profileImage = req.file.path;
    }

    // --- LOGIC: NAME ---
    if (name) user.name = name;

    // 3. Save to MongoDB
    const updatedUser = await user.save();

    // 4. Send back the UPDATED data (including profileImage)
    res.status(200).json({
      message: "Profile updated successfully",
      user: { 
        id: updatedUser._id, 
        name: updatedUser.name, 
        email: updatedUser.email,
        profileImage: updatedUser.profileImage // CRITICAL: This sends the new URL back to frontend
      }
    });
  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ message: "Server Error updating profile." });
  }
};
// @desc    Delete user account permanently
// @route   DELETE /api/auth/profile
exports.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 1. Verify the password is correct before deleting!
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password. Deletion failed." });
    }

    // 2. Clean up the database: Delete all tasks created by this user
    await Task.deleteMany({ user: user._id });

    // 3. Delete the user's account
    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({ message: "Account and all associated data permanently deleted." });
  } catch (error) {
    console.error("Delete Account Error:", error);
    res.status(500).json({ message: "Server error deleting account." });
  }
};