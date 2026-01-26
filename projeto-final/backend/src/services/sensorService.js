// src/services/sensorService.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Pega apenas a última leitura (para os Cards de Status)
async function getLastReading() {
    return await prisma.leitura.findFirst({
        orderBy: { createdAt: 'desc' }
    });
}

// Pega o histórico para o Gráfico (últimos 50 pontos)
async function getHistory() {
    const readings = await prisma.leitura.findMany({
        take: 50,
        orderBy: { createdAt: 'desc' }
    });
    // Invertemos o array para o gráfico plotar da esquerda (antigo) para a direita (novo)
    return readings.reverse();
}

// Pega os logs formatados para o componente de Lista
async function getLogs() {
    const logs = await prisma.leitura.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' }
    });

    // Formata para o padrão visual do Front-end
    return logs.map(log => {
        let type = 'info';
        let message = 'Verificação de Status: OK';

        if (log.colisao) {
            type = 'alert';
            message = '**ALERTA**: Impacto Detectado!';
        } else if (log.caixaAberta) {
            type = 'warning';
            message = 'Aviso: Violação de embalagem detectada';
        }

        return {
            id: log.id,
            time: log.createdAt.toLocaleTimeString('pt-BR'), // Formata a hora
            message: message,
            type: type
        };
    });
}

module.exports = { getLastReading, getHistory, getLogs };