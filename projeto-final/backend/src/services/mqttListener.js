// src/services/mqttListener.js
const client = require('../config/mqtt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function startMqttListener() {
    client.on('connect', () => {
        console.log('✅ Conectado ao Broker MQTT');
        client.subscribe('pico/dados', (err) => {
            if (!err) console.log('📡 Inscrito no tópico: pico/dados');
        });
    });

    client.on('message', async (topic, message) => {
        try {
            const payload = JSON.parse(message.toString());
            console.log('📥 Recebido:', payload);

            // 1. Converter os dados do firmware para o formato do Banco
            // Firmware: "caixa": "aberta", "colisao": "SIM"
            const caixaAberta = payload.caixa === "aberta";
            const houveColisao = payload.colisao === "SIM";

            // 2. Salvar no PostgreSQL usando Prisma
            await prisma.leitura.create({
                data: {
                    temperatura: parseFloat(payload.temperatura),
                    umidade: parseFloat(payload.umidade),
                    caixaAberta: caixaAberta,
                    colisao: houveColisao
                }
            });
            console.log('💾 Salvo no banco com sucesso!');

        } catch (error) {
            console.error('❌ Erro ao processar mensagem:', error);
        }
    });
}

module.exports = { startMqttListener };