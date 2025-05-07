import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Platform } from "react-native";
import checkUserAccess from "../utils/checkUserAccess";

const baseURL = 'http://10.50.63.60:8080';

const api = axios.create({
    baseURL: baseURL, // Substitua pela URL base da sua API
    timeout: 30000, // Tempo limite da requisição em ms
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptores de requisição (opcional)
api.interceptors.request.use(
    async (config) => {
        let token = null;

        if (Platform.OS === 'web') {
            token = localStorage.getItem('authToken');
        } else {
            token = await AsyncStorage.getItem('authToken');
        }

        checkUserAccess();

        console.log(token);
        

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


// Interceptores de resposta (opcional)
export const setupAxiosInterceptors =  ({navigate, exp}) => { 
    api.interceptors.response.use(
    (response) =>  response,
    (error) => {
        // Tratamento de erros globais
        if (error.response?.status === 401) {
            console.error('Não autorizado. Redirecionando...');
            navigate('/login');
        }
        if (error.response?.status === 403) {
            console.error('Não autorizado. Redirecionando...');
            exp();
            navigate('/login');
        }
        console.log(error);
        
        return Promise.reject(error);
    }
);
}

export default api;