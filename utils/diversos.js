import AsyncStorage from "@react-native-async-storage/async-storage";

export const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

export const buscarUser = async () => {
    const userString = await AsyncStorage.getItem("user");
    const userToken = JSON.parse(userString);
    return userToken;
  };