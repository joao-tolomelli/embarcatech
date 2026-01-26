import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

export const getLeituraAtual = async () => {
    try {
        const response = await api.get('/leitura-atual');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar leitura atual:", error);
        return null;
    }
};

export const getHistorico = async () => {
    try {
        const response = await api.get('/historico');
        return response.data; 
    } catch (error) {
        console.error("Erro ao buscar histórico:", error);
        return [];
    }
};

export const getLogs = async () => {
    try {
        const response = await api.get('/logs');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar logs:", error);
        return [];
    }
};