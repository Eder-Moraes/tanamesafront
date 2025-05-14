import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const ProfileScreen = () => {
  const [name, setName] = useState('João Silva');
  const [bio, setBio] = useState('Amante de tecnologia e café ☕🚀');
  const [profileImage, setProfileImage] = useState('https://i.pravatar.cc/300');

  const handleChoosePhoto = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 1 },
      function (response) {
        if (response.assets && response.assets.length > 0) {
          setProfileImage(response.assets[0].uri); // JavaScript normal aqui
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleChoosePhoto}>
        <Image
          source={{ uri: profileImage }}
          style={styles.profileImage}
        />
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

      <TouchableOpacity style={styles.editButton} onPress={handleChoosePhoto}>
        <Text style={styles.editButtonText}>Trocar Foto</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
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
});