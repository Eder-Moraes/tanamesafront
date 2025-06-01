import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useSearchParams, useNavigate } from "react-router-native";
import { getReceitaByUserId } from "../api/services/receitaService";
import { getFavoritosByUserId } from "../api/services/listaFavoritoService";
import { getUserById } from "../api/services/userService";
import LogoLink from "./components/logoLink";

const PerfilPublicoScreen = () => {
  const [usuario, setUsuario] = useState({});
  const [receitas, setReceitas] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [fotoPerfil, setFotoPerfil] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const idUsuario = searchParams.get("id");

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const user = await getUserById(idUsuario);
        setUsuario(user);
        if (user.pathImage) {
          setFotoPerfil(`http://localhost:8080/files/images/${user.pathImage}`);
        } else{
            setFotoPerfil('https://i.pinimg.com/236x/21/9e/ae/219eaea67aafa864db091919ce3f5d82.jpg');
        }

        const receitasUser = await getReceitaByUserId(idUsuario);
        setReceitas(receitasUser);

        const favoritosUser = await getFavoritosByUserId(idUsuario);
        setFavoritos(favoritosUser);
      } catch (error) {
        console.error("Erro ao carregar dados públicos do usuário:", error);
      }
    };

    if (idUsuario) carregarDados();
  }, [idUsuario]);

  const renderReceita = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigate(`/receitas?idReceita=${item.id}`)}
    >
      <Text style={styles.itemTitle}>{item.titulo}</Text>
      <Text style={styles.itemDesc}>{item.descricao}</Text>
    </TouchableOpacity>
  );

  const renderFavorito = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigate(`/receitas?idReceita=${item?.id}`)}
    >
      <Text style={styles.itemTitle}>{item?.titulo}</Text>
      <Text style={styles.itemDesc}>{item?.descricao}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LogoLink />
      <Image source={{ uri: fotoPerfil }} style={styles.profileImage} />
      <Text style={styles.name}>{usuario.username}</Text>
      <Text style={styles.text}>Email: {usuario.email}</Text>
      <Text style={styles.text}>Telefone: {usuario.telefone}</Text>
      <Text style={styles.text}>Gênero: {usuario.genero}</Text>
      <Text style={styles.text}>País: {usuario.pais}</Text>
      <Text style={styles.text}>Cidade: {usuario.cidade}</Text>
      <Text style={styles.text}>CEP: {usuario.cep}</Text>

      <Text style={styles.sectionTitle}>Receitas</Text>
      <FlatList
        data={receitas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderReceita}
        style={styles.scrollContainer}
      />

      <Text style={styles.sectionTitle}>Favoritas</Text>
      <FlatList
        data={favoritos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderFavorito}
        style={styles.scrollContainer}
      />
    </ScrollView>
  );
};

export default PerfilPublicoScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F4BD37",
    alignItems: "center",
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#964B00",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  sectionTitle: {
    marginTop: 25,
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginLeft: "5%",
  },
  scrollContainer: {
    maxHeight: 200,
    width: "90%",
    marginVertical: 10,
  },
  item: {
    backgroundColor: "#FFF8E7",
    padding: 12,
    marginBottom: 8,
    borderRadius: 10,
  },
  itemTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  itemDesc: {
    fontSize: 14,
    color: "#333",
  },
});
