import React from 'react';
import { View, Text, Button, Platform } from 'react-native';
import { Link } from 'react-router-native'; // Para a navegação na web com react-router-native

export default function Home({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Bem-vindo à Home!</Text>

      {Platform.OS === 'web' ? (
        // Para Web: Usando Link para navegação
        <>
          <Link to="/login">
            <Text style={{ color: 'blue' }}>Ir para Login</Text>
          </Link>
          <Link to="/cadastro">
            <Text style={{ color: 'blue' }}>Criar Conta</Text>
          </Link>
        </>
      ) : (
        // Para iOS/Android: Usando Button do React Navigation
        <>
          <Button title="Ir para Login" onPress={() => navigation.navigate('Login')} />
          <Button title="Criar Conta" onPress={() => navigation.navigate('Cadastro')} />
        </>
      )}
    </View>
  );
}
