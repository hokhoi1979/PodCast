import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { createComment } from "../../redux/User/comment_rating/create_comment/createCommentSlice";
import { fetchAllCommentByUser } from "../../redux/User/comment_rating/fetchCommentByUser/fetchCommentByUserSlice";

export default function RatingModal({
  visible,
  onClose,
  productId,
  userId,
  productName,
}) {
  const dispatch = useDispatch();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { loading } = useSelector((state) => state.createComment);

  const handleStarPress = (starCount) => {
    setRating(starCount);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Toast.show({
        type: "error",
        text1: "Vui lòng chọn số sao đánh giá",
      });
      return;
    }

    if (!comment.trim()) {
      Toast.show({
        type: "error",
        text1: "Vui lòng nhập bình luận",
      });
      return;
    }

    try {
      const result = await dispatch(
        createComment({
          productId,
          comment: comment.trim(),
          star: rating,
        })
      );

      // Fetch lại danh sách comment của user
      dispatch(fetchAllCommentByUser(userId));

      Toast.show({
        type: "success",
        text1: "Đánh giá thành công!",
      });

      // Reset form và đóng modal
      setRating(0);
      setComment("");
      onClose();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Có lỗi xảy ra khi đánh giá",
      });
    }
  };

  const handleClose = () => {
    setRating(0);
    setComment("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Đánh giá sản phẩm</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <Text style={styles.productName}>{productName}</Text>

          {/* Chọn sao */}
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingLabel}>Đánh giá của bạn:</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => handleStarPress(star)}
                  style={styles.starBtn}
                >
                  <Ionicons
                    name={star <= rating ? "star" : "star-outline"}
                    size={32}
                    color={star <= rating ? "#fbbf24" : "#d1d5db"}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.ratingText}>
              {rating === 0
                ? "Chưa chọn sao"
                : `${rating} ${rating === 1 ? "sao" : "sao"}`}
            </Text>
          </View>

          {/* Nhập comment */}
          <View style={styles.commentContainer}>
            <Text style={styles.commentLabel}>Bình luận:</Text>
            <TextInput
              style={styles.commentInput}
              placeholder="Nhập bình luận của bạn về sản phẩm..."
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Nút hành động */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.cancelBtn]}
              onPress={handleClose}
            >
              <Text style={styles.cancelText}>Hủy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.submitBtn]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.submitText}>Gửi đánh giá</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
  },
  closeBtn: {
    padding: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 20,
    textAlign: "center",
  },
  ratingContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  starBtn: {
    padding: 4,
    marginHorizontal: 2,
  },
  ratingText: {
    fontSize: 14,
    color: "#6b7280",
    fontStyle: "italic",
  },
  commentContainer: {
    marginBottom: 20,
  },
  commentLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#374151",
    backgroundColor: "#f9fafb",
    minHeight: 80,
  },
  actionContainer: {
    flexDirection: "row",
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelBtn: {
    backgroundColor: "#e5e7eb",
  },
  submitBtn: {
    backgroundColor: "#f59e0b",
  },
  cancelText: {
    color: "#374151",
    fontWeight: "600",
  },
  submitText: {
    color: "#fff",
    fontWeight: "600",
  },
});
