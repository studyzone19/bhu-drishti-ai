import jwt from "jsonwebtoken";
import User from "../models/User.js";

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

export async function register(req, res, next) {
  try {
    const { name, email, password, role, phone, location } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email and password are required." });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: "An account with this email already exists." });
    }
    const allowedRoles = ["admin", "field_officer", "citizen"];
    const user = await User.create({
      name,
      email,
      password,
      phone,
      location,
      role: allowedRoles.includes(role) ? role : "citizen",
    });
    const token = signToken(user);
    res.status(201).json({ success: true, token, user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    let cleanEmail = String(email).trim().toLowerCase();
    const cleanPassword = String(password).trim();

    // Map common aliases
    const aliasMap = {
      admin: "admin@bhu-drishti.ai",
      "admin@landguard.ai": "admin@bhu-drishti.ai",
      officer: "officer@bhu-drishti.ai",
      "officer@landguard.ai": "officer@bhu-drishti.ai",
      citizen: "citizen@bhu-drishti.ai",
      "citizen@landguard.ai": "citizen@bhu-drishti.ai",
    };

    if (aliasMap[cleanEmail]) {
      cleanEmail = aliasMap[cleanEmail];
    }

    let user = await User.findOne({ email: cleanEmail }).select("+password");
    if (!user) {
      // Fallback: search by regex in case of slight domain differences or casing
      user = await User.findOne({
        email: new RegExp("^" + cleanEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$", "i"),
      }).select("+password");
    }

    if (!user || !(await user.comparePassword(cleanPassword))) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }
    const token = signToken(user);
    res.json({ success: true, token, user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req, res, next) {
  try {
    res.json({ success: true, user: req.user.toSafeObject() });
  } catch (err) {
    next(err);
  }
}
