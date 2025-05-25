import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const StarRating = ({ onRatingChange }) => {
  const [rating, setRating] = useState(0);

  const mandaAva = (estrelas) => {
    setRating(estrelas);
    onRatingChange(estrelas);
  };

  return (
    <View style={styles.container}>
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((i) => (
          <TouchableOpacity key={i} onPress={() => mandaAva(i)}>
            <Text
              style={i <= rating ? styles.starSelected : styles.starUnselected}
            >
              {"★"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
  starContainer: {
    flexDirection: "row",
  },
  starSelected: {
    fontSize: 40,
    color: "gold",
    marginHorizontal: 5,
    textShadow: "1px 1px 2px black",
  },
  starUnselected: {
    fontSize: 40,
    color: "gray",
    marginHorizontal: 5,
    textShadow: "1px 1px 2px black",
  },
});

export default StarRating;
