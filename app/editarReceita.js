import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  SafeAreaView,
  Button,
  Image,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import placeholder from "../assets/receita-placeholder.png";
import { buscarUser } from "../utils/diversos";
import { useNavigate } from "react-router-native";
import { editarReceita, getReceitaById, salvarReceita } from "../api/services/receitaService";
import { Picker } from "react-native-web";
import endpoints from "../api/endpoints";
import LogoLink from "./components/logoLink";

export default function AtualizarReceita() {
  const [titulo, setTitulo] = useState("pizza caseira");
  const [descricao, setDescricao] = useState("deliciosa pizza");
  const [ingredientes, setIngredientes] = useState(
    "1 farinha, 300g de queijo..."
  );
  const [preparo, setPreparo] = useState("misture tudo e esquenta que da bom");
  const [rendimento, setRendimento] = useState("2 pizzas");
  const [tempo, setTempo] = useState("15 min");
  const [categoria, setCategoria] = useState("massa");
  const [imagemArquivo, setImagemArquivo] = useState(null);
  const [imagem, setImagem] = useState(placeholder);
  const [modal, setmodal] = useState(false);

  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const id_receita = searchParams.get("idReceita");

  const escolherImagem = async () => {
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
        setImagem({ uri: asset.uri });

        if (Platform.OS === "web") {
          const blob = await fetch(asset.uri).then((res) => res.blob());
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

  const fetchReceita = async (id_receita) => {
    if (id_receita) {
      try {
        const user = await buscarUser();
        const data = await getReceitaById(id_receita);
        console.log(data);
        setImagem(endpoints.baseFilesImage+`/${data.imagemUrl}`);
        setTitulo(data.titulo);
        setCategoria(data.categoria);
        setDescricao(data.descricao);
        setIngredientes(data.ingredientes);
        setPreparo(data.modoPreparo);
        setRendimento(data.rendimento);
        setTempo(data.tempoPreparo);
        if (data.id_autor != user.id) navigate("/");
      } catch (error) {
        alert(error?.response?.data?.error || "Erro ao buscar receita!");
        console.error(error);
      }
    }
  };

  const handleEditar = async () => {
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
        id: id_receita,
        titulo,
        descricao,
        ingredientes,
        modoPreparo: preparo,
        rendimento,
        tempoPreparo: tempo,
        categoria,
      };
  
      const formData = new FormData();
      formData.append("receitaUpdateDTO", JSON.stringify(receita));
  
      if (imagemArquivo) {
        formData.append("imagem", imagemArquivo);
      }
  
      console.log(imagemArquivo);
      
  
      try {
        const data = await editarReceita(formData);
        alert("Sucesso: Receita criada com sucesso!");
        console.log(data);
        navigate(`/receitas?idReceita=${data.id}`);
      } catch (error) {
        alert(error?.response?.data?.error || "Erro ao enviar!");
        console.error(error);
      }
    };

  useEffect(() => {
    if(!id_receita) navigate('/');
    fetchReceita(id_receita);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <LogoLink></LogoLink>
        <Text style={styles.header}>Atualizar Receita</Text>

        <TouchableOpacity onPress={() => setmodal(!modal)}>
          <Image source={imagem} style={styles.imagem} />
        </TouchableOpacity>

        <Modal animationType="fade" transparent={true} visible={modal}>
          <View style={styles.modelo}>
            <TouchableOpacity onPress={() => setmodal(!modal)}>
              <Text style={styles.sair}>X</Text>
            </TouchableOpacity>

            <Text style={{ alignSelf: "center" }}>Adicionar Imagem</Text>
            <TouchableOpacity style={styles.botao} onPress={escolherImagem}>
              <Text style={styles.textoBotao}>Escolher da Galeria</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Text style={styles.label}>Título da receita</Text>
        <TextInput
          style={styles.input}
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
          <Picker.Item label="Doces" value="DOCES" />
          <Picker.Item label="Lanches" value="LANCHES" />
          <Picker.Item label="Massas" value="MASSAS" />
          <Picker.Item label="Frituras" value="FRITURAS" />
        </Picker>

        <View style={styles.buttonContainer}>
          <Button
            title="Salvar receita"
            color="green"
            onPress={handleEditar}
          />
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
  imagem: {
    width: 100,
    height: 100,
    borderRadius: 100,
    resizeMode: "cover",
    alignSelf: "center",
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
  modelo: {
    backgroundColor: "white",
    alignSelf: "center",
    marginTop: 150,
    padding: 10,
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 0.5,
  },
  sair: {
    fontSize: 15,
    opacity: 0.35,
    left: 140,
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
  botao: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  textoBotao: {
    color: "#fff",
    fontSize: 16,
  },
});
