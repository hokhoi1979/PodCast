import {
  CheckCircle,
  CreditCard,
  FileCheck,
  Home,
  Package,
  PackageCheck,
  ShoppingCart,
  Truck,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { fetchAllCommentByUser } from "../../redux/User/comment_rating/fetchCommentByUser/fetchCommentByUserSlice";
import { getOrderUser } from "../../redux/User/fetchOrderByUser/getAllOrderByUserSlice";
import { updateStatusOrder } from "../../redux/User/updateStatusOrder/updateStatusOrderSlice";
import RatingModal from "./RatingModal";

export default function TrackOrdersScreen({ route, navigation }) {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedProductForRating, setSelectedProductForRating] =
    useState(null);

  const { orderUser, loading, error } = useSelector((state) => state.orderUser);
  const { fetchCommentUser } = useSelector((state) => state.fetchCommentByUser);

  // 🔹 Lấy userId từ route.params
  const { userId } = route.params;

  const [selectedOrder, setSelectedOrder] = useState(0);

  const onRefresh = async () => {
    setRefreshing(true); // hiện spinner
    await dispatch(getOrderUser({ userId, page: 1, size: 200 }));
    setRefreshing(false); // tắt spinner
  };

  useEffect(() => {
    if (route.params?.userId) {
      dispatch(
        getOrderUser({ userId: route.params.userId, page: 1, size: 200 })
      );
      // Fetch comments của user
      dispatch(fetchAllCommentByUser(route.params.userId));
    }
  }, [dispatch, route.params?.userId]);

  // Debug order data
  useEffect(() => {}, [orderUser, orders, selected]);

  useEffect(() => {}, [fetchCommentUser]);

  const orders = (orderUser?.content || orderUser || []).filter((order) =>
    [
      "paid",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "received",
      "completed",
    ].includes(order.status?.toLowerCase())
  );

  const selected = orders[selectedOrder];

  const getOrderStep = (status) => {
    const map = {
      paid: 0,
      confirmed: 1,
      processing: 2,
      shipped: 3,
      delivered: 4,
      received: 5,
      completed: 6,
    };
    return map[status?.toLowerCase()] ?? 0;
  };

  const orderSteps = [
    { title: "Đã thanh toán", icon: CreditCard },
    { title: "Đã xác nhận", icon: FileCheck },
    { title: "Đang xử lý", icon: Package },
    { title: "Đang giao", icon: Truck },
    { title: "Đã giao", icon: Home },
    { title: "Đã nhận", icon: PackageCheck },
    { title: "Hoàn thành", icon: CheckCircle },
  ];

  const handleConfirmReceived = async (orderId) => {
    await dispatch(
      updateStatusOrder({ id: orderId, status: "RECEIVED", userId })
    );
    dispatch(getOrderUser({ userId, page: 1, size: 40 }));
    Alert.alert("✅ Thành công", "Đơn hàng đã được xác nhận là đã nhận hàng.");
  };

  const handleRateProduct = (product) => {
    setSelectedProductForRating(product);
    setShowRatingModal(true);
  };

  const handleCloseRatingModal = () => {
    setShowRatingModal(false);
    setSelectedProductForRating(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Không có thông tin";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text style={{ marginTop: 10 }}>Đang tải đơn hàng...</Text>
      </View>
    );

  if (error)
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>Lỗi tải đơn hàng: {error}</Text>
      </View>
    );

  if (!orders.length)
    return (
      <View style={styles.center}>
        <ShoppingCart size={64} color="#a3a3a3" />
        <Text style={styles.emptyText}>Bạn chưa có đơn hàng nào.</Text>
      </View>
    );

  if (!selected)
    return (
      <View style={styles.center}>
        <Text>Không có đơn hàng để hiển thị</Text>
      </View>
    );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#f59e0b"]}
          tintColor="#f59e0b"
        />
      }
    >
      {/* 🔹 Nút quay lại trang chính */}
      <View style={{ alignItems: "center", marginTop: 20, marginBottom: 40 }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#f59e0b",
            paddingVertical: 12,
            paddingHorizontal: 30,
            borderRadius: 8,
          }}
          onPress={() => navigation.navigate("MainApp")}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            🏠 Về Trang Chính
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Theo dõi đơn hàng</Text>

      {/* Nút refresh comment để test */}
      <TouchableOpacity
        style={{
          backgroundColor: "#6366f1",
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: 8,
          alignSelf: "center",
          marginBottom: 16,
        }}
        onPress={() => {
          dispatch(fetchAllCommentByUser(userId));
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>
          🔄 Refresh Comments
        </Text>
      </TouchableOpacity>

      {/* Danh sách đơn hàng */}
      <View style={styles.orderListContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => setSelectedOrder(index)}
              style={[
                styles.orderCard,
                selectedOrder === index && styles.orderCardActive,
              ]}
            >
              <Image
                source={{
                  uri:
                    item.items?.[0]?.product?.imageUrl ||
                    "https://placehold.co/80",
                }}
                style={styles.orderImage}
              />
              <Text style={styles.orderId}>#{item.id}</Text>
              <Text style={styles.orderPrice}>
                {item.totalAmount?.toLocaleString("vi-VN") || 0}₫
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Chi tiết đơn hàng */}
      <View style={styles.detailContainer}>
        <Text style={styles.orderTitle}>Đơn hàng #{selected.id}</Text>
        <Text style={styles.orderDate}>
          {selected.createdAt
            ? new Date(selected.createdAt).toLocaleString("vi-VN")
            : ""}
        </Text>
        <View style={styles.addressBox}>
          <Text style={styles.addressLabel}>📍 Địa chỉ nhận hàng</Text>
          <Text style={styles.addressText}>
            {selected.address || "Không có địa chỉ"}
          </Text>
        </View>

        {selected.items?.map((item) => {
          return (
            <View key={item.id} style={styles.itemCard}>
              <Image
                source={{
                  uri: item.product?.imageUrl || "https://placehold.co/100",
                }}
                style={styles.itemImage}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>
                  {item.product?.name || "Sản phẩm không xác định"}
                </Text>
                <Text style={styles.itemQuantity}>
                  Số lượng: {item.quantity}
                </Text>
                <Text style={styles.itemPrice}>
                  {item.price?.toLocaleString("vi-VN") || 0}₫
                </Text>

                {/* Nút đánh giá sản phẩm */}
                {(selected.status?.toLowerCase() === "completed" ||
                  selected.status?.toLowerCase() === "received") && (
                  <TouchableOpacity
                    style={styles.rateBtn}
                    onPress={() => handleRateProduct(item.product)}
                  >
                    <Text style={styles.rateBtnText}>⭐ Đánh giá sản phẩm</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}

        {/* Nút xác nhận */}
        {selected.status?.toUpperCase() === "DELIVERED" && (
          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={() => handleConfirmReceived(selected.id)}
          >
            <Text style={styles.confirmText}>Đã nhận hàng</Text>
          </TouchableOpacity>
        )}

        {/* Tổng tiền */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Tổng cộng:</Text>
          <Text style={styles.totalPrice}>
            {selected.totalAmount?.toLocaleString("vi-VN") || 0}₫
          </Text>
        </View>
      </View>

      {/* Timeline trạng thái */}
      <View style={styles.timelineContainer}>
        <Text style={styles.timelineTitle}>Trạng thái đơn hàng</Text>

        {orderSteps.map((step, index) => {
          const currentIndex = getOrderStep(selected?.status);
          const isDone = index < currentIndex;
          const isCurrent = index === currentIndex;
          const Icon = step.icon;

          return (
            <View
              key={index}
              style={[
                styles.stepContainer,
                isDone
                  ? styles.stepDone
                  : isCurrent
                  ? styles.stepCurrent
                  : styles.stepPending,
              ]}
            >
              <Icon
                size={22}
                color={isDone || isCurrent ? "white" : "#a8a8a8"}
              />
              <Text style={styles.stepText}>{step.title}</Text>
            </View>
          );
        })}
      </View>

      {/* Danh sách đánh giá của user */}

      {fetchCommentUser && fetchCommentUser.length > 0 && (
        <View style={styles.commentsContainer}>
          <Text style={styles.commentsTitle}>Đánh giá của bạn</Text>
          {fetchCommentUser.map((comment) => (
            <View key={comment.id} style={styles.commentCard}>
              <View style={styles.commentHeader}>
                <Text style={styles.commentProductName}>
                  {comment.product?.name || "Sản phẩm không xác định"}
                </Text>
                <Text style={styles.commentDate}>
                  {formatDate(comment.dateCreated)}
                </Text>
              </View>

              <View style={styles.commentRating}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Text key={star} style={styles.star}>
                    {star <= comment.star ? "⭐" : "☆"}
                  </Text>
                ))}
                <Text style={styles.ratingText}>{comment.star}/5</Text>
              </View>

              <Text style={styles.commentText}>{comment.comment}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Rating Modal */}
      <RatingModal
        visible={showRatingModal}
        onClose={handleCloseRatingModal}
        productId={selectedProductForRating?.id}
        userId={userId}
        productName={selectedProductForRating?.name}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff7ed", padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#78350f",
  },
  orderListContainer: { marginBottom: 20 },
  orderCard: {
    width: 120,
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    alignItems: "center",
  },
  orderCardActive: { borderColor: "#f59e0b", backgroundColor: "#fffbeb" },
  orderImage: { width: 70, height: 70, borderRadius: 10, marginBottom: 5 },
  orderId: { fontWeight: "bold", color: "#374151" },
  orderPrice: { color: "#92400e", fontWeight: "600" },
  detailContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  orderTitle: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  orderDate: { fontSize: 13, color: "#6b7280", marginBottom: 10 },
  itemCard: {
    flexDirection: "row",
    backgroundColor: "#fff7ed",
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  itemImage: { width: 70, height: 70, borderRadius: 8, marginRight: 10 },
  itemName: { fontWeight: "bold", color: "#1f2937" },
  itemQuantity: { fontSize: 13, color: "#6b7280" },
  itemPrice: { fontWeight: "bold", color: "#b45309" },
  confirmBtn: {
    backgroundColor: "#16a34a",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  confirmText: { color: "white", fontWeight: "bold", fontSize: 15 },
  totalContainer: {
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    marginTop: 12,
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalLabel: { fontWeight: "bold", fontSize: 16 },
  totalPrice: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#f59e0b",
  },
  timelineContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 50,
  },
  timelineTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    marginBottom: 6,
  },
  stepDone: { backgroundColor: "#bbf7d0" },
  stepCurrent: { backgroundColor: "#fde68a" },
  stepPending: { backgroundColor: "#e5e7eb" },
  stepText: { marginLeft: 10, fontWeight: "600", color: "#374151" },
  emptyText: { color: "#6b7280", marginTop: 8 },
  addressBox: {
    backgroundColor: "#fff7ed",
    borderRadius: 10,
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#fcd34d",
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#92400e",
    marginBottom: 6,
  },
  addressText: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 20,
  },
  rateBtn: {
    backgroundColor: "#f59e0b",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 8,
    alignSelf: "flex-start",
  },
  rateBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  commentsContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#111827",
  },
  commentCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#f59e0b",
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  commentProductName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    flex: 1,
  },
  commentDate: {
    fontSize: 12,
    color: "#6b7280",
  },
  commentRating: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  star: {
    fontSize: 16,
    marginRight: 2,
  },
  ratingText: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 8,
  },
  commentText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 18,
  },
});
