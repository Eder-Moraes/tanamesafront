import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";

// Criação do contexto
export const UserContext = createContext();

// Provider para fornecer os dados
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [loginExp, setLoginExp] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };
    loadUser();
  }, []);

  const login_user = async (userInfo) => {
    setUser(userInfo);
    await AsyncStorage.setItem("user", JSON.stringify(userInfo));
    console.log(user);
  };

  const logout = async () => {
    setUser(null); // Limpa os dados do usuário
    localStorage.removeItem("authToken");
    await AsyncStorage.removeItem("authToken");
  };

  const exp = () => {
    logout();
    setLoginExp(true);
  };

  return (
    <UserContext.Provider
      value={{ user, loginExp, login_user, logout, exp, setLoginExp }}
    >
      {children}
    </UserContext.Provider>
  );
};
