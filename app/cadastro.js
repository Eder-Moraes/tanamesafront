import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Button,
  TouchableOpacity,
  Platform,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  useWindowDimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { register } from "../api/services/authService";
import { Link } from "react-router-native";

const CadastroScreen = ({ navigation }) => {
  const [nome, setNome] = useState("");
  const [gmail, setGmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cidade, setCidade] = useState("");
  const [genero, setGenero] = useState("");
  const [pais, setPais] = useState("");
  const [cep, setCep] = useState("");
  const [formError, setFormError] = useState("");

  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

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

  const handleSubmit = async () => {
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
        cep,
      };
      const data = await register(JSON.stringify(credentials));
      console.log(data);

      limparCampos();
      alert("Cadastro realizado com sucesso!");
      setFormError("");
    } catch (error) {
      setFormError(error?.response?.data?.error || "Erro ao registrar!");
      console.error(error);
    }
  };

  const render = () => {
    return (
      <ScrollView
        contentContainerStyle={[
          styles.container,
          isLargeScreen && styles.containerLarge,
        ]}
        keyboardShouldPersistTaps="handled"
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
        {Platform.OS === "web" ? (
          <Link to="/login" style={{ marginTop: 15 }}>
            <Text
              style={{
                color: "#007BFF",
                textAlign: "center",
                textDecorationLine: "underline",
              }}
            >
              Já tenho uma conta
            </Text>
          </Link>
        ) : (
          <TouchableOpacity
            style={{ color: "#007BFF", fontSize: 14, alignItems: 'center', marginTop: 5 }}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={{ color: "#007BFF", fontSize: 14 }}>Já tenho uma conta</Text>
          </TouchableOpacity>
        )}
        <Text style={[styles.terms, isLargeScreen && styles.termsLarge]}>
          Ao criar uma conta, você concorda com nossos Termos e Condições.
        </Text>
      </ScrollView>
    );
  };

  return Platform.OS === "web" ? (
    render()
  ) : (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {render()}
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fdd835",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#b30000",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
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
    fontSize: 16,
  },
  picker: {
    height: 50,
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#b30000",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  terms: {
    fontSize: 12,
    color: "#777",
    textAlign: "center",
    marginTop: 20,
  },
});

export default CadastroScreen;
