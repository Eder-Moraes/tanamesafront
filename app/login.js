import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../api/services/authService";
import { Link } from "react-router-native";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert("Erro", "Por favor, preencha todos os campos.");
    }

    try {
      const data = await login(JSON.stringify({ email, password }));

      if (Platform.OS === "web") {
        localStorage.setItem("authToken", data.token);
      } else {
        await AsyncStorage.setItem("authToken", data.token);
      }

      limparCampos();
    } catch (error) {
      setErrorMessage(error?.response?.data?.error || "Erro ao logar!");
      console.log(error);
    }
  };

  const limparCampos = () => {
    setEmail("");
    setPassword("");
  };

  const handleForgotPassword = () => {
    if (!email) {
      Alert.alert(
        "Recuperação de Senha",
        "Por favor, insira seu e-mail para receber um link de redefinição."
      );
    } else {
      Alert.alert(
        "Recuperação de Senha",
        `Um link de redefinição foi enviado para ${email} (exemplo).`
      );
    }
  };

  const renderContent = () => (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
      />

      {Platform.OS === "web" ? (
        <Link to="/cadastro" style={{ color: "#007BFF",fontSize: 14, marginTop: 15, marginBottom: 5 }}>
          <Text style={styles.link}>Criar conta</Text>
        </Link>
      ) : 
        (<TouchableOpacity
        style={{color: "#007BFF",fontSize: 14, marginBottom: 5}}
        onPress={() => navigation.navigate("Cadastro")}
      >
        <Text style={{color: "#007BFF",fontSize: 14}}>Criar Conta</Text>
      </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      <TouchableOpacity
        style={{color: "#007BFF",fontSize: 14}}
        onPress={handleForgotPassword}
      >
        <Text style={{color: "#007BFF",fontSize: 14}}>Esqueci minha senha</Text>
      </TouchableOpacity>
    </View>
  );

  return Platform.OS === "web" ? (
    renderContent()
  ) : (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {renderContent()}
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4BD37",
    padding: 16,
  },
  logo: {
    width: 175,
    height: 175,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  input: {
    width: "70%",
    height: 40,
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 16,
    color: "black",
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  forgotPassword: {
    marginTop: 10,
  },
  link: {
    color: "#007BFF",
    textAlign: "center",
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
