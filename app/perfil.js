import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { launchImageLibrary } from "react-native-image-picker";
import axios from "axios";
import { editarUsuario, updateImagePerfil } from "../api/services/userService";
import { buscarUser, logout } from "../utils/diversos";
import { getReceitaByUserId } from "../api/services/receitaService";
import { useNavigate, useNavigation } from "react-router-native";
import { getFavoritosByUserId } from "../api/services/listaFavoritoService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LogoLink from "./components/logoLink";

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cidade, setCidade] = useState("");
  const [genero, setGenero] = useState("");
  const [pais, setPais] = useState("");
  const [cep, setCep] = useState("");
  const [profileImage, setProfileImage] = useState(
    "https://i.pinimg.com/236x/21/9e/ae/219eaea67aafa864db091919ce3f5d82.jpg"
  );
  const [imagemArquivo, setImagemArquivo] = useState(null);

  const [paises, setPaises] = useState([]);
  const [cidades, setCidades] = useState([]);

  const [receitas, setReceitas] = useState([]);
  const [favoritos, setFavoritos] = useState([]);

  const navigation = useNavigate();

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
        setProfileImage(response.assets[0].uri);

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

  const handleSaveImage = async () => {
        if (!profileImage) return console.log('Nenhuma imagem selecionada para upload.');

        const formData = new FormData();
        formData.append("file", imagemArquivo);

        try {
            const data = await updateImagePerfil(formData);
            await AsyncStorage.setItem("user", JSON.stringify(data));
            console.log('Imagem salva com sucesso:', data);
        } catch (error) {
            console.error('Erro ao salvar imagem:', error);
        }
    };

  const carregarPaises = async () => {
    try {
      const response = await axios.get(
        "https://countriesnow.space/api/v0.1/countries/positions"
      );
      setPaises(response.data.data.map((p) => p.name));
    } catch (error) {
      console.error("Erro ao carregar países", error);
    }
  };

  const carregarCidades = async (paisSelecionado) => {
    try {
      const response = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/cities",
        {
          country: paisSelecionado,
        }
      );
      setCidades(response.data.data);
    } catch (error) {
      console.error("Erro ao carregar cidades", error);
    }
  };

  const fetchUser = async () => {
    try {
      const user = await buscarUser();
      if (user.pathImage) setProfileImage(`http://localhost:8080/files/images/${user.pathImage}`);
      setName(user.username);
      setEmail(user.email);
      setTelefone(user.telefone);
      setGenero(user.genero);
      setPais(user.pais);
      setCep(user.cep);
      setCidade(user.cidade);

      await carregarPaises();
      if (user.pais) await carregarCidades(user.pais);

      const receitasUsuario = await getReceitaByUserId(user.id);
      setReceitas(receitasUsuario);

      const receitasFavoritas = await getFavoritosByUserId(user.id);
      setFavoritos(receitasFavoritas);
    } catch (error) {
      console.error("Erro ao buscar usuário ou dados", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(()=>{
    console.log(imagemArquivo);
    
  }, [imagemArquivo])

  useEffect(() => {
    if (pais) carregarCidades(pais);
  }, [pais]);

  const handleSalvarPerfil = async () => {
    if (!name || !email || !telefone || !cidade || !pais || !genero || !cep) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const user = {
        username: name,
        email,
        telefone,
        cidade,
        genero,
        pais,
        cep,
      };

      const userUpt = await editarUsuario(JSON.stringify(user));
      await AsyncStorage.setItem("user", JSON.stringify(userUpt));
      handleSaveImage();
      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      alert(error?.response?.data?.error || "Erro ao editar!");
      console.error(error);
    }
  };

  const renderReceita = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation(`/receitas?idReceita=${item.id}`)}
    >
      <Text style={styles.itemTitle}>{item.titulo}</Text>
      <Text style={styles.itemDesc}>{item.descricao}</Text>
    </TouchableOpacity>
  );

  const renderFavorito = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation(`/receitas?idReceita=${item?.id}`)}
    >
      <Text style={styles.itemTitle}>{item?.titulo}</Text>
      <Text style={styles.itemDesc}>{item?.descricao}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LogoLink></LogoLink>
      <TouchableOpacity onPress={clicado}>
        <Image source={{ uri: profileImage }} style={styles.profileImage} />
      </TouchableOpacity>

      <Text style={styles.label}>Nome:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Digite seu nome"
      />

      <Text style={styles.label}>Telefone:</Text>
      <TextInput
        style={styles.input}
        value={telefone}
        onChangeText={setTelefone}
        placeholder="Digite seu telefone"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Gênero:</Text>
      <Picker
        selectedValue={genero}
        style={styles.input}
        onValueChange={setGenero}
      >
        <Picker.Item label="Selecione seu Gênero" value="" />
        <Picker.Item label="Masculino" value="masculino" />
        <Picker.Item label="Feminino" value="feminino" />
        <Picker.Item label="Outro" value="outro" />
      </Picker>

      <Text style={styles.label}>País:</Text>
      <Picker selectedValue={pais} style={styles.input} onValueChange={setPais}>
        <Picker.Item label="Selecione um país" value="" />
        {paises.map((item) => (
          <Picker.Item key={item} label={item} value={item} />
        ))}
      </Picker>

      <Text style={styles.label}>Cidade:</Text>
      <Picker
        selectedValue={cidade}
        style={styles.input}
        onValueChange={setCidade}
      >
        <Picker.Item label="Selecione uma cidade" value="" />
        {cidades.map((item) => (
          <Picker.Item key={item} label={item} value={item} />
        ))}
      </Picker>

      <Text style={styles.label}>CEP:</Text>
      <TextInput
        style={styles.input}
        value={cep}
        onChangeText={setCep}
        placeholder="Digite seu CEP"
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.editButton} onPress={handleSalvarPerfil}>
        <Text style={styles.editButtonText}>Salvar perfil</Text>
      </TouchableOpacity>

      {/* Minhas Receitas */}
      <Text style={styles.sectionTitle}>Minhas Receitas</Text>
      <View style={styles.scrollContainer}>
        <FlatList
          data={receitas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderReceita}
          nestedScrollEnabled
        />
      </View>

      {/* Favoritos */}
      <Text style={styles.sectionTitle}>Favoritos</Text>
      <View style={styles.scrollContainer}>
        <FlatList
          data={favoritos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderFavorito}
          nestedScrollEnabled
        />
      </View>
      <TouchableOpacity style={styles.editButton} onPress={logout}>
        <Text style={styles.editButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;

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
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#964B00",
  },
  label: {
    alignSelf: "flex-start",
    marginLeft: "10%",
    marginBottom: 5,
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  input: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  picker: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: "#964B00",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 15,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  editIcon: {
    paddingHorizontal: 10,
    justifyContent: "center",
  },
});
