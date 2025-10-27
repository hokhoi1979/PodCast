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
      {/* Success Animation */}
      <View style={styles.successContainer}>
        <View style={styles.iconContainer}>
          <Image
            source={require("../../assests/success.png")}
            style={styles.image}
          />
        </View>

        <Text style={styles.title}>Thanh toán thành công!</Text>
        <Text style={styles.subtitle}>
          Cảm ơn bạn đã tin tưởng và mua hàng tại cửa hàng của chúng tôi
        </Text>

        <View style={styles.orderInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mã đơn hàng:</Text>
            <Text style={styles.infoValue}>#{orderId}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Trạng thái:</Text>
            <Text style={styles.statusValue}>Đã thanh toán</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("MainApp")}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0fdf4",
  },
  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#dcfce7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    shadowColor: "#16a34a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  image: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#16a34a",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#374151",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  orderInfo: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },
  statusValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#16a34a",
  },
  buttonContainer: {
    paddingHorizontal: 32,
    paddingVertical: 24,
    paddingBottom: 40,
  },
  primaryButton: {
    backgroundColor: "#16a34a",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#16a34a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  secondaryButton: {
    borderColor: "#16a34a",
    borderWidth: 2,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  secondaryText: {
    color: "#16a34a",
    fontSize: 18,
    fontWeight: "700",
  },
});
