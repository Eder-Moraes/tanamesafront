import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8080', // Substitua pela URL base da sua API
    timeout: 30000, // Tempo limite da requisição em ms
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptores de requisição (opcional)
api.interceptors.request.use(
    (config) => {
        // Adicionar token de autenticação, se necessário
        const token = localStorage.getItem('authToken');
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
        return Promise.reject(error);
    }
);
}

export default api;