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
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const ProfileScreen = () => {
  const [name, setName] = useState('João Silva');
  const [bio, setBio] = useState('Amante de tecnologia e café ☕🚀');
  const [profileImage, setProfileImage] = useState('https://i.pravatar.cc/300');

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

      <Text style={styles.label}>Bio:</Text>
      <TextInput
        style={[styles.input, styles.bioInput]}
        value={bio}
        onChangeText={setBio}
        placeholder="Fale sobre você"
        multiline
      />

      <TouchableOpacity style={styles.editButton} onaPress={() => alert('Perfil atualizado!')}>
        <Text style={styles.editButtonText}>salvar perfil</Text>
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
          <Text style={styles.tableCellHeader}>Ação</Text>
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
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#4CAF50',
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
  bioInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  editButton: {
    backgroundColor: '#4CAF50',
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
    color: '#4CAF50',
    textDecorationLine: 'underline',
  },
});
