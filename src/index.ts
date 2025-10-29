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

// Health
app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true, service: "artistike-api", ts: Date.now() });
});

// Rutas
app.use("/auth", authRouter);

// Mongo + start
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI!;
mongoose.connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`API running on :${PORT}`));
  })
  .catch(err => {
    console.error("Mongo connection error:", err);
    process.exit(1);
  });

export default app;