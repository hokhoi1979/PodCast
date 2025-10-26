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
      {/* Cancel Animation */}
      <View style={styles.cancelContainer}>
        <View style={styles.iconContainer}>
          <Image
            source={require("../../assests/cancel.png")}
            style={styles.image}
          />
        </View>

        <Text style={styles.title}>Thanh toán thất bại</Text>
        <Text style={styles.subtitle}>
          Rất tiếc, giao dịch không thể hoàn thành. Vui lòng thử lại sau
        </Text>

        <View style={styles.orderInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mã đơn hàng:</Text>
            <Text style={styles.infoValue}>#{orderId}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mã giao dịch:</Text>
            <Text style={styles.infoValue}>{orderCode}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Trạng thái:</Text>
            <Text style={styles.statusValue}>Thất bại</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ef4444" />
            <Text style={styles.loadingText}>Đang xử lý...</Text>
          </View>
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
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {error.message || "Không thể hủy thanh toán. Vui lòng thử lại."}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fef2f2",
  },
  cancelContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#fee2e2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    shadowColor: "#ef4444",
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
    color: "#ef4444",
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
    color: "#ef4444",
  },
  buttonContainer: {
    paddingHorizontal: 32,
    paddingVertical: 24,
    paddingBottom: 40,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6b7280",
  },
  primaryButton: {
    backgroundColor: "#ef4444",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#ef4444",
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
    borderColor: "#6b7280",
    borderWidth: 2,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  secondaryText: {
    color: "#374151",
    fontSize: 18,
    fontWeight: "700",
  },
  errorContainer: {
    backgroundColor: "#fef2f2",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#ef4444",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
