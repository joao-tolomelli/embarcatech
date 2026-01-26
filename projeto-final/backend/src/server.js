// src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sensorRoutes = require('./routes/sensorRoutes');
const { startMqttListener } = require('./services/mqttListener');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors()); // Permite que o React acesse este backend
app.use(express.json());

// Rotas
app.use('/api', sensorRoutes);

// Inicia o serviço de escuta do MQTT (Background)
startMqttListener();

// Inicia o servidor HTTP
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});