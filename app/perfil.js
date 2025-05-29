import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Linking,
  ScrollView,
  Picker,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { editarUsuario } from '../api/services/userService';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cidade, setCidade] = useState('');
  const [genero, setGenero] = useState('');
  const [pais, setPais] = useState('');
  const [cep, setCep] = useState('');
  const [profileImage, setProfileImage] = useState('https://i.pinimg.com/236x/21/9e/ae/219eaea67aafa864db091919ce3f5d82.jpg');

  const handleChoosePhoto = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 1 },
      (response) => {
        if (response.assets && response.assets.length > 0) {
          setProfileImage(response.assets[0].uri);
        }
      }
    );
  };

  const receitas = [
    {
      id: 1,
      nome: 'Bolo de Cenoura',
      tempo: '45 min',
      dificuldade: 'Fácil',
      link: 'https://www.tudogostoso.com.br/receita/62544-bolo-de-cenoura.html',
    },
    {
      id: 2,
      nome: 'Feijoada',
      tempo: '2h',
      dificuldade: 'Difícil',
      link: 'https://www.tudogostoso.com.br/receita/8761-feijoada.html',
    },
    {
      id: 3,
      nome: 'Panqueca Fit',
      tempo: '20 min',
      dificuldade: 'Normal',
      link: 'https://www.tudogostoso.com.br/receita/179648-panqueca-fit.html',
    },
  ];
  const handleSalvarPerfil = async () => {
    if (
      !name ||
      !email ||
      !telefone ||
      !cidade ||
      !pais ||
      !genero ||
      !cep
    ) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const user = {
        name,
        email,
        telefone,
        cidade,
        genero,
        pais,
        cep,
      };

      const data = await editarUsuario(JSON.stringify(user));
      console.log(data);

      limparCampos();
      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      alert(error?.response?.data?.error || "Erro ao registrar!");
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={handleChoosePhoto}>
        <Image source={{ uri: profileImage }} style={styles.profileImage} />
      </TouchableOpacity>

      <Text style={styles.label}>Nome:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Digite seu nome"
      />

      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Digite seu email"
      />

      <Text style={styles.label}>Telefone:</Text>
      <TextInput
        style={styles.input}
        value={telefone}
        onChangeText={setTelefone}
        placeholder="Digite seu telefone"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Cidade:</Text>
      <TextInput
        style={styles.input}
        value={cidade}
        onChangeText={setCidade}
        placeholder="Digite sua cidade"
      />
      <Text style={styles.label}>Gênero:</Text>
      <Picker
        selectedValue={genero}
        style={styles.picker}
        onValueChange={(itemValue) => setGenero(itemValue)}
      >
        <Picker.Item label="Selecione seu Gênero" value="" />
        <Picker.Item label="Masculino" value="masculino" />
        <Picker.Item label="Feminino" value="feminino" />
        <Picker.Item label="Outro" value="outro" />
      </Picker>

      <Text style={styles.label}>País:</Text>
      <TextInput
        style={styles.input}
        value={pais}
        onChangeText={setPais}
        placeholder="Digite seu país"
      />

      <Text style={styles.label}>Cep:</Text>
      <TextInput
        style={styles.input}
        value={cep}
        onChangeText={setCep}
        placeholder="Digite seu CEP"
        keyboardType="numeric"
      />


      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editButtonText}>Salvar perfil</Text>
      </TouchableOpacity>

      {/* TABELA DE RECEITAS */}
      <Text style={[styles.label, { marginTop: 30, textAlign: 'center' }]}>
        Minhas Receitas:
      </Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCellHeader}>Nome</Text>
          <Text style={styles.tableCellHeader}>Tempo</Text>
          <Text style={styles.tableCellHeader}>Dificuldade</Text>
          <Text style={styles.tableCellHeader}>Visualizar</Text>
          <Text style={styles.tableCellHeader}>Editar</Text>
        </View>

        {receitas.map((item) => (
          <View key={item.id} style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.nome}</Text>
            <Text style={styles.tableCell}>{item.tempo}</Text>
            <Text style={styles.tableCell}>{item.dificuldade}</Text>
            <Text
              style={[styles.tableCell, styles.link]}
              onPress={() => Linking.openURL(item.link)}
            >
              Ver
            </Text>
            <Text
              style={[styles.tableCell, styles.link]}
              onPress={() => alert(`Editar receita: ${item.nome}`)}
            >Editar
            </Text>
          </View>
        ))}

        {/* TABELA DE FAVORITAS */}
        <Text style={[styles.label, { marginTop: 30, textAlign: 'center' }]}>
          Favoritas:
        </Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCellHeader}>Nome</Text>
            <Text style={styles.tableCellHeader}>Tempo</Text>
            <Text style={styles.tableCellHeader}>Dificuldade</Text>
            <Text style={styles.tableCellHeader}>Visualizar</Text>
          </View>

          {receitas.map((item) => (
            <View key={`favorita-${item.id}`} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.nome}</Text>
              <Text style={styles.tableCell}>{item.tempo}</Text>
              <Text style={styles.tableCell}>{item.dificuldade}</Text>
              <Text
                style={[styles.tableCell, styles.link]}
                onPress={() => Linking.openURL(item.link)}
              >
                Ver
              </Text>
            </View>
          ))}
        </View>

      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F4BD37',
    alignItems: 'center',
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#964B00',
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: '10%',
    marginBottom: 5,
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  input: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },

  picker: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  bioInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  editButton: {
    backgroundColor: '#964B00',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 15,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  table: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  tableHeader: {
    backgroundColor: '#e0e0e0',
  },
  tableCell: {
    flex: 1,
    padding: 10,
    fontSize: 14,
    textAlign: 'center',
  },
  tableCellHeader: {
    flex: 1,
    padding: 10,
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  link: {
    color: '#964B00',
    textDecorationLine: 'underline',
  },
});
