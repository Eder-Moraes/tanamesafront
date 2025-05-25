import api from '../axiosconfig'
import endpoints from "../endpoints";

export const getUserById = async (id) => {
    const response = await api.get(endpoints.users+`/${id}`);
    return response.data;
}