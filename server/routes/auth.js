const express = require("express");
const User = require("../models/User");
const authorize = require("../middleware/authorize");

const router = express.Router();

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", 
  maxAge: 24 * 60 * 60 * 1000,
  domain: process.env.NODE_ENV === "production" ? process.env.COOKIE_DOMAIN : undefined
};

router.post("/register", async (req, res) => {
  const { firstName, lastName, nickname, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const user = new User({
      firstName,
      lastName,
      nickname,
      email,
      password,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(403).json({ error: "Account locked. Try again later." });
    }

    try {
      await user.comparePassword(password);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    res.cookie("user", user._id.toString(), COOKIE_OPTIONS);
    console.log(user)
    res.status(200).json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        nickname: user.nickname,
        email: user.email,
        avatar: user.avatar,
        friendRequests:user.friendRequests,
        friends:user.friends
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/logout", (req, res) => {
  const { maxAge, ...clearOptions } = COOKIE_OPTIONS;
  
  res.clearCookie("user", clearOptions);
  console.log("User logged out");
  res.status(200).json({ message: "Logout successful" });
});

router.get("/me", authorize, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.status(200).json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        nickname: user.nickname,
        email: user.email,
        avatar: user.avatar,
        friendRequests: user.friendRequests,
        friends: user.friends
      }
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
