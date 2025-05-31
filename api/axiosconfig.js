import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Platform } from "react-native";
import checkUserAccess from "../utils/checkUserAccess";
import { Navigate } from "react-router-native";

const baseURL = 'http://localhost:8080';

const api = axios.create({
    baseURL: baseURL, // Substitua pela URL base da sua API
    timeout: 30000, // Tempo limite da requisição em ms
    headers: {
        "Content-Type":"application/json"
    },
});

// Interceptores de requisição (opcional)
api.interceptors.request.use(
    async (config) => {
        let token = null;

        checkUserAccess();

        if (Platform.OS === 'web') {
            token = localStorage.getItem('authToken');
        } else {
            token = await AsyncStorage.getItem('authToken');
        }

        console.log(token);
        

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


const rotasPublicas = ['/login', '/cadastro', '/recuperar-senha', '/email-recuperar'];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const pathname = window.location.pathname;

    if ((status === 401 || status === 403) && !rotasPublicas.includes(pathname)) {
        // console.warn('Token inválido. Redirecionando para login...');
        localStorage.removeItem('authToken'); // ou AsyncStorage se for nativo
        AsyncStorage.removeItem('authToken'); 
        // window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);



export default api;