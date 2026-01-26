const mqtt = require('mqtt');
require('dotenv').config();


const mqttUrl = process.env.MQTT_HOST || 'mqtt://localhost:1883';

console.log(`🔌 Tentando conectar ao Broker em: ${mqttUrl}`);

const client = mqtt.connect(mqttUrl, {
    reconnectPeriod: 1000, 
    connectTimeout: 30 * 1000,
});

module.exports = client;