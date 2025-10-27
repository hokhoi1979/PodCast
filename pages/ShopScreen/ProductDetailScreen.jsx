import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCommentByProduct } from "../../redux/User/comment_rating/fetchCommentByProduct/fetchCommentByProductSlice";
import { fetchProductDetail } from "../../redux/User/fetchAllProductDetail/fetchAllProductDetailSlice";
import { addToCart } from "../../redux/User/postProductToCart/postProductToCartSlice";

export default function ProductDetailScreen({ navigation }) {
  const dispatch = useDispatch();
  const route = useRoute();
  const { productId } = route.params;

  const { user } = useSelector((state) => state.auth);
  const { productDetail, loading, error } = useSelector(
    (state) => state.fetchProductDetail
  );
  const { fetchCommentProduct, loading: commentsLoading } = useSelector(
    (state) => state.fetchCommentByProduct
  );

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetail(productId));
      dispatch(fetchAllCommentByProduct(productId));
    }
  }, [dispatch, productId]);

  const formatPrice = (price) => {
    if (!price && price !== 0) return "0 ₫";
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Không có thông tin";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateAverageRating = () => {
    if (
      !fetchCommentProduct ||
      !Array.isArray(fetchCommentProduct) ||
      fetchCommentProduct.length === 0
    ) {
      return 0;
    }
    const totalStars = fetchCommentProduct.reduce(
      (sum, comment) => sum + (comment.star || 0),
      0
    );
    return (totalStars / fetchCommentProduct.length).toFixed(1);
  };

  const formatCommentDate = (dateString) => {
    if (!dateString) return "Không có thông tin";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleAddToCart = () => {
    if (!user) {
      Toast.show({
        type: "error",
        text1: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng 🛒",
      });
      return;
    }

    if (!productDetail || !productDetail.id) {
      Toast.show({
        type: "error",
        text1: "Không thể thêm sản phẩm vào giỏ hàng",
      });
      return;
    }

    dispatch(
      addToCart({
        productId: productDetail.id,
        quantity: 1,
      })
    );

    Toast.show({
      type: "success",
      text1: "Đã thêm sản phẩm vào giỏ hàng 🎉",
    });
  };

  const handleBuyNow = () => {
    if (!user) {
      Toast.show({
        type: "error",
        text1: "Vui lòng đăng nhập để mua sản phẩm 🛒",
      });
      return;
    }

    if (!productDetail || !productDetail.id) {
      Toast.show({
        type: "error",
        text1: "Không thể mua sản phẩm này",
      });
      return;
    }

    // Thêm vào giỏ trước khi mua
    dispatch(
      addToCart({
        productId: productDetail.id,
        quantity: 1,
      })
    );

    // Navigate đến checkout
    navigation.navigate("Checkout", { product: productDetail });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text style={styles.loadingText}>Đang tải thông tin sản phẩm...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Lỗi: {error}</Text>
        <TouchableOpacity
          style={styles.retryBtn}
          onPress={() => dispatch(fetchProductDetail(productId))}
        >
          <Text style={styles.retryText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!productDetail) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Không tìm thấy sản phẩm</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header với nút quay lại */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết sản phẩm</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Ảnh sản phẩm */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri:
              productDetail.imageUrl ||
              "https://via.placeholder.com/300x300?text=No+Image",
          }}
          style={styles.productImage}
          resizeMode="cover"
        />
      </View>

      {/* Thông tin sản phẩm */}
      <View style={styles.infoContainer}>
        <Text style={styles.productName}>
          {productDetail.name || "Không có tên"}
        </Text>

        <Text style={styles.priceText}>{formatPrice(productDetail.price)}</Text>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Mô tả sản phẩm:</Text>
          <Text style={styles.descriptionText}>
            {productDetail.description || "Không có mô tả"}
          </Text>
        </View>

        {/* Thông tin chi tiết */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>📦 Số lượng tồn kho:</Text>
            <Text style={styles.detailValue}>
              {productDetail.stockQuantity || 0} sản phẩm
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>📅 Ngày tạo:</Text>
            <Text style={styles.detailValue}>
              {formatDate(productDetail.createdAt)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>🔄 Cập nhật lần cuối:</Text>
            <Text style={styles.detailValue}>
              {formatDate(productDetail.updatedAt)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>✅ Trạng thái:</Text>
            <Text
              style={[
                styles.detailValue,
                { color: productDetail.active ? "#10b981" : "#ef4444" },
              ]}
            >
              {productDetail.active ? "Đang bán" : "Ngừng bán"}
            </Text>
          </View>
        </View>
      </View>

      {/* Nút hành động */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.addToCartBtn]}
          onPress={handleAddToCart}
        >
          <Ionicons name="cart-outline" size={20} color="#fff" />
          <Text style={styles.actionBtnText}>Thêm vào giỏ</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={[styles.actionBtn, styles.buyNowBtn]}
          onPress={handleBuyNow}
        >
          <Ionicons name="flash-outline" size={20} color="#fff" />
          <Text style={styles.actionBtnText}>Mua ngay</Text>
        </TouchableOpacity> */}
      </View>

      {/* Phần đánh giá và bình luận */}
      <View style={styles.commentsSection}>
        <View style={styles.commentsHeader}>
          <Text style={styles.commentsTitle}>Đánh giá sản phẩm</Text>
          <View style={styles.ratingSummary}>
            <Text style={styles.averageRating}>{calculateAverageRating()}</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Text key={star} style={styles.star}>
                  {star <= Math.round(calculateAverageRating()) ? "⭐" : "☆"}
                </Text>
              ))}
            </View>
            <Text style={styles.totalComments}>
              (
              {Array.isArray(fetchCommentProduct)
                ? fetchCommentProduct.length
                : 0}{" "}
              đánh giá)
            </Text>
          </View>
        </View>

        {/* Danh sách bình luận */}
        {commentsLoading ? (
          <View style={styles.loadingComments}>
            <ActivityIndicator size="small" color="#f59e0b" />
            <Text style={styles.loadingText}>Đang tải đánh giá...</Text>
          </View>
        ) : Array.isArray(fetchCommentProduct) &&
          fetchCommentProduct.length > 0 ? (
          fetchCommentProduct.map((comment) => (
            <View key={comment.id} style={styles.commentCard}>
              <View style={styles.commentHeader}>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>
                    {comment.user?.fullName ||
                      comment.user?.username ||
                      "Người dùng"}
                  </Text>
                  <Text style={styles.commentDate}>
                    {formatCommentDate(comment.dateCreated)}
                  </Text>
                </View>
                <View style={styles.commentRating}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Text key={star} style={styles.star}>
                      {star <= comment.star ? "⭐" : "☆"}
                    </Text>
                  ))}
                  <Text style={styles.ratingNumber}>{comment.star}/5</Text>
                </View>
              </View>
              <Text style={styles.commentText}>{comment.comment}</Text>
            </View>
          ))
        ) : (
          <View style={styles.noComments}>
            <Text style={styles.noCommentsText}>Chưa có đánh giá nào</Text>
          </View>
        )}
      </View>

      <Toast />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#64748b",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444",
    textAlign: "center",
    marginBottom: 20,
  },
  retryBtn: {
    backgroundColor: "#f59e0b",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fef3c7",
    borderBottomWidth: 1,
    borderBottomColor: "#fde68a",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f59e0b",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginTop: 4,
  },
  placeholder: {
    width: 40,
  },
  imageContainer: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#fef9c3",
  },
  productImage: {
    width: 300,
    height: 300,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  infoContainer: {
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 8,
  },
  priceText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ca8a04",
    marginBottom: 20,
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  detailsContainer: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: "#475569",
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    flex: 1,
    textAlign: "right",
  },
  actionContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  addToCartBtn: {
    backgroundColor: "#f59e0b",
  },
  buyNowBtn: {
    backgroundColor: "#6366f1",
  },
  actionBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  // Comments section styles
  commentsSection: {
    backgroundColor: "#f8fafc",
    padding: 20,
    marginTop: 20,
  },
  commentsHeader: {
    marginBottom: 20,
  },
  commentsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 12,
  },
  ratingSummary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  averageRating: {
    fontSize: 24,
    fontWeight: "700",
    color: "#f59e0b",
  },
  starsContainer: {
    flexDirection: "row",
    gap: 2,
  },
  star: {
    fontSize: 16,
  },
  totalComments: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 8,
  },
  loadingComments: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 8,
  },
  commentCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#f59e0b",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  commentDate: {
    fontSize: 12,
    color: "#6b7280",
  },
  commentRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingNumber: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 4,
  },
  commentText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  noComments: {
    alignItems: "center",
    padding: 40,
  },
  noCommentsText: {
    fontSize: 16,
    color: "#6b7280",
    fontStyle: "italic",
  },
});
