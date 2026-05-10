const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { validateEmail, validatePassword, validatePhone } = require("../utils/validation");
 

const router = express.Router();

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  if (!email || !password || !name || !phone) {
    return res.status(400).json({ message: "Name, Email, Password and Phone are required" });
  }

  // VALIDATION CHECKS
  const emailCheck = validateEmail(email);
  if (!emailCheck.valid) {
    return res.status(400).json({ message: emailCheck.message });
  }

  const passwordCheck = validatePassword(password);
  if (!passwordCheck.valid) {
    return res.status(400).json({ message: passwordCheck.message });
  }

  const phoneCheck = validatePhone(phone);
  if (!phoneCheck.valid) {
    return res.status(400).json({ message: phoneCheck.message });
  }

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      role: role || "candidate"
    });

    await newUser.save();
    console.log(`NEW USER REGISTERED: ${email} as ${role}`);

    res.status(201).json({ message: "Registration successful! Please login." });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Registration failed due to server error" });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and Password are required" });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.log(`LOGIN FAILED: User not found - ${email}`);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`LOGIN FAILED: Wrong password - ${email}`);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log(`LOGIN SUCCESS: ${email} (${user.role})`);

    res.json({ 
      token, 
      role: user.role, 
      message: "Login successful" 
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Login failed due to server error" });
  }
});

/* ================= GET CURRENT USER ================= */
const authMiddleware = require("../middleware/authMiddleware");
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= FORGOT PASSWORD (MOCK) ================= */
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User with this email does not exist" });
    }
    // In a real app, you'd send an email with a token here.
    // For now, we'll just return a success message.
    res.json({ message: "Password reset instructions sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= RESET PASSWORD (MOCK) ================= */
router.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successful! You can now login." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

