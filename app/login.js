import React, { useContext, useState } from "react";
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
import { getUserById } from "../api/services/userService";
import { Link, useNavigate } from "react-router-native";
import { UserContext } from "../context/userContext";
import checkUserAccess from "../utils/checkUserAccess";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  const navigate = useNavigate();

  const { login_user, user } = useContext(UserContext);


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

      const userDecoded = checkUserAccess();

      const data2 = await getUserById(userDecoded.id);

      await AsyncStorage.setItem("user", data2);
      login_user(data2);

      console.log(user);
      

      //navigate("/");

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
      <View style={styles.Bloco}>
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
          <Link
            to="/cadastro"
            style={{ marginTop: 15, marginBottom: 5 }}
          >
            <Text style={styles.link}>Criar conta</Text>
          </Link>
        ) : (
          <TouchableOpacity
            onPress={() => navigation.navigate("Cadastro")}
            style={{ marginBottom: 5 }}
          >
            <Text style={styles.link}>Criar Conta</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        {Platform.OS === "web" ? (
          <Link
            to="/email-recuperar"
            style={{ marginTop: 15, marginBottom: 5 }}
          >
            <Text style={styles.link}>Esqueceu a senha?</Text>
          </Link>
        ) : (
          <TouchableOpacity
            onPress={() => navigation.navigate("EmailRecuperar")}
          >
            <Text style={styles.link}>Esqueci minha senha</Text>
          </TouchableOpacity>
        )}
      </View>
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
    marginRight: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 20,
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
    backgroundColor: "#964B00",
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
  Bloco: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    maxWidth: 400,
  },
});

export default LoginScreen;
