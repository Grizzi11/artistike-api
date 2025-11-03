const express = require('express');
const User = require('../models/User');
const { protect, sendTokenResponse } = require('../middleware/auth');

const router = express.Router();

// @desc    Registrar usuario
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { name, username, email, password, accountType } = req.body;

        // Usar name o username (para compatibilidad)
        const userName = name || username;

        // Validar campos requeridos
        if (!userName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Por favor complete todos los campos (name/username, email, password)'
            });
        }

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'El usuario ya existe con este email'
            });
        }

        // Crear usuario
        const user = await User.create({
            name: userName,
            email,
            password,
            accountType: accountType || 'fan'
        });

        // Responder con token
        sendTokenResponse(user, 201, res);

    } catch (error) {
        console.error('Error en registro:', error);
        
        if (error.name === 'ValidationError') {
            const message = Object.values(error.errors).map(val => val.message).join(', ');
            return res.status(400).json({
                success: false,
                message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// @desc    Iniciar sesión
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar email y password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Por favor ingrese email y contraseña'
            });
        }

        // Buscar usuario e incluir password
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Verificar contraseña
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Verificar si el usuario está activo
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Cuenta desactivada'
            });
        }

        sendTokenResponse(user, 200, res);

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// @desc    Cerrar sesión
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', (req, res) => {
    res.cookie('jwt', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: 'Sesión cerrada exitosamente'
    });
});

// @desc    Obtener usuario actual
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            user: req.user.getPublicProfile()
        });
    } catch (error) {
        console.error('Error obteniendo perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

module.exports = router;