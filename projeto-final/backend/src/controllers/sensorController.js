// src/controllers/sensorController.js
const sensorService = require('../services/sensorService');

async function getLatest(req, res) {
    try {
        const data = await sensorService.getLastReading();
        res.json(data || {});
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar última leitura' });
    }
}

async function getHistory(req, res) {
    try {
        const data = await sensorService.getHistory();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar histórico' });
    }
}

async function getLogs(req, res) {
    try {
        const data = await sensorService.getLogs();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar logs' });
    }
}

module.exports = { getLatest, getHistory, getLogs };