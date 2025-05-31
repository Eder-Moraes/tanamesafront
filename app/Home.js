import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { useLocation, useNavigate } from 'react-router-native';
import { getReceitas } from '../api/services/receitaService';
import { buscarUser } from '../utils/diversos';

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  const [receitas, setReceitas] = useState([]);
  const [todasReceitas, setTodasReceitas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('');
  const [perfil, setPerfil] = useState(null);
  const [autores, setAutores] = useState({});

  const filtros = [
    { nome: 'Lanches', img: require('../assets/lanche.jpeg') },
    { nome: 'Doces', img: require('../assets/brigadeiro.jpeg') },
    { nome: 'Frituras', img: require('../assets/Batata_frita.jpg') },
    { nome: 'Massas', img: require('../assets/macarrao.jpeg') },
  ];

  const fetchReceitas = async () => {
    try {
      const data = await getReceitas();
      setTodasReceitas(data);
      setReceitas(data);
    } catch (error) {
      alert(error?.response?.data?.error || "Erro ao buscar!");
      console.error(error);
    }
  };

  const perfilBuscar = async () => {
    try {
      const userData = await buscarUser();
      setPerfil(userData);
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    }
  };

  const handleSearch = () => {
    const filtro = todasReceitas.filter(r =>
      r.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setReceitas(filtro);
    setCategoriaAtiva('');
  };

  const handleCategoria = (nome) => {
    const filtro = todasReceitas.filter(r =>
      r.categoria?.toLowerCase() === nome.toLowerCase()
    );
    setReceitas(filtro);
    setCategoriaAtiva(nome);
    setSearchTerm('');
  };

  const limparFiltro = () => {
    setReceitas(todasReceitas);
    setSearchTerm('');
    setCategoriaAtiva('');
  };

  useEffect(() => {
    const carregar = async () => {
      await fetchReceitas();
      perfilBuscar();
    };
    carregar();
  }, []);

  useEffect(() => {
    if (todasReceitas.length > 0) {

      const params = new URLSearchParams(location.search);
      const busca = params.get('busca');
      const categoria = params.get('categoria');

      if (busca) {
        setSearchTerm(busca);
        handleSearch();
      } else if (categoria) {
        handleCategoria(categoria);
      }
    }
  }, [todasReceitas]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.nav}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <TextInput
          style={styles.procura}
          placeholder="Procure por sua receita"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <TouchableOpacity style={styles.botao} onPress={handleSearch}>
          <Text style={styles.botaoTexto}>Buscar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botao} onPress={limparFiltro}>
          <Text style={styles.botaoTexto}>Limpar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.botao, { backgroundColor: '#4CAF50', marginTop: 10 }]}
          onPress={() => navigate('/criar-receita')}
        >
          <Text style={styles.botaoTexto}>Criar Receita</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.perfilContainer}
          onPress={() => navigate('/perfil')}
          activeOpacity={0.7}
        >
          {perfil && perfil.pathImage ? (
            <Image
              source={{ uri: `http://localhost:8080/files/images/${perfil.pathImage}` }}
              style={styles.perfilImg}
            />
          ) : (
            <Image
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541' }}
              style={styles.perfilImg}
            />
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.titulo}>Tipos de receitas</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sessaoFiltro}>
        {filtros.map((f, i) => (
          <TouchableOpacity key={i} onPress={() => handleCategoria(f.nome)}>
            <View style={[styles.filtro, categoriaAtiva === f.nome && styles.filtroAtivo]}>
              <Image source={f.img} style={styles.filtroImg} />
              <Text style={styles.filtroTexto}>{f.nome}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.titulo}>Receitas</Text>
      <View style={styles.receitaContainer}>
        {receitas.map((r, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => navigate(`/receitas?idReceita=${r.id}`)}
            style={styles.receita}
          >
            <Image
              source={{ uri: `http://localhost:8080/files/images/${r.imagemUrl}` }}
              style={styles.receitaImg}
            />
            <Text style={styles.dificuldade}>Rendimento: {r.rendimento}</Text>
            <Text style={styles.tempo}>Tempo: {r.tempoPreparo}</Text>
            <Text style={styles.cozinheiro}>Autor: {r.nome_autor}</Text>
            <Text style={styles.prato}>{r.titulo}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F4BD37',
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 10,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginRight: 10,
  },
  procura: {
    flex: 1,
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
    minWidth: 120,
  },
  botao: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
  },
  botaoTexto: {
    color: 'white',
  },
  perfilContainer: {
    marginLeft: 10,
    marginTop: 10,
  },
  perfilImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  sessaoFiltro: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  filtro: {
    marginRight: 10,
    position: 'relative',
  },
  filtroAtivo: {
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 10,
  },
  filtroImg: {
    width: 180,
    height: 120,
    borderRadius: 10,
  },
  filtroTexto: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -10 }],
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  receitaContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  receita: {
    width: '48%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    overflow: 'hidden',
  },
  receitaImg: {
    width: '100%',
    height: 150,
  },
  dificuldade: {
    fontWeight: 'bold',
    padding: 5,
  },
  tempo: {
    paddingHorizontal: 5,
    fontStyle: 'italic',
  },
  cozinheiro: {
    paddingHorizontal: 5,
    fontFamily: 'serif',
  },
  prato: {
    paddingHorizontal: 5,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
});
