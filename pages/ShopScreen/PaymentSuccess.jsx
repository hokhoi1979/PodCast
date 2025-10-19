import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

export default function PaymentSuccess({ route, navigation }) {
  const { orderId } = route.params || {};
  const userId = useSelector((state) => state.auth?.user?.id);

  const handleTrackOrder = () => {
    navigation.navigate("TrackOrder", { userId });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assests/success.png")}
        style={styles.image}
      />

      <Text style={styles.title}>Thanh toán thành công 🎉</Text>
      <Text style={styles.subtitle}>Cảm ơn bạn đã mua hàng!</Text>
      <Text style={styles.text}>
        Mã đơn hàng: <Text style={styles.bold}>{orderId}</Text>
      </Text>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.primaryText}>Về trang chủ</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={handleTrackOrder}
      >
        <Text style={styles.secondaryText}>Theo dõi đơn hàng</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  image: {
    width: 140,
    height: 140,
    marginBottom: 25,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#16a34a",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 20,
  },
  text: {
    fontSize: 15,
    color: "#555",
    marginBottom: 30,
  },
  bold: {
    fontWeight: "700",
    color: "#111",
  },
  primaryButton: {
    backgroundColor: "#16a34a",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 40,
    width: "80%",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#16a34a",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  primaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    borderColor: "#16a34a",
    borderWidth: 1.5,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 40,
    width: "80%",
    alignItems: "center",
  },
  secondaryText: {
    color: "#16a34a",
    fontSize: 16,
    fontWeight: "600",
  },
});
