import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Image } from "react-native-web";
import { validateEmail } from "../utils/diversos";
import { requestRecuperacao } from "../api/services/authService";
import { Link } from "react-router-native";

export default function EmailRecuperar() {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");

  const enviarEmail = async () => {
    if (!validateEmail(email)) {
      setMensagem("Digite um e-mail válido.");
      return;
    }

    try {
      const data = await requestRecuperacao(email);
      console.log(data);

      alert("Email enviado com sucesso ao email: " + email);
      setMensagem("");
    } catch (error) {
      setMensagem(error?.response?.data?.error || "Erro ao enviar!");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.bloco}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Text style={styles.titulo}>Esqueceu sua senha?</Text>
        <Text style={styles.subtitulo}>
          Enviaremos um e-mail com instruções de como redefinir sua senha.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.botao} onPress={enviarEmail}>
          <Text style={styles.textoBotao}>Enviar</Text>
        </TouchableOpacity>
        <Text style={styles.mensagem}>{mensagem}</Text>
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
    </View>
  );

}

const styles = StyleSheet.create({
  links: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    width: 175,
    alignSelf: "center",
    height: 175,
    marginBottom: 20,
    marginRight: 20,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F4BD37",
  },
  titulo: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  subtitulo: { fontSize: 14, marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  botao: {
    backgroundColor: "#964B00",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",

  },
  textoBotao: { color: "white", fontSize: 16 },
  mensagem: { marginTop: 20, textAlign: "center", fontSize: 14, color: "red" },

  bloco: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 400, // Limita a largura no Web
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Para Android
  },

});
