import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import authRouter from "./routes/auth";

const app = express();

// CORS
const parseOrigins = (s?: string) =>
  (s || "").split(",").map(x => x.trim()).filter(Boolean);
const allowedOrigins = parseOrigins(process.env.CORS_ORIGIN).concat(["http://localhost:3000"]);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS: " + origin));
  },
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}));

app.use(helmet());
app.use(morgan("tiny"));
app.use(express.json());

// Root endpoint
app.get("/mongodb://localhost:27017/artistike", (_req, res) => {
  res.status(200).json({ 
    message: "Artistike API is running! [FULL VERSION WITH AUTH]", 
    version: "2.0.0",
    endpoints: ["/health", "/auth/register", "/auth/login", "/auth/me"],
    timestamp: new Date().toISOString()
  });
});

// Health
app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true, service: "artistike-api", ts: Date.now() });
});

// Rutas
app.use("/auth", authRouter);

// Mongo + start
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/artistike';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 API running on port ${PORT}`));
  })
  .catch(err => {
    console.error("⚠️  MongoDB connection failed:", err.message);
    console.log("ℹ️  Starting server without database for testing...");
    app.listen(PORT, () => console.log(`🚀 API running on port ${PORT} (no DB)`));
  });

export default app;