import api from '../axiosconfig'
import endpoints from "../endpoints";

export const register = async (avaliacao) => {
    const response = await api.post(endpoints.avaliacoes, avaliacao);
    return response.data;
}

export const getAvaliacaoByReceita = async (receitaId) => {
    const response = await api.get(endpoints.avaliacoes+`/receita/${receitaId}`, receitaId);
    return response.data;
}