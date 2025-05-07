import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Image } from "react-native-web";
import { validateEmail } from "../utils/diversos";
import { requestRecuperacao } from "../api/services/authService";


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

          alert("Email enviado com sucesso ao email: "+email);
          setMensagem("");
        } catch (error) {
          setMensagem(error?.response?.data?.error || "Erro ao enviar!");
          console.error(error);
        }
  };

  return (
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 175,
    height: 175,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    justifyContent: "center",
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
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  textoBotao: { color: "white", fontSize: 16 },
  mensagem: { marginTop: 20, textAlign: "center", fontSize: 14, color: "red" },
});
