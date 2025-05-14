import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Pressable,
  CheckBox,
  TouchableOpacity
} from 'react-native';
import { useNavigate } from 'react-router-native';

const ReceitaScreen = () => {
  const [search, setSearch] = useState('');
  const [filtros, setFiltros] = useState({
    Massas: false,
    Frituras: false,
    Assados: false,
    Marinado: false,
    vapor: false,
    Facil: false,
    Doce: false,
  });

  const navigate = useNavigate();

  const toggleFiltro = (nome) => {
    setFiltros({ ...filtros, [nome]: !filtros[nome] });
  };

  const redirecionar = (url) => {
    navigate("/login");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Barra de busca */}
      <View style={styles.nav}>
        <TextInput
          style={styles.procura}
          placeholder="Procure por sua receita"
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#333"
        />
        <TouchableOpacity style={styles.icone}>
                <Text style={styles.iconeText}>Buscar</Text>
              </TouchableOpacity>
        <TouchableOpacity style={styles.icone} onPress={() => redirecionar("/login")}>
                <Text style={styles.iconeText}>Conta</Text>
              </TouchableOpacity>
      </View>

      {/* Filtros */}
      <View style={styles.main}>
        <View style={styles.filtros}>
          <Text style={styles.titulo}>Filtros</Text>
          <View style={styles.checkboxContainer}>
            {Object.entries(filtros).map(([key, value]) => (
              <View key={key} style={styles.tipos}>
                <CheckBox value={value} onValueChange={() => toggleFiltro(key)} />
                <Text style={styles.label}>{key}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Receita */}
        <View style={styles.receitas}>
          <Image
            source={require("../assets/Batata_frita.jpg")}
            style={styles.receitaImagem}
          />
          <View style={styles.info}>
            <TouchableOpacity><Text style={styles.linkReceita}>(Nome da receita)</Text></TouchableOpacity>
            <Text>(Tempo de preparo)</Text>
            <Text>(Autor da receita)</Text>
          </View>
          <View style={styles.tags}>
            <Text style={styles.tag}>Frito</Text>
            <Text style={styles.tag}>Fácil</Text>
            <Text style={styles.tag}>Rápido</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F4BD37',
    padding: 16,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 10,
  },
  procura: {
    flexGrow: 1,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 25,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  icone: {
    textDecorationStyle: 'solid',
    backgroundColor: '#7e3127',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginLeft: 10,
  },
  iconeText: {
    color: '#fff',
    fontSize: 16,
  },
  main: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filtros: {
    backgroundColor: '#7e3127',
    borderRadius: 16,
    padding: 12,
    width: '100%',
    maxWidth: 220,
    marginRight: 16,
  },
  titulo: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 12,
  },
  checkboxContainer: {
    flexDirection: 'column',
  },
  tipos: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginLeft: 8,
    color: '#fff',
  },
  receitas: {
    backgroundColor: '#7e3127',
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
    flex: 1,
  },
  receitaImagem: {
    width: 224,
    height: 160,
    borderRadius: 8,
  },
  info: {
    marginHorizontal: 16,
    flex: 1,
  },
  linkReceita: {
    color: '#b4b4b4',
    textDecorationLine: 'underline',
    marginBottom: 8,
  },
  tags: {
    flexDirection: 'column',
    gap: 8,
  },
  tag: {
    backgroundColor: '#000',
    color: '#fff',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    textAlign: 'center',
    marginBottom: 6,
  },
});

export default ReceitaScreen;