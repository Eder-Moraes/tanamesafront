import React from "react";
import { Platform } from "react-native";
import { NativeRouter, Route, Routes } from "react-router-native"; // Para o react-router-native
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./app/Home";
import LoginScreen from "./app/login";
import CadastroScreen from "./app/cadastro";
import { UserProvider } from "./context/userContext";
import { BrowserRouter } from "react-router-dom";
import EmailRecuperar from "./app/emailRecuperar";
import RedefinirSenha from "./app/atualizarSenha";
import CriarReceita from "./app/criarReceita2";
import ProfileScreen from "./app/perfil";
import Receita from "./app/paginaReceitas";

const Stack = createNativeStackNavigator(); // Usado para o Stack Navigator no mobile

// Navegação para web usando react-router-dom (não react-router-native)
function WebNavigation() {

  return (
    <BrowserRouter>
      {" "}
      {/* Para Web */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cadastro" element={<CadastroScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/email-recuperar" element={<EmailRecuperar />}></Route>
          <Route path="/redefinir-senha" element={<RedefinirSenha />}></Route>
          <Route path="/criar-receita" element={<CriarReceita />}></Route>
          <Route path="/perfil" element={<ProfileScreen />}></Route>
          <Route path="/receitas" element={<Receita />}></Route>
        </Routes>
    </BrowserRouter>
  );
}

// Navegação para mobile (iOS/Android) usando react-navigation
function MobileNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Cadastro"
            component={CadastroScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EmailRecuperar"
            component={EmailRecuperar}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RedefinirSenha"
            component={RedefinirSenha}
            options={{ headerShown: false }}
          />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return Platform.OS === "web" ? (<UserProvider><WebNavigation /></UserProvider>) 
  : (<UserProvider><MobileNavigation /></UserProvider>);
}
