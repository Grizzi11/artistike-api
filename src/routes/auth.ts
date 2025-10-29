import { Router } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { signJWT } from "../utils/jwt";
import { requireAuth } from "../middleware/auth";

const router = Router();

// POST /auth/register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, role } = req.body || {};
    if (!username || !email || !password)
      return res.status(400).json({ error: "username, email and password are required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: "Email already registered" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hash,
      role: role === "artist" ? "artist" : "fan"
    });

    const token = signJWT({ id: user._id, email: user.email, role: user.role });
    return res.status(201).json({
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role, isPremium: user.isPremium }
    });
  } catch (e: any) {
    return res.status(500).json({ error: "Register failed", detail: e?.message });
  }
});

// POST /auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = signJWT({ id: user._id, email: user.email, role: user.role });
    return res.status(200).json({
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role, isPremium: user.isPremium }
    });
  } catch (e: any) {
    return res.status(500).json({ error: "Login failed", detail: e?.message });
  }
});

// GET /auth/me
router.get("/me", requireAuth, async (req, res) => {
  const userId = (req as any).user?.id;
  const user = await User.findById(userId).lean();
  if (!user) return res.status(404).json({ error: "User not found" });
  return res.json({
    id: user._id, username: user.username, email: user.email,
    role: user.role, isPremium: user.isPremium, avatarUrl: user.avatarUrl
  });
});

export default router;