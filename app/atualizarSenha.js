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
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Link, Navigate, useLocation, useNavigate } from "react-router-native";
import { redefinirSenha } from "../api/services/authService";

export default function RedefinirSenha() {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  const navigate = useNavigate();

  const handleSalvar = async () => {
    if (novaSenha.length < 6) {
      alert("Erro: A senha deve ter pelo menos 6 caracteres.");
    } else if (novaSenha !== confirmarSenha) {
      alert("Erro: As senhas não coincidem.");
    } else {
      try {
        const data = await redefinirSenha(token, novaSenha);
        alert("Sucesso: Senha redefinida com sucesso!");

        navigate("/login");
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

      <View style={styles.links}>
        {Platform.OS === "web" ? (
          <>
            <Link to="/login">
              <Text style={{ color: "blue" }}>Ir para Login</Text>
            </Link>
            <Link to="/cadastro">
              <Text style={{ color: "blue" }}>Criar Conta</Text>
            </Link>
          </>
        ) : (
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
      </View>
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
    marginTop: 20,
    alignItems: "center",
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
