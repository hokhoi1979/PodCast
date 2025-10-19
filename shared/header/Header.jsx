import { AntDesign, EvilIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import logo from "../../assests/logo.jpg";

export default function Header() {
  const navigation = useNavigation();

  const handleLogoPress = () => {
    // Thử navigate về Home hoặc về màn hình chính
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.leftSide}>
        <View>
          <TouchableOpacity onPress={handleLogoPress}>
            <Image source={logo} style={styles.logo} />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Healink</Text>
      </View>
      <View style={styles.rightSide}>
        <TouchableOpacity onPress={() => navigation.navigate("Search")}>
          <EvilIcons name="search" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
          <AntDesign name="shopping-cart" size={24} color="#604B3B" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Letter")}>
          <Ionicons name="mail-outline" size={24} color="#604B3B" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("FlashCard")}>
          <Ionicons name="albums-outline" size={24} color="#604B3B" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
  },
  leftSide: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 30,
    height: 30,
    borderRadius: 4,
    marginRight: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#604B3B",
  },
  rightSide: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
});
