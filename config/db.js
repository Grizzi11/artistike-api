const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Si no hay URI de MongoDB, continuar sin DB
        if (!process.env.MONGO_URI) {
            console.log('⚠️ No MONGO_URI found, continuando sin base de datos...');
            return;
        }

        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error.message);
        // No terminar el proceso, permitir que funcione sin DB para testing
        console.log('⚠️ Continuando sin base de datos para pruebas...');
    }
};

module.exports = connectDB;