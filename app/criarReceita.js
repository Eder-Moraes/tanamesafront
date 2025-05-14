import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, Button, SafeAreaView } from 'react-native';

export default function CriarReceita() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [ingredientes, setIngredientes] = useState('');
  const [preparo, setPreparo] = useState('');
  const [rendimento, setRendimento] = useState('');
  const [tempo, setTempo] = useState('');
  const [categoria, setCategoria] = useState('');

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Criar Receita</Text>

        <Text style={styles.label}>Título da receita</Text>
        <TextInput
          style={styles.inputLongo}
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Ex: Bolo de Laranja com Calda"
        />

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={styles.textarea}
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Breve descrição da receita..."
          multiline
        />

        <Text style={styles.label}>Ingredientes</Text>
        <TextInput
          style={styles.textarea}
          value={ingredientes}
          onChangeText={setIngredientes}
          placeholder="Ex: 2 xícaras de farinha, 1 ovo..."
          multiline
        />

        <Text style={styles.label}>Modo de Preparo</Text>
        <TextInput
          style={styles.textarea}
          value={preparo}
          onChangeText={setPreparo}
          placeholder="Passo a passo da Receita..."
          multiline
        />

        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Rendimento</Text>
            <TextInput
              style={styles.input}
              value={rendimento}
              onChangeText={setRendimento}
              placeholder="Ex: 8 porções"
            />
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Tempo de Preparo</Text>
            <TextInput
              style={styles.input}
              value={tempo}
              onChangeText={setTempo}
              placeholder="Ex: 40 minutos"
            />
          </View>
        </View>

        <Text style={styles.label}>Categoria</Text>
        <TextInput
          style={styles.input}
          value={categoria}
          onChangeText={setCategoria}
          placeholder="Ex: Doce, Salgado, Assado..."
        />

        <View style={styles.buttonContainer}>
          <Button title="Salvar receita" color="green" onPress={() => alert('Receita salva!')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F4BD37',
    flex: 1,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  inputLongo: {
    borderWidth: 1,
    borderColor: '#ccc',
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#ccc',
    height: 100,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  col: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: 30,
    borderRadius: 10,
    overflow: 'hidden',
  },
});