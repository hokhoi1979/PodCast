import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Lock, LogOut, Package, Phone, User } from "lucide-react-native";
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
    if (userId) dispatch(getProfile(userId));
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
          } catch {
            Toast.show({ type: "error", text1: "Đăng xuất thất bại!" });
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={["#A1887F", "#D7CCC8", "#EFEBE9"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri:
                profile?.avatar ||
                "https://cdn-icons-png.flaticon.com/512/3177/3177440.png",
            }}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.name}>{profile?.fullName || "Người dùng"}</Text>
        <Text style={styles.email}>
          {profile?.email || "Chưa cập nhật email"}
        </Text>
      </LinearGradient>

      <View style={styles.infoCard}>
        {loading ? (
          <ActivityIndicator size="large" color="#6A5ACD" />
        ) : error ? (
          <Text style={styles.errorText}>Lỗi tải dữ liệu: {error}</Text>
        ) : (
          <>
            <InfoItem
              icon={<User size={18} color="#5D4037" />}
              label="Tên đăng nhập"
              value={profile?.username}
            />
            <InfoItem
              icon={<Phone size={18} color="#5D4037" />}
              label="Số điện thoại"
              value={profile?.phoneNumber || "Chưa cập nhật"}
            />
            <InfoItem
              icon={<Lock size={18} color="#5D4037" />}
              label="Trạng thái"
              value={profile?.active ? "Hoạt động" : "Bị khóa"}
              color={profile?.active ? "#2E8B57" : "#E53E3E"}
            />
          </>
        )}
      </View>

      <View style={styles.actions}>
        <GradientButton
          colors={["#FFA726", "#FB8C00"]}
          icon={<Package size={18} color="#fff" />}
          text="Theo dõi đơn hàng"
          onPress={() => navigation.navigate("TrackOrder", { userId })}
        />
        <GradientButton
          colors={["#64B5F6", "#2196F3"]}
          icon={<Lock size={18} color="#fff" />}
          text="Đổi mật khẩu"
          onPress={() => navigation.navigate("ChangePassword")}
        />
        <GradientButton
          colors={["#E57373", "#D32F2F"]}
          icon={<LogOut size={18} color="#fff" />}
          text="Đăng xuất"
          onPress={handleLogout}
        />
      </View>
    </ScrollView>
  );
}

const GradientButton = ({ colors, icon, text, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{ width: "80%", marginBottom: 12 }}
  >
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBtn}
    >
      {icon}
      <Text style={styles.btnText}>{text}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

const InfoItem = ({ icon, label, value, color = "#333" }) => (
  <View style={styles.infoItem}>
    <View style={styles.infoLeft}>
      {icon}
      <Text style={styles.label}>{label}</Text>
    </View>
    <Text style={[styles.value, { color }]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFEBE9",
  },
  header: {
    alignItems: "center",
    paddingVertical: 50,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    marginBottom: 25,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#fff",
  },
  name: {
    fontSize: 22,
    fontWeight: "800",
    color: "#3E2723",
  },
  email: {
    fontSize: 14,
    color: "#5D4037",
    marginTop: 6,
  },
  infoCard: {
    backgroundColor: "#FAF3E0",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomColor: "rgba(0,0,0,0.05)",
    borderBottomWidth: 1,
  },
  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  label: {
    fontSize: 15,
    color: "#4E342E",
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
  },
  actions: {
    alignItems: "center",
    marginTop: 20,
    paddingBottom: 50,
  },
  gradientBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
  },
  btnText: {
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
