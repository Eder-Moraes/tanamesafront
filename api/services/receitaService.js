import api from '../axiosconfig'
import endpoints from "../endpoints";

export const salvarReceita = async (receitaFormData) => {
    const response = await api.post(endpoints.receitas, receitaFormData, {
        headers: {
            'Content-Type':'multipart/form-data'
        }
    });
    return response.data;
}

export const getReceitaById = async (id) => {
    const response = await api.get(endpoints.receitas+`/receita/${id}`);
    return response.data;
}