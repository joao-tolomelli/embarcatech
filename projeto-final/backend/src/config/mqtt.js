const mqtt = require('mqtt');
require('dotenv').config();

const mqttOptions = {
    host: process.env.MQTT_HOST || 'localhost',
    port: 1883,
    protocol: 'mqtt'
};

// Cria o cliente, mas a lógica de conexão fica no service
const client = mqtt.connect(mqttOptions);

module.exports = client;