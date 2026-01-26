// src/routes/sensorRoutes.js
const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');

router.get('/leitura-atual', sensorController.getLatest);
router.get('/historico', sensorController.getHistory);
router.get('/logs', sensorController.getLogs);

module.exports = router;