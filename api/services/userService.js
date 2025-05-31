import api from '../axiosconfig'
import endpoints from "../endpoints";

export const getUserById = async (id) => {
    const response = await api.get(endpoints.users+`/${id}`);
    return response.data;
}

export const editarUsuario = async (userUpdateDTO) => {
    const response = await api.put(endpoints.users, userUpdateDTO);
    return response.data;
}

export const updateImagePerfil = async (form) => {
    const response = await api.post(endpoints.users+'/uploadPerfilImage', form, {
        headers: {
            'Content-Type': "multipart/form-data",
        }
    });
    return response.data;
}