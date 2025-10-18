import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

export default function PaymentSuccess({ route, navigation }) {
  const { orderId } = route.params || {};
  const userId = useSelector((state) => state.auth?.user?.id);

  const handleTrackOrder = () => {
    console.log("➡ ProfileScreen userId:", userId);
    navigation.navigate("TrackOrder", { userId });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assests/success.png")}
        style={styles.image}
      />
      <Text style={styles.title}>Thanh toán thành công 🎉</Text>
      <Text style={styles.text}>Mã đơn hàng: {orderId}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.buttonText}>Về trang chủ</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.trackButton} onPress={handleTrackOrder}>
        <Text style={styles.trackText}>Theo dõi đơn hàng</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: { width: 120, height: 120, marginBottom: 20 },
  title: { fontSize: 22, fontWeight: "700", color: "#16a34a" },
  text: { fontSize: 16, marginVertical: 10 },
  button: {
    marginTop: 20,
    backgroundColor: "#4f46e5",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  trackButton: {
    backgroundColor: "#8B4513",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 180,
    marginBottom: 12,
  },
  trackText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
