const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();

// Conectar a MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(cookieParser());

// Rutas
app.use('/api/auth', authRoutes);

// Endpoint de salud
app.get("/health", (_req, res) => res.status(200).send("ok"));

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({
        message: 'Artistike API funcionando!',
        version: '2.0.0',
        endpoints: [
            'GET /health',
            'POST /api/auth/register',
            'POST /api/auth/login', 
            'POST /api/auth/logout',
            'GET /api/auth/me'
        ]
    });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});

module.exports = app;