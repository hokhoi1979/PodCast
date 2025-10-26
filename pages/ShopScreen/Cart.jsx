import { Ionicons } from "@expo/vector-icons";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  checkoutCart,
  resetCheckout,
} from "../../redux/User/checkoutCart/checkoutCartSlice";
import { deleteCartItem } from "../../redux/User/deleteCartItem/deleteCartItemSlice";
import { getAllCart } from "../../redux/User/fetchCart/getAllCartSlice";
import { updateCartItem } from "../../redux/User/updateCartItem/updateCartItemSlice";

export default function CartScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { cart, loading, error } = useSelector((state) => state.cart);
  const { loading: checkoutLoading, checkout } = useSelector(
    (state) => state.checkoutCart
  );

  useEffect(() => {
    dispatch(getAllCart());
  }, [dispatch]);

  useEffect(() => {
    if (checkout && checkout.id) {
      navigation.navigate("Checkout", { id: checkout.id });
      // Reset checkout state sau khi navigate để tránh tự động chuyển lại
      dispatch(resetCheckout());
    }
  }, [checkout, navigation, dispatch]);

  const items = cart?.items || [];

  const handleUpdateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateCartItem({ cartItemId, quantity: newQuantity }));
    setTimeout(() => dispatch(getAllCart()), 1500);
  };

  const handleDelete = (cartItemId) => {
    Alert.alert("Xóa sản phẩm", "Bạn có chắc muốn xóa sản phẩm này không?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        onPress: () => {
          dispatch(deleteCartItem(cartItemId));
          setTimeout(() => dispatch(getAllCart()), 300);
        },
      },
    ]);
  };

  const handleCheckout = () => {
    dispatch(checkoutCart());
  };

  const handleBackToShop = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "MainApp", params: { screen: "Shop" } }],
      })
    );
  };

  const totalAmount = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <View style={styles.container}>
      {/* Header với gradient */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBackToShop}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
          <Text style={styles.backText}>Quay về cửa hàng</Text>
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>🛒 Giỏ hàng của bạn</Text>
          <Text style={styles.subtitle}>
            {items.length} sản phẩm trong giỏ hàng
          </Text>
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
            <Text style={styles.loadingText}>Đang tải giỏ hàng...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={48} color="#ef4444" />
            <Text style={styles.errorText}>Lỗi: {error}</Text>
          </View>
        )}

        {items.length > 0 ? (
          <>
            {/* Items List */}
            <View style={styles.itemsContainer}>
              {items.map((item, index) => (
                <View
                  key={item.id}
                  style={[styles.itemCard, { marginTop: index === 0 ? 0 : 16 }]}
                >
                  {/* Product Info */}
                  <View style={styles.productInfo}>
                    <View style={styles.productIcon}>
                      <Ionicons name="cube" size={24} color="#facc15" />
                    </View>
                    <View style={styles.productDetails}>
                      <Text style={styles.itemName} numberOfLines={2}>
                        {item.productName}
                      </Text>
                      <Text style={styles.itemPrice}>
                        {item.price.toLocaleString("vi-VN")} ₫
                      </Text>
                    </View>
                  </View>

                  {/* Quantity Controls */}
                  <View style={styles.quantitySection}>
                    <Text style={styles.quantityLabel}>Số lượng</Text>
                    <View style={styles.quantityControls}>
                      <TouchableOpacity
                        onPress={() =>
                          item.quantity > 1 &&
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                        style={[
                          styles.quantityBtn,
                          item.quantity <= 1 && styles.quantityBtnDisabled,
                        ]}
                        disabled={item.quantity <= 1}
                      >
                        <Ionicons
                          name="remove"
                          size={16}
                          color={item.quantity <= 1 ? "#9ca3af" : "#fff"}
                        />
                      </TouchableOpacity>

                      <View style={styles.quantityDisplay}>
                        <Text style={styles.quantityText}>{item.quantity}</Text>
                      </View>

                      <TouchableOpacity
                        onPress={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                        style={styles.quantityBtn}
                      >
                        <Ionicons name="add" size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Delete Button */}
                  <TouchableOpacity
                    onPress={() => handleDelete(item.id)}
                    style={styles.deleteBtn}
                  >
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Summary Card */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <Ionicons name="receipt" size={24} color="#facc15" />
                <Text style={styles.summaryTitle}>Tóm tắt đơn hàng</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tạm tính:</Text>
                <Text style={styles.summaryValue}>
                  {totalAmount.toLocaleString("vi-VN")} ₫
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
                  {totalAmount.toLocaleString("vi-VN")} ₫
                </Text>
              </View>
            </View>
          </>
        ) : (
          !loading && (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIcon}>
                <Ionicons name="cart-outline" size={80} color="#9ca3af" />
              </View>
              <Text style={styles.emptyTitle}>Giỏ hàng trống</Text>
              <Text style={styles.emptyText}>
                Hãy thêm sản phẩm yêu thích vào giỏ hàng để tiếp tục mua sắm
              </Text>
              <TouchableOpacity
                style={styles.shopBtn}
                onPress={handleBackToShop}
              >
                <Ionicons name="storefront" size={20} color="#fff" />
                <Text style={styles.shopBtnText}>Mua sắm ngay</Text>
              </TouchableOpacity>
            </View>
          )
        )}
      </ScrollView>

      {/* Checkout Button */}
      {items.length > 0 && (
        <View style={styles.checkoutContainer}>
          <TouchableOpacity
            onPress={handleCheckout}
            disabled={checkoutLoading}
            style={[
              styles.checkoutBtn,
              checkoutLoading && styles.checkoutBtnDisabled,
            ]}
          >
            {checkoutLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="card" size={24} color="#fff" />
            )}
            <Text style={styles.checkoutText}>
              {checkoutLoading ? "Đang xử lý..." : "Thanh toán"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
    paddingBottom: 100,
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

  // Items Container
  itemsContainer: {
    marginTop: 20,
  },

  itemCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },

  productInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  productIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fef3c7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    borderWidth: 2,
    borderColor: "#facc15",
  },

  productDetails: {
    flex: 1,
  },

  itemName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 6,
    lineHeight: 24,
  },

  itemPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#facc15",
  },

  // Quantity Section
  quantitySection: {
    marginBottom: 16,
  },

  quantityLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 8,
  },

  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 25,
    paddingHorizontal: 4,
    paddingVertical: 4,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  quantityBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#facc15",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  quantityBtnDisabled: {
    backgroundColor: "#d1d5db",
  },

  quantityDisplay: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  quantityText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
  },

  // Delete Button
  deleteBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fef2f2",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#fecaca",
  },

  // Summary Card
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    marginTop: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
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
    marginBottom: 32,
    lineHeight: 24,
    fontWeight: "500",
  },

  shopBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#facc15",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },

  shopBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 8,
  },

  // Checkout Container
  checkoutContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },

  checkoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#facc15",
    paddingVertical: 18,
    borderRadius: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },

  checkoutBtnDisabled: {
    backgroundColor: "#d1d5db",
    shadowOpacity: 0.1,
  },

  checkoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
