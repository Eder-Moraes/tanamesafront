import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  SafeAreaView,
} from "react-native";
import StarRating from "./components/Avalia";
import Comentarios from "./components/coment";
import { getReceitaById } from "../api/services/receitaService";
import { getUserById } from "../api/services/userService";
import { buscarUser } from "../utils/diversos";
import { adicionarFavorito, criarFavorito, removerFavorito, verificaFavorito } from "../api/services/listaFavoritoService";

const receitaDefault = {
  nome: "Bolo de Chocolate",
  imagem:
    "receita-placeholder.png",
  descricao: "Um delicioso bolo de chocolate fofinho!",
  ingredientes: [
    "2 xícaras de farinha",
    "1 xícara de açúcar",
    "1/2 xícara de cacau",
    "3 ovos",
    "1/2 xícara de óleo",
    "1 xícara de leite",
    "1 colher de fermento",
  ],
  categoria: "Sobremesa",
  preparo: "Misture os ingredientes, asse por 40 minutos a 180°C.",
  rendimento: "10 porções",
  tempo: "45 minutos",
};

const autorDefault = {
  username: "Pessoa",
  pathImage:
    "receita-placeholder.png",
};

const abrirLink = (categoria) => {
  Linking.openURL(`http://localhost:8081?categoria=${categoria}`);
};

const Receita = () => {
  const [clicado, setClicado] = useState(false);
  const [receita, setReceita] = useState(receitaDefault);
  const [autor, setAutor] = useState(autorDefault);
  const [visible, setVisible] = useState(true);

  const searchParams = new URLSearchParams(location.search);
  const id_receita = searchParams.get("idReceita");

  const BASE_URL = "http://localhost:8080"; // troque pelo seu IP

  const favorito = async() => {
    if(!clicado){
      try {
        const user = await buscarUser();
        const data = await adicionarFavorito(user.id, id_receita);
        setClicado(true);
      } catch (error) {
        alert(error?.response?.data?.error || "Erro ao favoritar receita!");
        console.error(error);
      }
    } else{
      try {
        const user = await buscarUser();
        const data = await removerFavorito(user.id, id_receita);
        setClicado(false);
      } catch (error) {
        alert(error?.response?.data?.error || "Erro ao desfavoritar receita!");
        console.error(error);
      }
    }
  };

  const fetchReceita = async (id_receita) => {
    if (id_receita) {
      try {
        const data = await getReceitaById(id_receita);
        setReceita(data);
        console.log(data);
        const data2 = await getUserById(data.id_autor);
        setAutor(data2);
        verifyAutor(data2);
      } catch (error) {
        alert(error?.response?.data?.error || "Erro ao buscar receita!");
        console.error(error);
      }
    }
  };

  const verifyFavorito = async() => {
    try {
        const user = await buscarUser();
        const data = await verificaFavorito(user.id, id_receita);
        setClicado(data);
      } catch (error) {
        alert(error?.response?.data?.error || "Erro ao buscar receita!");
        console.error(error);
      }
  }

  const verifyAutor = async(autor) => {
    const user = await buscarUser();
    console.log(user);
    
    setVisible(autor.id !== user.id);
  }

  useEffect(() => {
    fetchReceita(id_receita);
    verifyFavorito();
  }, [id_receita]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll}>
        {/* Autor */}
        <View style={styles.autor}>
          <Image
            source={{
              uri: `${BASE_URL}/files/images/${
                autor.pathImage || autorDefault.pathImage
              }`,
            }}
            style={styles.imagemAutor}
          />

          <Text style={styles.boldAutor}>
            Autor: <Text style={styles.textoAutor}>{autor.username}</Text>
          </Text>
        </View>

        {/* Título */}
        <Text style={styles.title}>{receita.nome}</Text>

        {/* Imagem da receita */}
        <Image
          source={{
            uri: `${BASE_URL}/files/images/${
              receita.imagemUrl || receitaDefault.imagem
            }`,
          }}
          style={styles.imagemReceita}
          resizeMode="cover"
        />

        {/* Categoria */}
        <View style={styles.cat}>
          <Text style={styles.bold}>Categoria: </Text>
          <TouchableOpacity onPress={() => abrirLink(receita.categoria)}>
            <Text style={styles.link}>{receita.categoria}</Text>
          </TouchableOpacity>
        </View>

        <View style={{display: visible ? 'flex':'none'}}>
        <View style={styles.gosto}>
          {/* Botão de favorito */}
          <TouchableOpacity onPress={favorito}>
            <Text style={clicado ? styles.selecionado : styles.nSelecionado}>
              {"♥"}
            </Text>
          </TouchableOpacity>
        </View>
        </View>

        {/* Descrição */}
        <View style={styles.quadrado}>
          <Text style={styles.descricao}>{receita.descricao}</Text>
        </View>

        {/* Tempo */}
        <View style={styles.quadrado}>
          <Text style={styles.info}>
            <Text style={styles.bold}>Tempo de preparo:</Text>{" "}
            {receita.tempoPreparo}
          </Text>
        </View>

        {/* Ingredientes */}
        <View style={styles.quadrado}>
          <Text style={styles.subtitle}>Ingredientes:</Text>
          <Text style={styles.ingrediente}>{receita.ingredientes}</Text>
        </View>

        {/* Preparo */}
        <View style={styles.quadrado}>
          <Text style={styles.info}>
            <Text style={styles.bold}>Modo de preparo:</Text>{" "}
            {receita.modoPreparo}
          </Text>
        </View>

        {/* Rendimento */}
        <View style={styles.quadrado}>
          <Text style={styles.info}>
            <Text style={styles.bold}>Rendimento:</Text> {receita.rendimento}
          </Text>
        </View>

        {/* Campo de comentários */}
        <View style={styles.coment}>
          <Comentarios largura={"95%"} corFundo={"#ebd1bc"} id_receita={id_receita} visibleAutor={visible}/>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#FFDAB9",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 5,
  },
  imagemReceita: {
    width: "100%",
    maxWidth: 800,
    height: 400,
    borderRadius: 16,
    marginBottom: 10,
    alignSelf: "center",
  },
  descricao: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  ingrediente: {
    fontSize: 16,
  },
  info: {
    fontSize: 16,
    marginTop: 5,
  },
  bold: {
    fontWeight: "bold",
  },
  quadrado: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderRadius: 25,
    marginBottom: 10,
  },
  cat: {
    alignItems: "center",
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  link: {
    color: "blue",
    fontWeight: "bold", // Corrigido: não pode ser número
  },
  scroll: {
    width: "100%",
    maxWidth: 1000,
    paddingHorizontal: 20,
    alignSelf: "center",
  },
  imagemAutor: {
    width: 50,
    height: 50,
    borderRadius: 100,
  },
  autor: {
    flexDirection: "row",
    marginBottom: 10,
    marginTop: 5,
    marginLeft: 5,
    alignItems: "center", // Para alinhar verticalmente imagem e texto
  },
  boldAutor: {
    fontWeight: "bold",
    marginLeft: 5,
    fontSize: 16,
  },
  textoAutor: {
    fontWeight: "normal",
    fontSize: 16,
  },
  selecionado: {
    color: "red",
    fontSize: 50,
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  nSelecionado: {
    color: "grey",
    fontSize: 50,
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  gosto: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
  },
  coment: {
    alignItems: "center",
  },
});

export default Receita;
