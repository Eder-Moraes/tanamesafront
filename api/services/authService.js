import api from '../axiosconfig'
import endpoints from "../endpoints";

export const login = async (credentials) => {
    const response = await api.post(endpoints.login, credentials);
    return response.data;
}

export const register = async (user) => {
    const response = await api.post(endpoints.register, user);
    return response.data;
}

export const requestRecuperacao = async (email) => {
    const response = await api.post(endpoints.requestRecuperacao, JSON.stringify({email: email}));
    return response.data;
}