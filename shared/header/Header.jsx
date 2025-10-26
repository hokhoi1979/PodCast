import { AntDesign, EvilIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import logo from "../../assests/logo.jpg";

export default function Header() {
  const navigation = useNavigation();

  // Lấy dữ liệu cart từ Redux store
  const { cart } = useSelector((state) => state.cart);
  const cartItemsCount = cart?.items?.length || 0;

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
        <TouchableOpacity
          onPress={() => navigation.navigate("Cart")}
          style={styles.cartContainer}
        >
          <AntDesign name="shopping-cart" size={24} color="#604B3B" />
          {cartItemsCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>
                {cartItemsCount > 99 ? "99+" : cartItemsCount}
              </Text>
            </View>
          )}
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
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  leftSide: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 50,
    height: 30,
    borderRadius: 4,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#604B3B",
  },
  rightSide: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  cartContainer: {
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#facc15",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
});
