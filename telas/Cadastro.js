import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Button,
  ScrollView,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { register } from "../api/services/authService";

const CadastroScreen = () => {
  const [nome, setNome] = useState("");
  const [gmail, setGmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cidade, setCidade] = useState("");
  const [genero, setGenero] = useState("");
  const [pais, setPais] = useState("");
  const [cep, setCep] = useState("");
  const [formError, setFormError] = useState('');
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  const limparCampos = () => {
    setNome("");
    setGmail("");
    setSenha("");
    setConfirmarSenha("");
    setTelefone("");
    setCidade("");
    setGenero("");
    setPais("");
    setCep("");
  };
  

  useEffect(() => {
    const updateLayout = () => {
      setIsLargeScreen(Dimensions.get("window").width > 768);
    };

    Dimensions.addEventListener("change", updateLayout);
    updateLayout(); // Initial check

    return () => Dimensions.removeEventListener("change", updateLayout);
  }, []);

  const  handleSubmit = async () => {
    let erros = [];

    if (!nome.trim()) erros.push("Nome completo é obrigatório.");
    if (!gmail.trim()) erros.push("Gmail é obrigatório.");
    if (!senha) erros.push("Senha é obrigatória.");
    if (!confirmarSenha) erros.push("Confirmação de senha é obrigatória.");
    if (!cidade.trim()) erros.push("Cidade é obrigatória.");

    if (senha && confirmarSenha && senha !== confirmarSenha) {
      erros.push("As senhas não coincidem.");
    }

    if (erros.length > 0) {
      setFormError(erros.join("\n"));
      return;
    }

    try {
      const credentials = {
        name: nome,
        email: gmail,
        password: senha,
        telefone,
        cidade,
        genero,
        pais,
        cep
      };
      const data = await register(JSON.stringify(credentials));
      console.log(data);

      limparCampos();
      alert("Cadastro realizado com sucesso!");
      setFormError("");
  } catch (error) {
  
      // Verifica se o erro é um objeto de resposta (response) com método text()
     setFormError(error?.response?.data?.error  || "Erro ao registrar!");
  
      console.error(error); // Loga o erro para depuração
  }

  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        isLargeScreen && styles.containerLarge,
      ]}
    >
      <Text style={[styles.title, isLargeScreen && styles.titleLarge]}>
        Criar sua Conta
      </Text>
      <Text style={[styles.subtitle, isLargeScreen && styles.subtitleLarge]}>
        Preencha os campos abaixo para se cadastrar
      </Text>

      <View
        style={[styles.inputGroup, isLargeScreen && styles.inputGroupLarge]}
      >
        <TextInput
          style={[styles.input, isLargeScreen && styles.inputLarge]}
          placeholder="Nome Completo"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={[styles.input, isLargeScreen && styles.inputLarge]}
          placeholder="Seu Melhor Gmail"
          value={gmail}
          onChangeText={setGmail}
          keyboardType="email-address"
        />
      </View>

      <View
        style={[styles.inputGroup, isLargeScreen && styles.inputGroupLarge]}
      >
        <TextInput
          style={[styles.input, isLargeScreen && styles.inputLarge]}
          placeholder="Senha Segura"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />
        <TextInput
          style={[styles.input, isLargeScreen && styles.inputLarge]}
          placeholder="Confirmar Senha"
          secureTextEntry
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Número de Telefone (Opcional)"
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Sua Cidade"
        value={cidade}
        onChangeText={setCidade}
      />
      <Picker
        selectedValue={genero}
        style={styles.picker}
        onValueChange={(itemValue) => setGenero(itemValue)}
      >
        <Picker.Item label="Selecione seu Gênero (Opcional)" value="" />
        <Picker.Item label="Masculino" value="masculino" />
        <Picker.Item label="Feminino" value="feminino" />
        <Picker.Item label="Outro" value="outro" />
      </Picker>
      <Picker
        selectedValue={pais}
        style={styles.picker}
        onValueChange={(itemValue) => setPais(itemValue)}
      >
        <Picker.Item label="Selecione seu País (Opcional)" value="" />
        <Picker.Item label="Brasil" value="brasil" />
        <Picker.Item label="Outro" value="outro" />
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Seu CEP (Opcional)"
        value={cep}
        onChangeText={setCep}
        keyboardType="numeric"
      />
      {formError !== "" && <Text style={styles.errorText}>{formError}</Text>}

      <Button
        title="Criar Conta"
        onPress={handleSubmit}
        color="#b30000"
        style={isLargeScreen && styles.buttonLarge}
      />
      <Text style={[styles.terms, isLargeScreen && styles.termsLarge]}>
        Ao criar uma conta, você concorda com nossos Termos e Condições.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fdd835", // Amarelo mais claro para celular
    padding: 20,
    justifyContent: "center",
  },
  containerLarge: {
    padding: 60,
    alignItems: "center",
    maxWidth: 800,
    marginHorizontal: "auto",
    backgroundColor: "#ffeb3b", // Amarelo um pouco mais forte para PC
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#b30000",
    marginBottom: 15,
  },
  titleLarge: {
    fontSize: 36,
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 30,
  },
  subtitleLarge: {
    fontSize: 18,
    marginBottom: 40,
  },
  column: {
    flexDirection: "column",
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputGroupLarge: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#b30000",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
    color: "#333",
    fontSize: 16,
    width: "100%",
  },
  inputLarge: {
    width: "48%",
  },
  picker: {
    height: 50,
    marginBottom: 15,
    borderColor: "#b30000",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
    color: "#333",
    fontSize: 16,
    width: "100%",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  buttonLarge: {
    paddingVertical: 15,
    fontSize: 18,
    borderRadius: 10,
  },
  terms: {
    fontSize: 12,
    color: "#777",
    textAlign: "center",
    marginTop: 30,
  },
  termsLarge: {
    fontSize: 14,
    marginTop: 40,
  },
});

export default CadastroScreen;
