import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrder } from "../../redux/User/fetchOrder/getAllOrderSlice";
import { getAllOrderItem } from "../../redux/User/fetchOrderItem/getAllOrderItemSlice";
import {
  createPayosRequest,
  resetPayos,
} from "../../redux/User/payos/createPayosSlice";

export default function CheckoutScreen({ navigation }) {
  const dispatch = useDispatch();
  const route = useRoute();
  const { id } = route.params || {};

  // Redux store
  const { order, loading, error } = useSelector((state) => state.order);
  const { orderItem, loading: itemLoading } = useSelector(
    (state) => state.orderItem
  );
  const { profile } = useSelector((state) => state.getProfile);
  const { payosUrl, loading: payosLoading } = useSelector(
    (state) => state.createPayos
  );

  const orderCode = useSelector((state) => state.createPayos.orderCode);

  // Local state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showWebView, setShowWebView] = useState(false);

  // Fetch order
  useEffect(() => {
    if (id) dispatch(getAllOrder(id));
  }, [dispatch, id]);

  // Khi có link PayOS → hiển thị WebView
  useEffect(() => {
    if (payosUrl) {
      setShowWebView(true);
    }
  }, [payosUrl]);

  // Xử lý điều hướng trong WebView
  const handleWebViewNavigation = (event) => {
    const { url } = event;
    if (url.includes("payment-success")) {
      setShowWebView(false);
      dispatch(resetPayos());
      navigation.replace("PaymentSuccess", { orderId: id });
    }
    if (url.includes("payment-cancel")) {
      setShowWebView(false);
      navigation.replace("PaymentCancel", {
        orderId: id,
        orderCode: orderCode, // ✅ lấy đúng orderCode từ Redux PayOS
      });
      dispatch(resetPayos());
    }
  };

  // Gọi API tạo link thanh toán
  const handlePay = () => {
    dispatch(createPayosRequest(id));
  };

  const totalAmount = order?.totalAmount || 0;

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const handleViewDetail = (itemId) => {
    dispatch(getAllOrderItem(itemId));
    setIsModalVisible(true);
  };

  // Khi mở link thanh toán PayOS
  if (showWebView && payosUrl) {
    return (
      <WebView
        source={{ uri: payosUrl }}
        onNavigationStateChange={handleWebViewNavigation}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#facc15" />
          </View>
        )}
      />
    );
  }

  // Trang Checkout gốc
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🧾 Thanh toán</Text>

      {loading && <ActivityIndicator size="large" color="#facc15" />}
      {error && <Text style={styles.error}>Lỗi: {error}</Text>}

      {!loading && order && order.id ? (
        <>
          {/* Thông tin giao hàng */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin giao hàng</Text>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                👤 Họ tên: {order.user?.fullName || "Không có"}
              </Text>
              <Text style={styles.infoText}>
                ✉️ Email: {order.user?.email || "Không có"}
              </Text>
              <Text style={styles.infoText}>
                📞 Số điện thoại: {profile.phoneNumber}
              </Text>
            </View>
          </View>

          {/* Danh sách sản phẩm */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Giỏ hàng của bạn</Text>

            {order.items?.map((item) => (
              <View key={item.id} style={styles.itemCard}>
                <Image
                  source={{
                    uri:
                      item.product?.imageUrl ||
                      "https://via.placeholder.com/100",
                  }}
                  style={styles.itemImage}
                />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.product?.name}</Text>
                  <Text style={styles.itemPrice}>
                    Giá: {formatPrice(item.product?.price || 0)}
                  </Text>
                  <Text style={styles.itemQuantity}>
                    Số lượng: {item.quantity}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleViewDetail(item.id)}
                  style={styles.eyeBtn}
                >
                  <Ionicons name="eye" size={22} color="#4f46e5" />
                </TouchableOpacity>
              </View>
            ))}

            {/* Tổng cộng */}
            <View style={styles.totalBox}>
              <Text style={styles.totalText}>
                Tạm tính: {formatPrice(totalAmount)}
              </Text>
              <Text style={styles.totalText}>
                Phí vận chuyển: {formatPrice(15000)}
              </Text>
              <Text style={styles.totalAmount}>
                Tổng cộng: {formatPrice(totalAmount + 15000)}
              </Text>
            </View>

            {/* Nút thanh toán */}
            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={handlePay}
              disabled={payosLoading}
            >
              <Image
                source={require("../../assests/payos.png")}
                style={{ width: 80, height: 25, resizeMode: "contain" }}
              />
              <Text style={styles.checkoutText}>
                {payosLoading ? "Đang tạo liên kết..." : "Thanh toán qua PayOS"}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        !loading && <Text style={styles.emptyText}>Không có đơn hàng nào.</Text>
      )}

      {/* Modal chi tiết sản phẩm */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {itemLoading ? (
              <ActivityIndicator size="large" color="#facc15" />
            ) : orderItem ? (
              <>
                <Image
                  source={{
                    uri:
                      orderItem.product?.imageUrl ||
                      "https://via.placeholder.com/150",
                  }}
                  style={styles.modalImage}
                />
                <Text style={styles.modalTitle}>
                  {orderItem.product?.name || "Sản phẩm"}
                </Text>
                <Text style={styles.modalDesc}>
                  {orderItem.product?.description || "Không có mô tả."}
                </Text>
                <Text style={styles.modalPrice}>
                  Giá: {formatPrice(orderItem.product?.price || 0)}
                </Text>
                <Text style={styles.modalQty}>
                  Số lượng: {orderItem.quantity}
                </Text>
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setIsModalVisible(false)}
                >
                  <Text style={styles.closeText}>Đóng</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text>Không có dữ liệu chi tiết.</Text>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1e293b",
    marginVertical: 20,
  },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#1e293b" },
  infoBox: {
    backgroundColor: "#fef9c3",
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  infoText: { fontSize: 14, color: "#334155", marginBottom: 4 },
  itemCard: {
    flexDirection: "row",
    backgroundColor: "#fefce8",
    borderRadius: 12,
    padding: 10,
    marginVertical: 6,
    alignItems: "center",
  },
  itemImage: { width: 60, height: 60, borderRadius: 10 },
  itemInfo: { flex: 1, marginLeft: 10 },
  itemName: { fontWeight: "600", color: "#1e293b" },
  itemPrice: { color: "#475569" },
  itemQuantity: { color: "#475569" },
  eyeBtn: { padding: 6 },
  totalBox: {
    marginTop: 16,
    backgroundColor: "#fff7ed",
    padding: 14,
    borderRadius: 12,
  },
  totalText: { color: "#475569", fontSize: 14 },
  totalAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ca8a04",
    marginTop: 8,
  },
  checkoutBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4f46e5",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  checkoutText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  emptyText: {
    textAlign: "center",
    color: "#64748b",
    marginTop: 40,
    fontStyle: "italic",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  modalImage: { width: 120, height: 120, borderRadius: 12, marginBottom: 10 },
  modalTitle: { fontWeight: "700", fontSize: 18, color: "#1e293b" },
  modalDesc: { textAlign: "center", color: "#475569", marginVertical: 6 },
  modalPrice: { color: "#ca8a04", fontWeight: "600" },
  modalQty: { color: "#334155" },
  closeBtn: {
    marginTop: 14,
    backgroundColor: "#facc15",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  closeText: { color: "#fff", fontWeight: "600" },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
});
