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
  const { orderId, orderCode } = route.params || {};

  const handleCancelPayment = () => {
    if (!orderCode) {
      Alert.alert("Lỗi", "Không tìm thấy mã giao dịch để hủy thanh toán.");
      return;
    }
    dispatch(cancelPayment(orderCode));
  };

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
      <Text style={styles.subtitle}>Rất tiếc, giao dịch không thành công</Text>
      <Text style={styles.text}>
        Mã đơn hàng: <Text style={styles.bold}>{orderId}</Text>
      </Text>
      <Text style={styles.text}>
        Mã giao dịch: <Text style={styles.bold}>{orderCode}</Text>
      </Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#dc2626"
          style={{ marginTop: 25 }}
        />
      ) : (
        <>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleCancelPayment}
          >
            <Text style={styles.primaryText}>Hủy thanh toán</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("Checkout")}
          >
            <Text style={styles.secondaryText}>Thử lại</Text>
          </TouchableOpacity>
        </>
      )}

      {error && (
        <Text style={styles.errorText}>
          {error.message || "Không thể hủy thanh toán. Vui lòng thử lại."}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FEF2F2",
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
    color: "#dc2626",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: "#991b1b",
    marginBottom: 20,
  },
  text: {
    fontSize: 15,
    color: "#444",
    marginBottom: 4,
  },
  bold: {
    fontWeight: "700",
    color: "#111",
  },
  primaryButton: {
    backgroundColor: "#dc2626",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 40,
    width: "80%",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 10,
    shadowColor: "#dc2626",
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
    borderColor: "#6b7280",
    borderWidth: 1.5,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 40,
    width: "80%",
    alignItems: "center",
  },
  secondaryText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "#dc2626",
    marginTop: 15,
    textAlign: "center",
  },
});
