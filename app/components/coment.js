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
  const [avalia, setAvalia] = useState("");

  const { user } = useContext(UserContext);

  useEffect(() => {
    setListaComentarios(comentariosMock);
  }, []);

  const adicionarComentario = () => {
    if (comentario.trim() !== "") {
      const novoComentario = {
        autor: user.id,
        texto: comentario,
        imagem: user.pathImage,
        rating: avalia,
      };
      setListaComentarios([...listaComentarios, novoComentario]);
      setComentario("");
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
      <Text style={styles.title}>Avaliação</Text>
      <StarRating onRatingChange={(estrelas) => setAvalia(estrelas)} />
      <TextInput
        style={styles.input}
        placeholder="Digite seu comentário..."
        value={comentario}
        onChangeText={(texto) => setComentario(texto)}
      />

      <TouchableOpacity style={styles.botao} onPress={adicionarComentario}>
        <Text style={styles.botaoTexto}>Enviar</Text>
      </TouchableOpacity>

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
