import api from '../axiosconfig'
import endpoints from "../endpoints";

export const getUserById = async (id) => {
    const response = await api.get(endpoints.users+`/${id}`);
    return response.data;
}

export const editarUsuario = async (users) => {
    const response = await api.put(endpoints.users);
    return response.data;
}