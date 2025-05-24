import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const StarRating = ({onRatingChange}) =>{
  const [rating, setRating] = useState(0);

const mandaAva = (estrelas) =>{
  setRating(estrelas);
  onRatingChange(estrelas);
};

  const renderStars = () =>{
    let stars = [];

    for(let i = 1; i <= 5; i++){
      stars.push(<TouchableOpacity key={i}
      onPress={() => mandaAva(i)}>
      <Text style={i <= rating ? styles.starSelected: styles.starUnselected}>
      ★
      </Text>
      </TouchableOpacity>
      );
    }
    return stars;
  };

  return(
    <View style={styles.container}>
    <View style={styles.starContainer}>{renderStars()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container:{
    alignItems: 'center',
    padding: 20,
  },
  starContainer:{
    flexDirection:'row',
    textShadowColor: 'black', // Cor do contorno
    textShadowOffset: { width: 1, height: 1 }, // Pequena sombra
    textShadowRadius: 2, // Suaviza o contorno
  },
  starSelected:{
    fontSize:40,
    color:'gold',
    marginHorizontal: 5,
    flexDirection:'row',
  },
  starUnselected:{
    fontSize:40,
    color:'gray',
    marginHorizontal: 5,
    flexDirection:'row',
    
  },
});

export default StarRating;