import { useNavigation } from "@react-navigation/native";
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
import { getAllProduct } from "../../redux/User/fetchAllProduct/getAllProductSlice";
import { addToCart } from "../../redux/User/postProductToCart/postProductToCartSlice";
import Header from "../../shared/header/Header";

export default function StoreScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { user } = useSelector((state) => state.auth);
  const { product, loading, error } = useSelector(
    (state) => state.fetchProduct
  );

  useEffect(() => {
    dispatch(getAllProduct({ page: 1, size: 10 }));
  }, [dispatch]);

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const handleAddToCart = (item) => {
    if (!user) {
      Toast.show({
        type: "error",
        text1: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng 🛒",
      });
      return;
    }

    dispatch(
      addToCart({
        productId: item.id,
        quantity: 1,
      })
    );

    // Toast.show({
    //   type: "success",
    //   text1: "Đã thêm sản phẩm vào giỏ hàng 🎉",
    // });
  };

  const handleImagePress = (item) => {
    navigation.navigate("ProductDetail", { productId: item.id });
  };

  const handleBuyNow = (item) => {
    if (!user) {
      Toast.show({
        type: "error",
        text1: "Vui lòng đăng nhập để mua sản phẩm 🛒",
      });
      return;
    }

    navigation.navigate("Checkout", { product: item });
  };

  return (
    <ScrollView style={styles.container}>
      <Header />

      <Text style={styles.title}>Cửa hàng vòng tay</Text>

      {loading && <ActivityIndicator size="large" color="#f59e0b" />}
      {error && <Text style={styles.errorText}>Lỗi: {error}</Text>}

      <View style={styles.grid}>
        {product?.map((item) => (
          <View key={item.id} style={styles.card}>
            <View>
              <TouchableOpacity onPress={() => handleImagePress(item)}>
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </TouchableOpacity>
              <Text style={styles.productName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.priceText}>{formatPrice(item.price)}</Text>
            </View>

            {/* nút nằm dưới cùng card */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={() => handleAddToCart(item)}
                style={[styles.button, styles.addButton]}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>Thêm vào giỏ</Text>
              </TouchableOpacity>

              {/* <TouchableOpacity
                onPress={() => handleBuyNow(item)}
                style={[styles.button, styles.buyButton]}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>Mua ngay</Text>
              </TouchableOpacity> */}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  cartButtonContainer: {
    alignItems: "flex-end",
    marginVertical: 16,
  },
  cartButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f59e0b",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  cartButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#fef3c7",
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    elevation: 3,
    minHeight: 260,
    flexDirection: "column",
    justifyContent: "space-between", // ✅ đẩy nút xuống cuối
  },

  image: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  productName: {
    fontWeight: "600",
    color: "#1e293b",
    fontSize: 16,
  },
  priceText: {
    color: "#475569",
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#f59e0b",
  },
  buyButton: {
    backgroundColor: "#6366f1",
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});
