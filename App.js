import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import CadastroScreen from './telas/Cadastro.js';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './telas/login.js';
import { UserProvider } from './context/userContext.js';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <UserProvider>
      <Stack.Navigator initialRouteName="cadastro">
        <Stack.Screen name="cadastro" component={CadastroScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="login" component={LoginScreen} options={{ headerShown: false }}/>
      </Stack.Navigator>
      </UserProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
