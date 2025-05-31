import api from '../axiosconfig'
import endpoints from "../endpoints";

export const verificaFavorito = async (userId, receitaId) => {
    const response = await api.get(endpoints.favoritos+`/verifica?userId=${userId}&receitaId=${receitaId}`);
    return response.data;
}

export const adicionarFavorito = async (userId, receitaId) => {
    const response = await api.post(endpoints.favoritos+`/adicionar?userId=${userId}&receitaId=${receitaId}`);
    return response.data;
}

export const removerFavorito = async (userId, receitaId) => {
    const response = await api.delete(endpoints.favoritos+`/remover?userId=${userId}&receitaId=${receitaId}`);
    return response.data;
}