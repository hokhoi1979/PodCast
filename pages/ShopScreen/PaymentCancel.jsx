import { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { cancelPayment } from "../../redux/User/cancelPayment/cancelPaymentSlice";

export default function PaymentCancel({ route, navigation }) {
  const dispatch = useDispatch();
  const { cancel, loading, error } = useSelector((state) => state.cancelPayos);
  const { orderId, orderCode } = route.params || {}; // 🟡 Nhận thêm orderCode

  const handleCancelPayment = () => {
    if (!orderCode) {
      Alert.alert("Lỗi", "Không tìm thấy mã giao dịch để hủy thanh toán.");
      return;
    }

    console.log("🟡 Gửi yêu cầu hủy PayOS với orderCode:", orderCode);
    dispatch(cancelPayment(orderCode));
  };

  // 🟢 Khi cancel thành công → về MainApp
  useEffect(() => {
    if (cancel && Object.keys(cancel).length > 0) {
      Alert.alert("Đã hủy thanh toán", "Bạn đã hủy đơn hàng thành công!", [
        { text: "OK", onPress: () => navigation.replace("MainApp") },
      ]);
    }
  }, [cancel]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assests/cancel.png")}
        style={styles.image}
      />
      <Text style={styles.title}>Thanh toán thất bại 😢</Text>
      <Text style={styles.text}>Mã đơn hàng: {orderId}</Text>
      <Text style={styles.text}>Mã giao dịch: {orderCode}</Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#4f46e5"
          style={{ marginTop: 20 }}
        />
      ) : (
        <>
          <TouchableOpacity style={styles.button} onPress={handleCancelPayment}>
            <Text style={styles.buttonText}>Hủy thanh toán</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#64748b" }]}
            onPress={() => navigation.navigate("Checkout")}
          >
            <Text style={styles.buttonText}>Thử lại</Text>
          </TouchableOpacity>
        </>
      )}

      {error && (
        <Text style={{ color: "red", marginTop: 10 }}>
          Lỗi: {error.message || "Hủy thất bại"}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  image: { width: 120, height: 120, marginBottom: 20 },
  title: { fontSize: 22, fontWeight: "700", color: "#dc2626" },
  text: { fontSize: 16, marginVertical: 4 },
  button: {
    marginTop: 20,
    backgroundColor: "#4f46e5",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
});
