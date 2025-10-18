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
import { checkoutCart } from "../../redux/User/checkoutCart/checkoutCartSlice";
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
    }
  }, [checkout, navigation]);

  const items = cart?.items || [];

  const handleUpdateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateCartItem({ cartItemId, quantity: newQuantity }));
    setTimeout(() => dispatch(getAllCart()), 300);
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
    <ScrollView style={styles.container}>
      {/* 🔙 Nút quay lại */}
      <TouchableOpacity style={styles.backBtn} onPress={handleBackToShop}>
        <Ionicons name="arrow-back" size={20} color="#fff" />
        <Text style={styles.backText}>Quay về cửa hàng</Text>
      </TouchableOpacity>

      <Text style={styles.title}>🛒 Giỏ hàng của bạn</Text>

      {loading && <ActivityIndicator size="large" color="#facc15" />}
      {error && <Text style={styles.error}>Lỗi: {error}</Text>}

      {items.length > 0 ? (
        <>
          {items.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <Text style={styles.itemName}>{item.productName}</Text>

              {/* Hàng giá và nút tăng giảm */}
              <View style={styles.priceRow}>
                <Text style={styles.itemPrice}>
                  Giá:{" "}
                  <Text style={styles.priceText}>
                    {item.price.toLocaleString()} VND
                  </Text>
                </Text>

                <View style={styles.actions}>
                  <TouchableOpacity
                    onPress={() =>
                      item.quantity > 1 &&
                      handleUpdateQuantity(item.id, item.quantity - 1)
                    }
                    style={styles.actionBtn}
                  >
                    <Text style={styles.actionText}>-</Text>
                  </TouchableOpacity>

                  <Text style={styles.quantityText}>{item.quantity}</Text>

                  <TouchableOpacity
                    onPress={() =>
                      handleUpdateQuantity(item.id, item.quantity + 1)
                    }
                    style={styles.actionBtn}
                  >
                    <Text style={styles.actionText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.bottomRow}>
                <Text style={styles.itemQuantity}>
                  Số lượng: {item.quantity}
                </Text>

                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  style={styles.deleteBtn}
                >
                  <Ionicons name="trash" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* Tổng cộng */}
          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>Tổng cộng:</Text>
            <Text style={styles.totalValue}>
              {totalAmount.toLocaleString()} VND
            </Text>
          </View>

          {/* Đặt hàng */}
          <TouchableOpacity
            onPress={handleCheckout}
            disabled={checkoutLoading}
            style={[styles.checkoutBtn, checkoutLoading && { opacity: 0.6 }]}
          >
            <Text style={styles.checkoutText}>
              {checkoutLoading ? "Đang xử lý..." : "Đặt hàng"}
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        !loading && (
          <Text style={styles.emptyText}>
            Giỏ hàng trống. Hãy thêm sản phẩm!
          </Text>
        )
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },

  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#facc15",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  backText: { color: "#fff", fontWeight: "600", marginLeft: 6 },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 18,
    textAlign: "center",
  },

  itemCard: {
    backgroundColor: "#fffbea",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#fde68a",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },

  itemName: { fontSize: 16, fontWeight: "600", color: "#1e293b" },

  priceRow: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  itemPrice: { fontSize: 14, color: "#475569" },
  priceText: { color: "#ca8a04", fontWeight: "700" },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },

  actionBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#facc15",
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  quantityText: { paddingHorizontal: 8, fontSize: 16, color: "#1e293b" },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },

  itemQuantity: { fontSize: 13, color: "#6b7280" },

  deleteBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f59e0b",
    alignItems: "center",
    justifyContent: "center",
  },

  totalBox: {
    marginTop: 20,
    backgroundColor: "#fff8e1",
    padding: 16,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fde68a",
  },

  totalLabel: { fontSize: 15, fontWeight: "600", color: "#374151" },
  totalValue: { fontSize: 20, fontWeight: "700", color: "#ca8a04" },

  checkoutBtn: {
    marginTop: 20,
    backgroundColor: "#facc15",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  checkoutText: { color: "#fff", fontSize: 18, fontWeight: "700" },

  emptyText: {
    fontSize: 16,
    color: "#94a3b8",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 40,
  },
});
