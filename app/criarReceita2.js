import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { Picker } from "react-native-web";
import { salvarReceita } from "../api/services/receitaService";
import placeholder from "../assets/receita-placeholder.png";

export default function CriarReceita() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [ingredientes, setIngredientes] = useState("");
  const [preparo, setPreparo] = useState("");
  const [rendimento, setRendimento] = useState("");
  const [tempo, setTempo] = useState("");
  const [categoria, setCategoria] = useState("");

  const [imagemPreview, setImagemPreview] = useState(placeholder);
  const [imagemArquivo, setImagemArquivo] = useState(null);

  const clicado = async () => {
    try {
      const response = await launchImageLibrary({
        mediaType: "photo",
        quality: 1,
        includeBase64: false,
      });

      if (response.didCancel) {
        console.log("Usuário cancelou a seleção de imagem");
        return;
      }

      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        setImagemPreview({ uri: asset.uri });

        if (Platform.OS === "web") {
          const blob = await fetch(asset.uri).then(res => res.blob());
          const file = new File([blob], asset.fileName || "imagem.jpg", {
            type: blob.type,
          });
          setImagemArquivo(file);
        } else {
          setImagemArquivo({
            uri: asset.uri,
            type: asset.type,
            name: asset.fileName || "imagem.jpg",
          });
        }
      }
    } catch (error) {
      console.log("Erro ao selecionar imagem:", error);
    }
  };

  const handleSalvar = async () => {
    if (
      !titulo ||
      !descricao ||
      !ingredientes ||
      !preparo ||
      !rendimento ||
      !tempo ||
      !categoria
    ) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const receita = {
      titulo,
      descricao,
      ingredientes,
      modoPreparo: preparo,
      rendimento,
      tempoPreparo: tempo,
      categoria,
    };

    const formData = new FormData();
    formData.append("receitaCreateDTO", JSON.stringify(receita));

    if (imagemArquivo) {
      formData.append("imagem", imagemArquivo);
    }

    console.log(imagemArquivo);
    

    try {
      const data = await salvarReceita(formData);
      alert("Sucesso: Receita criada com sucesso!");
      console.log(data);
    } catch (error) {
      alert(error?.response?.data?.error || "Erro ao enviar!");
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Criar Receita</Text>

        <TouchableOpacity onPress={clicado}>
          <Image
            source={imagemPreview}
            style={styles.imagem}
            resizeMode="cover"
          />
        </TouchableOpacity>

        <Text style={styles.label}>Título da receita</Text>
        <TextInput
          style={styles.inputLongo}
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Ex: Bolo de Laranja com Calda"
        />

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={styles.textarea}
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Breve descrição da receita..."
          multiline
        />

        <Text style={styles.label}>Ingredientes</Text>
        <TextInput
          style={styles.textarea}
          value={ingredientes}
          onChangeText={setIngredientes}
          placeholder="Ex: 2 xícaras de farinha, 1 ovo..."
          multiline
        />

        <Text style={styles.label}>Modo de Preparo</Text>
        <TextInput
          style={styles.textarea}
          value={preparo}
          onChangeText={setPreparo}
          placeholder="Passo a passo da Receita..."
          multiline
        />

        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Rendimento</Text>
            <TextInput
              style={styles.input}
              value={rendimento}
              onChangeText={setRendimento}
              placeholder="Ex: 8 porções"
            />
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Tempo de Preparo</Text>
            <TextInput
              style={styles.input}
              value={tempo}
              onChangeText={setTempo}
              placeholder="Ex: 40 minutos"
            />
          </View>
        </View>

        <Text style={styles.label}>Categoria</Text>
        <Picker
          selectedValue={categoria}
          onValueChange={(itemValue) => setCategoria(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Selecione uma categoria..." value="" />
          <Picker.Item label="Comida" value="COMIDA" />
        </Picker>

        <View style={styles.buttonContainer}>
          <Button title="Salvar receita" color="green" onPress={handleSalvar} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F4BD37",
    flex: 1,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  inputLongo: {
    borderWidth: 1,
    borderColor: "#ccc",
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  textarea: {
    borderWidth: 1,
    borderColor: "#ccc",
    height: 100,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#fff",
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  col: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: 30,
    borderRadius: 10,
    overflow: "hidden",
  },
  imagem: {
    width: 100,
    height: 100,
    borderRadius: 100,
    marginBottom: 10,
    alignSelf: "center",
  },
});
