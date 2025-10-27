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
import { fetchAllCommentByOrderItemId } from "../../redux/User/comment_rating/fetchCommentByOrderItemId/fetchCommentByOrderItemIdSlice";
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
  const { commentsByOrderItemId = {} } = useSelector(
    (state) => state.fetchCommentByOrderItemId
  );

  // 🔹 Lấy userId từ route.params
  const { userId } = route.params;

  const [selectedOrder, setSelectedOrder] = useState(0);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(getOrderUser({ userId, page: 1, size: 200 }));
    setRefreshing(false);
  };

  useEffect(() => {
    if (route.params?.userId) {
      dispatch(
        getOrderUser({ userId: route.params.userId, page: 1, size: 200 })
      );
    }
  }, [dispatch, route.params?.userId]);

  // Fetch comments cho tất cả order items khi có đơn hàng
  useEffect(() => {
    if (orderUser?.content && orderUser.content.length > 0) {
      const fetchedOrderItems = new Set();

      orderUser.content.forEach((order) => {
        if (order.items) {
          order.items.forEach((item) => {
            const orderItemId = item.id;
            if (orderItemId && !fetchedOrderItems.has(orderItemId)) {
              fetchedOrderItems.add(orderItemId);
              dispatch(fetchAllCommentByOrderItemId(orderItemId));
            }
          });
        }
      });
    }
  }, [orderUser, dispatch]);

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

  const handleRateProduct = (item) => {
    setSelectedProductForRating({
      product: item.product,
      orderItemId: item.id,
    });
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
      {/* Nút quay lại trang chính */}
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
          const userComments = commentsByOrderItemId[item.id] || [];

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

                {/* Thông tin đánh giá */}
                {userComments.length > 0 && (
                  <View style={styles.commentBadge}>
                    <Text style={styles.commentBadgeText}>
                      💬 {userComments.length} đánh giá
                    </Text>
                  </View>
                )}

                {/* Nút đánh giá sản phẩm */}
                {(selected.status?.toLowerCase() === "completed" ||
                  selected.status?.toLowerCase() === "received") && (
                  <TouchableOpacity
                    style={styles.rateBtn}
                    onPress={() => handleRateProduct(item)}
                  >
                    <Text style={styles.rateBtnText}>
                      {userComments.length > 0
                        ? "⭐ Thêm đánh giá"
                        : "⭐ Đánh giá sản phẩm"}
                    </Text>
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

      {/* Section đánh giá của đơn hàng */}
      {selected.items && (
        <View style={styles.commentsSection}>
          <Text style={styles.commentsSectionTitle}>
            💬 Đánh giá trong đơn hàng
          </Text>

          {selected.items.map((item) => {
            const userComments = commentsByOrderItemId[item.id] || [];
            if (userComments.length === 0) return null;

            return (
              <View key={item.id} style={styles.productCommentCard}>
                <View style={styles.productCommentHeader}>
                  <Image
                    source={{
                      uri: item.product?.imageUrl || "https://placehold.co/50",
                    }}
                    style={styles.productCommentImage}
                  />
                  <Text style={styles.productCommentName}>
                    {item.product?.name || "Sản phẩm"}
                  </Text>
                </View>

                {userComments.map((c) => (
                  <View key={c.id} style={styles.productCommentItem}>
                    <View style={styles.productCommentRating}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Text key={star} style={styles.commentStar}>
                          {star <= c.star ? "⭐" : "☆"}
                        </Text>
                      ))}
                    </View>
                    <Text style={styles.productCommentText}>{c.comment}</Text>
                    <Text style={styles.productCommentDate}>
                      {formatDate(c.dateCreated)}
                    </Text>
                  </View>
                ))}
              </View>
            );
          })}

          {selected.items.every(
            (item) => !commentsByOrderItemId[item.id]?.length
          ) && (
            <View style={styles.noCommentsContainer}>
              <Text style={styles.noCommentsText}>
                Chưa có đánh giá nào cho đơn hàng này
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Rating Modal */}
      <RatingModal
        visible={showRatingModal}
        onClose={handleCloseRatingModal}
        orderItemId={selectedProductForRating?.orderItemId}
        userId={userId}
        productName={selectedProductForRating?.product?.name}
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
  commentBadge: {
    backgroundColor: "#dbeafe",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
  },
  commentBadgeText: {
    fontSize: 10,
    color: "#1e40af",
    fontWeight: "600",
  },
  commentsSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 50,
  },
  commentsSectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  productCommentCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#f59e0b",
  },
  productCommentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  productCommentImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 10,
  },
  productCommentName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    flex: 1,
  },
  productCommentItem: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  productCommentRating: {
    flexDirection: "row",
    marginBottom: 6,
  },
  commentStar: {
    fontSize: 14,
  },
  productCommentText: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 18,
    marginBottom: 6,
  },
  productCommentDate: {
    fontSize: 11,
    color: "#9ca3af",
    fontStyle: "italic",
  },
  noCommentsContainer: {
    alignItems: "center",
    padding: 20,
  },
  noCommentsText: {
    fontSize: 14,
    color: "#9ca3af",
    fontStyle: "italic",
  },
});
