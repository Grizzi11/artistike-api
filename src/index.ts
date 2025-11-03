import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js"; // 👈 asegúrate de que la ruta existe

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas principales
app.get("/", (_req, res) => {
  res.status(200).json({ 
    message: "Artistike API is running! [FULL VERSION WITH AUTH]", 
    version: "2.0.0",
    endpoints: ["/health", "/auth/register", "/auth/login", "/auth/me"],
    timestamp: new Date().toISOString()
  });
});

// Endpoint /health
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK", uptime: process.uptime() });
});

// Importa tus rutas (si las tienes en archivos separados)
app.use("/auth", authRoutes);

// Inicia el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
