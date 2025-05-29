import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import StarRating from "./Avalia";
import { UserContext } from "../../context/userContext";
import {
  getAvaliacaoByReceita,
  register,
} from "../../api/services/AvaliacaoService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { buscarUser } from "../../utils/diversos";

// Simulando uma API com comentários de outras pessoas
const comentariosMock = [
  {
    id: "1",
    autor: "João",
    texto: "Esse bolo ficou incrível!",
    imagem:
      "https://www.vozdobico.com.br/wp-content/uploads/2021/01/perfil-sem-foto-fake.jpg",
    likes: 0,
    rating: 5, // ⭐⭐⭐⭐⭐
  },
  {
    id: "2",
    autor: "Maria",
    texto: "Vou testar essa receita hoje 😍",
    imagem:
      "https://i.pinimg.com/236x/21/9e/ae/219eaea67aafa864db091919ce3f5d82.jpg",
    likes: 2,
    rating: 4, // ⭐⭐⭐⭐
  },
];

const Comentarios = ({
  altura = 400,
  largura = "100%",
  corFundo = "#cacaca",
  id_receita,
}) => {
  const [comentario, setComentario] = useState("");
  const [listaComentarios, setListaComentarios] = useState([]);
  const [avalia, setAvalia] = useState(0);
  const [visible, setVisible] = useState(true);

  const BASE_URL = "http://localhost:8080"; // troque pelo seu IP

  const fechAvaliacoes = async () => {
    try {
      const user = await buscarUser();
      console.log("User agora: ");
      console.log(user);

      const data = await getAvaliacaoByReceita(id_receita);

      const novosComentarios = data.map((avaliacao) => {
        if (avaliacao.autor.id === user?.id) {
          setAvalia(avaliacao.quantidade_estrela);
          setComentario(avaliacao.conteudo);
        }
        return {
          id: Date.now().toString() + Math.random().toString(36).substring(2), // ID único
          autor: avaliacao.autor?.name ?? "Usuário",
          texto: avaliacao.conteudo,
          imagem: `${BASE_URL}/files/images/${avaliacao.autor.pathImage}`,
          rating: avaliacao.quantidade_estrela,
        };
      });

      setListaComentarios(novosComentarios);
    } catch (error) {
      alert(error?.response?.data?.error || "Erro ao buscar avaliações!");
      console.error(error);
    }
  };

  useEffect(() => {
    fechAvaliacoes();
  }, []);

  const adicionarComentario = async () => {
    try {
      const user = await buscarUser();
      if (comentario.trim() !== "") {
        const comentarioAdicionar = {
          userId: user.id,
          receitaId: id_receita,
          conteudo: comentario,
          quantidadeEstrela: avalia,
        };

        const data = await register(comentarioAdicionar);

        const novoComentario = {
          id: Date.now().toString(),
          autor: user?.username ?? "Usuário",
          texto: comentario,
          imagem: `${BASE_URL}/files/images/${user.pathImage}`,
          rating: avalia,
        };
        if (!Array.isArray(listaComentarios)) {
          setListaComentarios([novoComentario]);
        } else {
          const comentariosSemDoUsuario = listaComentarios.filter(
            (avaliacao) => avaliacao.autor !== user?.username // ou `avaliacao.autor.id !== user?.id` se tiver ID
          );
          setListaComentarios([...comentariosSemDoUsuario, novoComentario]);
        }

        setComentario("");
      }
    } catch (error) {
      alert(error?.response?.data?.error || "Erro ao enviar!");
      console.error(error);
    }
  };

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: corFundo,
        height: altura,
        width: largura,
      }}
    >
      <View style={{ display: visible ? "flex" : "none" }}>
        <Text style={styles.title}>Avaliação</Text>
        <StarRating
          onRatingChange={(estrelas) => setAvalia(estrelas)}
          initial_estrela={avalia}
        />
        <TextInput
          style={styles.input}
          placeholder="Digite seu comentário..."
          value={comentario}
          onChangeText={(texto) => setComentario(texto)}
        />

        <TouchableOpacity style={styles.botao} onPress={adicionarComentario}>
          <Text style={styles.botaoTexto}>Enviar</Text>
        </TouchableOpacity>
      </View>

      {/* Área de comentários com tamanho fixo e scroll interno */}
      <View style={styles.areaComentarios}>
        <FlatList
          data={listaComentarios}
          renderItem={({ item }) => (
            <View style={styles.comentarioBox}>
              <View style={styles.autoria}>
                <Image source={{ uri: item.imagem }} style={styles.imagem} />
                <Text style={styles.autor}>{item.autor}:</Text>
              </View>
              <View style={styles.texto}>
                {/* Botão de avaliação */}
                <View style={styles.starContainer}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <TouchableOpacity key={i} onPress={() => mandaAva(i)}>
                      <Text
                        style={
                          i <= item.rating
                            ? styles.starSelected
                            : styles.starUnselected
                        }
                      >
                        {"★"}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.comentario}>{item.texto}</Text>

                {/* Botão de Like
              <TouchableOpacity onPress={() => curtirComentario(item.id)} style={styles.likeBotao}>
                <Text style={styles.likeTexto}>👍 {item.likes}</Text>
              </TouchableOpacity> */}
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={true} // Mostra barra de rolagem
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  botao: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 5,
  },
  botaoTexto: {
    color: "white",
    fontWeight: "bold",
  },
  comentarioBox: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 5,
    marginVertical: 5,
  },
  autor: {
    fontWeight: "bold",
  },
  comentario: {
    fontSize: 16,
  },
  autoria: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  imagem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  likeTexto: {
    fontSize: 16,
    color: "black",
  },
  texto: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  areaComentarios: {
    flex: 1,
    borderWidth: 1,
    borderColor: "gray",
    padding: 5,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  starSelected: {
    fontSize: 40,
    color: "gold",
    marginHorizontal: 5,
    textShadow: "1px 1px 2px black",
  },
  starUnselected: {
    fontSize: 40,
    color: "gray",
    marginHorizontal: 5,
    textShadow: "1px 1px 2px black",
  },
  starContainer: {
    flexDirection: "row",
  },
});

export default Comentarios;
