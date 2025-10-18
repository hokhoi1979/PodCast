import AsyncStorage from "@react-native-async-storage/async-storage";
import { LogOut } from "lucide-react-native";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar } from "react-native-paper";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/auth/loginSlice";
import { getProfile } from "../../redux/User/profile/getProfileSlice";

const { height } = Dimensions.get("window");

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
            Toast.show({
              type: "success",
              text1: "Đăng xuất thành công!",
            });
            navigation.replace("SignIn");
          } catch (error) {
            console.error("Logout error:", error);
            Toast.show({
              type: "error",
              text1: "Đăng xuất thất bại!",
            });
          }
        },
      },
    ]);
  };

  const handleTrackOrder = () => {
    console.log("➡ ProfileScreen userId:", userId);
    navigation.navigate("TrackOrder", { userId });
  };

  useEffect(() => {
    console.log("ProfileScreen mounted. userId:", userId);
    if (userId) {
      dispatch(getProfile(userId));
    }
  }, [dispatch, userId]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileSection}>
        {loading ? (
          <ActivityIndicator size="large" color="#8B4513" />
        ) : error ? (
          <Text style={styles.errorText}>Lỗi tải dữ liệu: {error}</Text>
        ) : profile && profile.id ? (
          <>
            <View style={styles.avatarContainer}>
              <Avatar.Icon
                size={90}
                icon="account"
                color="#fff"
                style={{ backgroundColor: "#D2B48C" }}
              />
              <Text style={styles.userName}>
                {profile.fullName || "Người dùng"}
              </Text>
              <Text style={styles.userEmail}>{profile.email}</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>ID:</Text>
              <Text style={styles.infoValue}>{profile.id}</Text>

              <Text style={styles.infoLabel}>Tên đăng nhập:</Text>
              <Text style={styles.infoValue}>{profile.username}</Text>

              <Text style={styles.infoLabel}>Số điện thoại:</Text>
              <Text style={styles.infoValue}>
                {profile.phoneNumber || "Chưa cập nhật"}
              </Text>

              <Text style={styles.infoLabel}>Trạng thái:</Text>
              <Text
                style={[
                  styles.statusText,
                  { color: profile.active ? "#4CAF50" : "#E53E3E" },
                ]}
              >
                {profile.active ? "Hoạt động" : "Bị khóa"}
              </Text>
            </View>
          </>
        ) : (
          <Text style={styles.errorText}>
            Không tìm thấy dữ liệu người dùng.
          </Text>
        )}
      </View>

      {/* 🔹 Nút Đăng xuất */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.trackButton} onPress={handleTrackOrder}>
          <Text style={styles.trackText}>Theo dõi đơn hàng</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#fff" />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF8F3",
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#5C3A21",
    marginTop: 10,
  },
  userEmail: {
    fontSize: 15,
    color: "#8B6914",
    marginTop: 4,
  },
  infoBox: {
    width: "90%",
    backgroundColor: "#FFF9E5",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  infoLabel: {
    fontSize: 14,
    color: "#8B6914",
    fontWeight: "600",
    marginTop: 10,
  },
  infoValue: {
    fontSize: 16,
    color: "#3E2723",
    fontWeight: "500",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  errorText: {
    color: "#E53E3E",
    textAlign: "center",
    fontSize: 16,
  },
  logoutContainer: {
    alignItems: "center",
    marginTop: 30,
    paddingBottom: 50,
  },
  logoutButton: {
    backgroundColor: "#E53E3E",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 180,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  trackButton: {
    backgroundColor: "#8B4513",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 180,
    marginBottom: 12,
  },
  trackText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
