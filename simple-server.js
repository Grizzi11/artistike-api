const express = require('express');
const cors = require('cors');

const app = express();

// Middleware básico
app.use(cors());
app.use(express.json());

// Endpoint de salud
app.get("/health", (req, res) => {
    console.log("Health endpoint called");
    res.status(200).send("ok");
});

// Ruta de prueba
app.get('/', (req, res) => {
    console.log("Root endpoint called");
    res.json({
        message: 'Artistike API funcionando!',
        version: '2.0.0',
        status: 'OK'
    });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📍 Disponible en http://localhost:${PORT}`);
    console.log(`🔍 Health check: http://localhost:${PORT}/health`);
});

// Manejo de errores
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});