import AsyncStorage from "@react-native-async-storage/async-storage";
import { LogOut } from "lucide-react-native";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/auth/loginSlice";
import { getProfile } from "../../redux/User/profile/getProfileSlice";

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.getProfile);
  const userId = useSelector((state) => state.auth?.user?.id);

  useEffect(() => {
    if (userId) {
      dispatch(getProfile(userId));
    }
  }, [dispatch, userId]);

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("accessToken");
            dispatch(logout());
            Toast.show({ type: "success", text1: "Đăng xuất thành công!" });
            navigation.replace("SignIn");
          } catch (error) {
            Toast.show({ type: "error", text1: "Đăng xuất thất bại!" });
          }
        },
      },
    ]);
  };

  const handleTrackOrder = () => {
    navigation.navigate("TrackOrder", { userId });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{
            uri: "https://static.vecteezy.com/system/resources/thumbnails/017/800/528/small_2x/user-simple-flat-icon-illustration-vector.jpg",
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{profile?.fullName || "Người dùng"}</Text>
        <Text style={styles.email}>{profile?.email}</Text>
      </View>

      {/* Thông tin */}
      <View style={styles.infoCard}>
        {loading ? (
          <ActivityIndicator size="large" color="#8B4513" />
        ) : error ? (
          <Text style={styles.errorText}>Lỗi tải dữ liệu: {error}</Text>
        ) : profile && profile.id ? (
          <>
            <InfoItem label="Mã người dùng" value={profile.id} />
            <InfoItem label="Tên đăng nhập" value={profile.username} />
            <InfoItem
              label="Số điện thoại"
              value={profile.phoneNumber || "Chưa cập nhật"}
            />
            <InfoItem
              label="Trạng thái"
              value={profile.active ? "Hoạt động" : "Bị khóa"}
              color={profile.active ? "#2E8B57" : "#E53E3E"}
            />
          </>
        ) : (
          <Text style={styles.errorText}>
            Không tìm thấy dữ liệu người dùng.
          </Text>
        )}
      </View>

      {/* Nút hành động */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.trackBtn} onPress={handleTrackOrder}>
          <Text style={styles.trackText}>Theo dõi đơn hàng</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={18} color="#fff" />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const InfoItem = ({ label, value, color = "#333" }) => (
  <View style={styles.infoItem}>
    <Text style={styles.label}>{label}</Text>
    <Text style={[styles.value, { color }]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
  },
  header: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2F2F2F",
  },
  email: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  infoItem: {
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  label: {
    fontSize: 14,
    color: "#888",
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 2,
  },
  actions: {
    alignItems: "center",
    marginTop: 25,
    paddingBottom: 50,
  },
  trackBtn: {
    backgroundColor: "#FFB703",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    width: "80%",
    alignItems: "center",
    marginBottom: 12,
  },
  trackText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  logoutBtn: {
    backgroundColor: "#E63946",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    width: "80%",
    gap: 6,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  errorText: {
    color: "#E53E3E",
    textAlign: "center",
    fontSize: 15,
  },
});
