import React, {useState} from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Linking, SafeAreaView } from 'react-native';
import StarRating from './components/Avalia';
import Comentarios from './components/coment';

const receita = {
  nome: 'Bolo de Chocolate',
  imagem: 'https://vovopalmirinha.com.br/wp-content/uploads/2016/05/bolo-chocolate-simples-1.jpg',
  descricao: 'Um delicioso bolo de chocolate fofinho!',
  ingredientes: ['2 xícaras de farinha', '1 xícara de açúcar', '1/2 xícara de cacau', '3 ovos', '1/2 xícara de óleo', '1 xícara de leite', '1 colher de fermento'],
  categoria: 'Sobremesa',
  preparo: 'Misture os ingredientes, asse por 40 minutos a 180°C.',
  rendimento: '10 porções',
  tempo: '45 minutos',
};

const autor = {
  nome: "Pessoa",
  imagem: "https://th.bing.com/th/id/OIP.Rqw5f6J3R0bxYCe3HnMflQAAAA?cb=iwc2&rs=1&pid=ImgDetMain",
};

const abrirLink = () =>{
  Linking.openURL('https://www.bing.com/?FORM=Z9FD1');
};

const Receita = () => {
  const [clicado, setClicado] = useState(false);
  const [avalia, setAvalia] = useState('');

  const favorito = () =>{
    setClicado(!clicado);
  };


  return (
    <SafeAreaView style={styles.container}>
    <ScrollView style={styles.scroll}>

      {/*Autor*/}
      <View style={styles.autor}>
      <Image source={{uri: autor.imagem}} style={styles.imagemAutor}/>
      <Text style={styles.boldAutor}>Autor: </Text>
      <Text style={styles.textoAutor}> {autor.nome}</Text>
      </View>

      {/* titulo*/}
      <Text style={styles.title}>{receita.nome}</Text>

      {/*imagem da receita*/}
      <Image source={{ uri: receita.imagem }} style={styles.imagemReceita} />

      {/*categoria*/}
      <View style={styles.cat}>
      <Text style={styles.bold}>Categoria: </Text>
      <TouchableOpacity onPress={abrirLink}>
        <Text style={styles.link}>
        {receita.categoria}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.gosto}>
      {/*Botão de avalização*/}
      <StarRating onRatingChange ={(estrela) => setAvalia(estrela)}/>

      {/*Botão de favorito*/}
      <TouchableOpacity onPress={favorito}>
      <Text style={clicado ? styles.selecionado : styles.nselecionado}>♥</Text>
      </TouchableOpacity>

      </View> 
      
      {/*descricao*/}
      <View style={styles.quadrado}>
        <Text style={styles.descricao}>{receita.descricao}</Text>
      </View>

       {/*tempo*/}
      <View style={styles.quadrado}>
       <Text style={styles.info}><Text style={styles.bold}>Tempo de preparo:</Text> {receita.tempo}</Text>
      </View>

      {/*igredientes*/}
      <View style={styles.quadrado}>
        <Text style={styles.subtitle}>Ingredientes:</Text>
        {receita.ingredientes.map((ingrediente, index) => (
          <Text key={index} style={styles.ingrediente}>• {ingrediente}</Text>
        ))}
      </View>

      {/*preparo*/}
      <View style={styles.quadrado}>
        <Text style={styles.info}><Text style={styles.bold}>Modo de preparo:</Text> {receita.preparo}</Text>
      </View>
      
      {/*rendimento*/}
      <View style={styles.quadrado}>
        <Text style={styles.info}><Text style={styles.bold}>Rendimento:</Text> {receita.rendimento}</Text>
      </View>

      {/*Campo de comentários*/}
      <View style={styles.coment}> <Comentarios largura={'95%'} corFundo={'#ebd1bc'}/> </View>

    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FFDAB9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 5,
  },
  imagemReceita: {
    width: 200,
    height: 200,
    borderRadius: 100, // Deixa a imagem circular
    resizeMode: 'cover',
    marginBottom: 10,
    alignSelf: 'center',
  },
  descricao: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  ingrediente: {
    fontSize: 16,
  },
  info: {
    fontSize: 16,
    marginTop: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
  quadrado:{
    backgroundColor: "white",
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 25,
    marginBottom: 10,
  },
  cat:{
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  link:{
    color: 'blue',
    fontWeight: '16',
  },
  scroll:{},
  imagemAutor:{
    width: 50,
    height: 50,
    borderRadius: 100,
  },
  autor:{
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 5,
    marginLeft: 5,
  },
  boldAutor:{
    fontWeight: 'bold',
    marginTop:15,
    marginLeft: 5,
  },
  textoAutor:{
    marginTop: 15,
  },
  selecionado:{
    color:'red',
    fontSize: 50,
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 }, 
    textShadowRadius: 2, 
  },
  nselecionado:{
    color: 'grey',
    fontSize: 50,
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  gosto:{
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
  },
  coment:{
    alignItems: 'center',
  },
});

export default Receita;