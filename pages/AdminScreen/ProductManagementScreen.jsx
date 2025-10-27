import { Ionicons } from "@expo/vector-icons"; // NEW
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { deleteProductRequest } from "../../redux/Admin/Product/delete_product/deleteProductSlice";
import { getAllProduct } from "../../redux/Admin/Product/fetchProduct/getAllProductSlice";
import { productPostRequest } from "../../redux/Admin/Product/post_product/postProductSlice";
import { updateProductRequest } from "../../redux/Admin/Product/update_Product/updateProductSlice";

export default function ProductManagementScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {
    loading: posting,
    postProduct,
    error,
  } = useSelector((s) => s.postProduct);
  const {
    loading: loadingList,
    product,
    pagination,
  } = useSelector((s) => s.fetchAllProduct);
  const { loading: updating, updateProduct } = useSelector(
    (s) => s.updateProduct || {}
  ); // NEW
  const { loading: deleting, deleteProduct } = useSelector(
    (s) => s.deleteProduct || {}
  ); // NEW

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [stockQuantity, setStockQuantity] = useState("1");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(getAllProduct({ page: 1, size: 50 }));
  }, [dispatch]);

  useEffect(() => {
    if (postProduct) {
      Toast.show({ type: "success", text1: "Đăng sản phẩm thành công" });
      setShowModal(false);
      resetForm();
      dispatch(getAllProduct({ page: 1, size: 50 }));
    }
  }, [postProduct, dispatch]);

  // NEW: handle update success
  useEffect(() => {
    if (updateProduct) {
      Toast.show({ type: "success", text1: "Cập nhật sản phẩm thành công" });
      setShowModal(false);
      resetForm();
      dispatch(getAllProduct({ page: 1, size: 50 }));
    }
  }, [updateProduct, dispatch]);

  // NEW: handle delete success
  useEffect(() => {
    if (deleteProduct) {
      Toast.show({ type: "success", text1: "Xóa sản phẩm thành công" });
      dispatch(getAllProduct({ page: 1, size: 50 }));
    }
  }, [deleteProduct, dispatch]);

  useEffect(() => {
    if (error) {
      Toast.show({ type: "error", text1: error?.toString() });
    }
  }, [error]);

  const resetForm = () => {
    setName("");
    setPrice("");
    setDescription("");
    setImage(null);
    setStockQuantity("1");
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditingId(item.id);
    setName(item.name || "");
    setPrice(String(item.price || ""));
    setDescription(item.description || "");
    setStockQuantity(String(item.stockQuantity || 1));
    setImage(item.imageUrl ? { uri: item.imageUrl } : null);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    Alert.alert("Xác nhận xóa", "Bạn có chắc muốn xóa sản phẩm này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: () => {
          dispatch(deleteProductRequest(id));
        },
      },
    ]);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Toast.show({ type: "error", text1: "Cần quyền truy cập thư viện ảnh" });
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      quality: 0.9,
    });
    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      setImage({
        uri: asset.uri,
        type: asset.mimeType || "image/jpeg",
        fileName: asset.fileName || "product.jpg",
      });
    }
  };

  const submit = () => {
    if (!name?.trim() || price === "" || stockQuantity === "") {
      Toast.show({ type: "error", text1: "Nhập tên, giá và số lượng" });
      return;
    }

    const priceNum = Number(price);
    const qtyNum = parseInt(stockQuantity, 10);
    if (Number.isNaN(priceNum) || Number.isNaN(qtyNum) || qtyNum < 0) {
      Toast.show({ type: "error", text1: "Giá/Số lượng không hợp lệ" });
      return;
    }

    const query = {
      name: name.trim(),
      description: description?.trim() || "",
      price: priceNum,
      stockQuantity: qtyNum,
    };

    if (isEditing) {
      // UPDATE
      const form = new FormData();
      const hasNewImage = image?.uri && !image.uri.startsWith("http");

      if (hasNewImage) {
        // Có ảnh mới → append file
        form.append("file", {
          uri: image.uri,
          name: image.fileName || "product.jpg",
          type: image.type || "image/jpeg",
        });
      } else {
        // Không có ảnh → append dummy text để FormData không rỗng
        form.append("dummy", "no-file");
      }

      dispatch(
        updateProductRequest({
          formData: form,
          productId: editingId,
          query,
        })
      );
    } else {
      // CREATE
      if (!image?.uri) {
        Toast.show({ type: "error", text1: "Vui lòng chọn ảnh sản phẩm" });
        return;
      }
      const form = new FormData();
      form.append("file", {
        uri: image.uri,
        name: image.fileName || "product.jpg",
        type: image.type || "image/jpeg",
      });
      dispatch(productPostRequest({ form, query }));
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{
          uri:
            item.imageUrl || "https://via.placeholder.com/80x80.png?text=IMG",
        }}
        style={styles.cardImage}
      />
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.name || "No name"}
        </Text>
        <Text style={styles.cardPrice}>
          {item.price != null ? `${item.price.toLocaleString("vi-VN")}₫` : "—"}
        </Text>
        <Text style={styles.cardStock}>SL: {item.stockQuantity ?? 0}</Text>
        {item.description ? (
          <Text style={styles.cardDesc} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: "#20B2AA" }]}
          onPress={() => handleEdit(item)}
          disabled={updating || deleting}
        >
          {updating ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="pencil" size={18} color="#fff" />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: "#E74C3C" }]}
          onPress={() => handleDelete(item.id)}
          disabled={updating || deleting}
        >
          {deleting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="trash" size={18} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Admin")}
          style={styles.backBtn}
        >
          <Text style={styles.backIcon}>‹</Text>
          <Text style={styles.backLabel}>Admin</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quản lý sản phẩm</Text>
        <View style={{ width: 60 }} />
      </View>

      {loadingList ? (
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={product}
          keyExtractor={(it, idx) => String(it.id ?? idx)}
          renderItem={renderItem}
          contentContainerStyle={
            product?.length ? { padding: 12 } : styles.center
          }
          refreshing={loadingList}
          onRefresh={() => dispatch(getAllProduct({ page: 1, size: 50 }))}
          ListEmptyComponent={<Text>Chưa có sản phẩm</Text>}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          resetForm();
          setShowModal(true);
        }}
      >
        <Text style={styles.fabPlus}>＋</Text>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={() => {
          setShowModal(false);
          resetForm();
        }}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isEditing ? "Sửa sản phẩm" : "Đăng sản phẩm"}
              </Text>
              <Pressable
                onPress={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                <Text style={styles.closeText}>Đóng</Text>
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
              <Text style={styles.label}>Tên sản phẩm</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Nhập tên"
              />
              <Text style={styles.label}>Giá</Text>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                placeholder="Nhập giá"
                keyboardType="numeric"
              />
              <Text style={styles.label}>Số lượng tồn</Text>
              <TextInput
                style={styles.input}
                value={stockQuantity}
                onChangeText={setStockQuantity}
                placeholder="Nhập số lượng"
                keyboardType="numeric"
              />
              <Text style={styles.label}>Mô tả</Text>
              <TextInput
                style={[styles.input, styles.multiline]}
                value={description}
                onChangeText={setDescription}
                placeholder="Nhập mô tả"
                multiline
                numberOfLines={4}
              />
              <Text style={styles.label}>Hình ảnh</Text>
              <View style={styles.imageRow}>
                <TouchableOpacity style={styles.pickBtn} onPress={pickImage}>
                  <Text style={styles.pickText}>Chọn ảnh</Text>
                </TouchableOpacity>
                {image?.uri ? (
                  <Image source={{ uri: image.uri }} style={styles.preview} />
                ) : null}
              </View>
              <TouchableOpacity
                style={[
                  styles.submitBtn,
                  (posting || updating) && styles.submitBtnDisabled,
                ]}
                onPress={submit}
                disabled={posting || updating}
              >
                {posting || updating ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitText}>
                    {isEditing ? "Cập nhật" : "Đăng sản phẩm"}
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#F8FAFB", marginTop: 30 },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
    justifyContent: "space-between",
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingRight: 8,
  },
  backIcon: {
    fontSize: 24,
    color: "#FF6B35",
    lineHeight: 24,
    marginRight: 4,
  },
  backLabel: {
    color: "#FF6B35",
    fontWeight: "700",
    fontSize: 14,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  // list card
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  cardInfo: { flex: 1, marginLeft: 12 },
  cardTitle: { fontSize: 16, fontWeight: "600" },
  cardPrice: { color: "#FF6B35", marginTop: 2, fontWeight: "700" },
  cardDesc: { color: "#666", marginTop: 4, fontSize: 12 },
  cardStock: {
    color: "#2C3E50",
    marginTop: 2,
    fontWeight: "600",
    fontSize: 12,
  },
  cardActions: {
    justifyContent: "center",
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    fontSize: 16,
  },

  // FAB
  fab: {
    position: "absolute",
    right: 16,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FF6B35",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  fabPlus: { color: "#fff", fontSize: 28, lineHeight: 28, marginTop: -3 },

  // modal
  modalBackdrop: {
    flex: 2,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalSheet: {
    maxHeight: "85%",
    width: "95%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", alignItems: "center" },
  closeText: { color: "#FF6B35", fontWeight: "700" },

  // form
  label: { fontSize: 14, fontWeight: "600", marginTop: 10, marginBottom: 6 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  multiline: { height: 100, textAlignVertical: "top" },
  imageRow: { flexDirection: "row", alignItems: "center" },
  pickBtn: {
    backgroundColor: "#20B2AA",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 12,
  },
  pickText: { color: "#fff", fontWeight: "600" },
  preview: { width: 60, height: 60, borderRadius: 8, backgroundColor: "#eee" },
  submitBtn: {
    marginTop: 18,
    backgroundColor: "#FF6B35",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
