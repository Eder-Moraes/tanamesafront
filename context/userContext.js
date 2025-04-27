import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState } from 'react';

// Criação do contexto
export const UserContext = createContext();

// Provider para fornecer os dados
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const [loginExp, setLoginExp] = useState(false);

    // Funções auxiliares
    const login = (userInfo) => {
        if(userInfo){
            setUser(userInfo); // Atualiza os dados do usuário
            setLoginExp(false);
        }
    } 
    const logout = async () => {
        setUser(null); // Limpa os dados do usuário
        localStorage.removeItem('authToken');
        await AsyncStorage.removeItem('authToken');
    }

    const exp = () => {
        logout();
        setLoginExp(true);
    }

    return (
        <UserContext.Provider value={{ user, loginExp, login, logout, exp, setLoginExp }}>
            {children}
        </UserContext.Provider>
    );
};
