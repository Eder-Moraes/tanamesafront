import { View, TouchableOpacity, Image } from "react-native";
import { useNavigate } from "react-router-native";

export default function LogoLink() {
  const navigate = useNavigate();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigate("/")}>
        <Image
          source={require("../../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Barra separadora */}
      <View style={styles.separator} />
    </View>
  );
}

const styles = {
  container: {
    alignItems: "center",
    marginVertical: 16,
  },
  logo: {
    width: 150,
    height: 80,
  },
  separator: {
    marginTop: 16,
    borderBottomColor: "#964B00",
    borderBottomWidth: 1,
    alignSelf: "stretch", // faz a barra ocupar toda a largura disponível
    marginHorizontal: 20, // margem lateral da barra
  },
};

