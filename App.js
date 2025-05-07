import React from "react";
import { Platform } from "react-native";
import { NativeRouter, Route, Routes } from "react-router-native"; // Para o react-router-native
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./app/index";
import LoginScreen from "./app/login";
import CadastroScreen from "./app/cadastro";
import { UserProvider } from "./context/userContext";
import { BrowserRouter } from "react-router-dom";
import EmailRecuperar from "./app/emailRecuperar";

const Stack = createNativeStackNavigator(); // Usado para o Stack Navigator no mobile

// Navegação para web usando react-router-dom (não react-router-native)
function WebNavigation() {

  return (
    <BrowserRouter>
      {" "}
      {/* Para Web */}
      <UserProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cadastro" element={<CadastroScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/emailRecuperar" element={<EmailRecuperar />}></Route>
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

// Navegação para mobile (iOS/Android) usando react-navigation
function MobileNavigation() {
  return (
    <UserProvider>
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
      </Stack.Navigator>
    </NavigationContainer>
    </UserProvider>
  );
}

export default function App() {
  return Platform.OS === "web" ? <WebNavigation /> : <MobileNavigation />;
}
