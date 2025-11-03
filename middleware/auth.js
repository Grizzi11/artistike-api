const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para proteger rutas
const protect = async (req, res, next) => {
    try {
        let token;

        // Obtener token de la cookie
        if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }

        // Verificar si existe el token
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No autorizado, no hay token'
            });
        }

        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Obtener usuario del token
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'No autorizado, usuario no encontrado'
            });
        }

        // Verificar si el usuario está activo
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Usuario desactivado'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Error en middleware auth:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token inválido'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expirado'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
};

// Función para generar JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// Función para establecer cookie JWT
const sendTokenResponse = (user, statusCode, res) => {
    // Crear token
    const token = generateToken(user._id);

    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    };

    res.status(statusCode)
       .cookie('jwt', token, options)
       .json({
           success: true,
           user: user.getPublicProfile()
       });
};

module.exports = {
    protect,
    generateToken,
    sendTokenResponse
};