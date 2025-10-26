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
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { WebView } from "react-native-webview";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrder } from "../../redux/User/fetchOrder/getAllOrderSlice";
import { getAllOrderItem } from "../../redux/User/fetchOrderItem/getAllOrderItemSlice";
import {
  createPayosRequest,
  resetPayos,
} from "../../redux/User/payos/createPayosSlice";
import { getProfile } from "../../redux/User/profile/getProfileSlice";
import { updateAddress } from "../../redux/User/updateAddress/updateAddressSlice";

export default function CheckoutScreen({ navigation }) {
  const dispatch = useDispatch();
  const route = useRoute();
  const { id } = route.params || {};

  const { order, loading, error } = useSelector((state) => state.order);
  const { orderItem, loading: itemLoading } = useSelector(
    (state) => state.orderItem
  );
  const userId = useSelector((state) => state.auth?.user?.id);
  const { profile } = useSelector((state) => state.getProfile);
  const { payosUrl, loading: payosLoading } = useSelector(
    (state) => state.createPayos
  );
  const { loading: addressLoading } = useSelector(
    (state) => state.updateAddress
  );

  const orderCode = useSelector((state) => state.createPayos.orderCode);

  // Local state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showWebView, setShowWebView] = useState(false);
  const [isAddressModal, setIsAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState("");

  // Fetch order
  useEffect(() => {
    if (id) dispatch(getAllOrder(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (userId && !profile) {
      dispatch(getProfile(userId));
    }
  }, [userId, dispatch]);

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
        orderCode: orderCode,
      });
      dispatch(resetPayos());
    }
  };

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

  // ✅ Xử lý cập nhật địa chỉ
  const handleUpdateAddress = () => {
    if (!newAddress.trim()) return;
    dispatch(updateAddress({ id, address: newAddress }));
    Toast.show({
      type: "success",
      text1: "Cập nhật địa chỉ thành công",
    });
    setIsAddressModal(false);
  };

  // Nếu có link thanh toán → mở WebView
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

  // ✅ Giao diện chính
  return (
    <View style={styles.container}>
      {/* Header với gradient */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.navigate("MainApp")}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
          <Text style={styles.backText}>Quay về trang chủ</Text>
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>🧾 Thanh toán</Text>
          <Text style={styles.subtitle}>Đơn hàng #{order?.id || "N/A"}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#facc15" />
            <Text style={styles.loadingText}>
              Đang tải thông tin đơn hàng...
            </Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={48} color="#ef4444" />
            <Text style={styles.errorText}>Lỗi: {error}</Text>
          </View>
        )}

        {!loading && order && order.id ? (
          <>
            {/* Thông tin giao hàng */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="location" size={24} color="#facc15" />
                <Text style={styles.sectionTitle}>Thông tin giao hàng</Text>
              </View>

              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Ionicons name="person" size={20} color="#6b7280" />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Họ tên</Text>
                    <Text style={styles.infoValue}>
                      {order.user?.fullName || "Không có"}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="mail" size={20} color="#6b7280" />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Email</Text>
                    <Text style={styles.infoValue}>
                      {order.user?.email || "Không có"}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="call" size={20} color="#6b7280" />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Số điện thoại</Text>
                    <Text style={styles.infoValue}>
                      {profile?.phoneNumber || "Không có"}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="home" size={20} color="#6b7280" />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Địa chỉ giao hàng</Text>
                    <Text style={styles.infoValue}>
                      {order.address || "Chưa có địa chỉ giao hàng"}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => setIsAddressModal(true)}
                >
                  <Ionicons name="create" size={18} color="#fff" />
                  <Text style={styles.editText}>Cập nhật địa chỉ</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Danh sách sản phẩm */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="bag" size={24} color="#facc15" />
                <Text style={styles.sectionTitle}>Đơn hàng của bạn</Text>
              </View>

              <View style={styles.itemsContainer}>
                {order.items?.map((item, index) => (
                  <View
                    key={item.id}
                    style={[
                      styles.itemCard,
                      { marginTop: index === 0 ? 0 : 16 },
                    ]}
                  >
                    <Image
                      source={{
                        uri:
                          item.product?.imageUrl ||
                          "https://via.placeholder.com/100",
                      }}
                      style={styles.itemImage}
                    />

                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName} numberOfLines={2}>
                        {item.product?.name}
                      </Text>
                      <Text style={styles.itemPrice}>
                        {formatPrice(item.product?.price || 0)}
                      </Text>
                      <Text style={styles.itemQuantity}>
                        Số lượng: {item.quantity}
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => handleViewDetail(item.id)}
                      style={styles.detailBtn}
                    >
                      <Ionicons name="eye" size={20} color="#facc15" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              {/* Tổng cộng */}
              <View style={styles.summaryCard}>
                <View style={styles.summaryHeader}>
                  <Ionicons name="receipt" size={24} color="#facc15" />
                  <Text style={styles.summaryTitle}>Tóm tắt thanh toán</Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Tạm tính:</Text>
                  <Text style={styles.summaryValue}>
                    {formatPrice(totalAmount)}
                  </Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Phí vận chuyển:</Text>
                  <Text style={styles.summaryValue}>Miễn phí</Text>
                </View>

                <View style={styles.summaryDivider} />

                <View style={styles.summaryRow}>
                  <Text style={styles.totalLabel}>Tổng cộng:</Text>
                  <Text style={styles.totalValue}>
                    {formatPrice(totalAmount)}
                  </Text>
                </View>
              </View>

              {/* Thanh toán */}
              <TouchableOpacity
                style={[
                  styles.paymentBtn,
                  payosLoading && styles.paymentBtnDisabled,
                ]}
                onPress={handlePay}
                disabled={payosLoading}
              >
                {payosLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Image
                    source={require("../../assests/payos.png")}
                    style={styles.payosLogo}
                  />
                )}
                <Text style={styles.paymentText}>
                  {payosLoading
                    ? "Đang tạo liên kết..."
                    : "Thanh toán qua PayOS"}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          !loading && (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIcon}>
                <Ionicons name="receipt-outline" size={80} color="#9ca3af" />
              </View>
              <Text style={styles.emptyTitle}>Không có đơn hàng</Text>
              <Text style={styles.emptyText}>
                Vui lòng thêm sản phẩm vào giỏ hàng để tiếp tục
              </Text>
            </View>
          )
        )}
      </ScrollView>

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

      {/* ✅ Modal cập nhật địa chỉ */}
      <Modal
        visible={isAddressModal}
        animationType="fade"
        transparent
        onRequestClose={() => setIsAddressModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Cập nhật địa chỉ giao hàng</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập địa chỉ mới"
              value={newAddress}
              onChangeText={setNewAddress}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setIsAddressModal(false)}
              >
                <Text style={styles.cancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.saveBtn]}
                onPress={handleUpdateAddress}
                disabled={addressLoading}
              >
                <Text style={styles.saveText}>
                  {addressLoading ? "Đang lưu..." : "Lưu địa chỉ"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // Header
  header: {
    backgroundColor: "#facc15",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },

  backText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 16,
  },

  titleContainer: {
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
  },

  // Scroll Container
  scrollContainer: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  // Loading & Error
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },

  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "500",
  },

  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },

  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: "#ef4444",
    textAlign: "center",
    fontWeight: "500",
  },

  // Section
  section: {
    marginBottom: 28,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1f2937",
    letterSpacing: 0.3,
  },

  // Info Card
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    gap: 16,
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    lineHeight: 22,
  },

  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#facc15",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignSelf: "flex-start",
    marginTop: 8,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  editText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.3,
  },

  // Items Container
  itemsContainer: {
    marginTop: 20,
  },

  itemCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },

  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 16,
    marginRight: 16,
    borderWidth: 2,
    borderColor: "#facc15",
  },

  itemInfo: {
    flex: 1,
  },

  itemName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 6,
    lineHeight: 22,
  },

  itemPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#facc15",
    marginBottom: 4,
  },

  itemQuantity: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },

  detailBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fef3c7",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#facc15",
  },

  // Summary Card
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    marginTop: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },

  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  summaryTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
    marginLeft: 12,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  summaryLabel: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "500",
  },

  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },

  summaryDivider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 16,
  },

  totalLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
  },

  totalValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#facc15",
  },

  // Payment Button
  paymentBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#facc15",
    paddingVertical: 18,
    borderRadius: 16,
    marginTop: 24,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },

  paymentBtnDisabled: {
    backgroundColor: "#d1d5db",
    shadowOpacity: 0.1,
  },

  payosLogo: {
    width: 80,
    height: 25,
    resizeMode: "contain",
  },

  paymentText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  // Empty State
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },

  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f9fafb",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },

  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 12,
  },

  emptyText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "500",
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },

  modalImage: {
    width: 140,
    height: 140,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "#facc15",
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: 0.3,
  },

  modalDesc: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 22,
    fontWeight: "500",
  },

  modalPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#facc15",
    marginBottom: 10,
  },

  modalQty: {
    fontSize: 15,
    color: "#6b7280",
    marginBottom: 24,
    fontWeight: "500",
  },

  closeBtn: {
    backgroundColor: "#facc15",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  closeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  // Modal Buttons
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },

  modalBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  cancelBtn: {
    backgroundColor: "#f87171",
  },

  saveBtn: {
    backgroundColor: "#facc15",
  },

  cancelText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  input: {
    borderWidth: 2,
    borderColor: "#facc15",
    borderRadius: 16,
    width: "100%",
    padding: 18,
    marginVertical: 16,
    fontSize: 16,
    backgroundColor: "#fef3c7",
    fontWeight: "500",
    textAlignVertical: "top",
  },
});
