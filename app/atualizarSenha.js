import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Button,
  Platform,
} from "react-native";
import { Image } from "react-native-web";
import { redefinirSenha } from "../api/services/authService";
import { Link, Navigate, useLocation } from "react-router-native";

export default function RedefinirSenha() {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  const handleSalvar = async () => {
    if (novaSenha.length < 6) {
      alert("Erro: A senha deve ter pelo menos 6 caracteres.");
    } else if (novaSenha !== confirmarSenha) {
      alert("Erro: As senhas não coincidem.");
    } else {
      try {
        console.log(token);

        const data = await redefinirSenha(token, novaSenha);
        console.log(data);
        Navigate("/login");
        alert("Sucesso: Senha redefinida com sucesso!");
      } catch (error) {
        alert(error?.response?.data?.error || "Erro ao enviar!");
        console.error(error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Text style={styles.label}>Criar nova senha</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={novaSenha}
        onChangeText={setNovaSenha}
        placeholder="Digite a nova senha"
      />

      <Text style={styles.label}>Confirmar Senha</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        placeholder="Confirme a nova senha"
      />

      <TouchableOpacity style={styles.botao} onPress={handleSalvar}>
        <Text style={styles.textoBotao}>Salvar</Text>
      </TouchableOpacity>

      <div style={styles.links}>
      {Platform.OS === "web" ? (
        // Para Web: Usando Link para navegação
        <>
          <Link to="/login">
            <Text style={{ color: "blue" }}>Ir para Login</Text>
          </Link>
          <Link to="/cadastro">
            <Text style={{ color: "blue" }}>Criar Conta</Text>
          </Link>
        </>
      ) : (
        // Para iOS/Android: Usando Button do React Navigation
        <>
          <Button
            title="Ir para Login"
            onPress={() => navigation.navigate("Login")}
          />
          <Button
            title="Criar Conta"
            onPress={() => navigation.navigate("Cadastro")}
          />
        </>
      )}
      </div>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 175,
    height: 175,
    marginBottom: 20,
  },
  links: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#F4BD37",
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#964B00",
    borderRadius: 8,
    padding: 10,
  },
  botao: {
    backgroundColor: "#964B00",
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
