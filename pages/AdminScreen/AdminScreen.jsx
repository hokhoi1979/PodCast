import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LogOut } from "lucide-react-native";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { getAllProduct } from "../../redux/Admin/Product/fetchProduct/getAllProductSlice";
import { logout } from "../../redux/auth/loginSlice";

export default function AdminScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const adminFeatures = [
    {
      id: 1,
      title: "Quản lý danh mục",
      icon: "folder",
      color: "#FF6B35",
      onPress: () => navigation.navigate("CategoryManagement"),
    },
    {
      id: 2,
      title: "Quản lý podcast",
      icon: "headphones",
      color: "#4ECDC4",
      onPress: () => {
        dispatch(getAllProduct({ page: 1, size: 50 }));
        navigation.navigate("PodcastManagement");
      },
    },
    {
      id: 3,
      title: "Quản lý người dùng",
      icon: "users",
      color: "#45B7D1",
      onPress: () => navigation.navigate("UserManagement"),
    },
    {
      id: 4,
      title: "Product Management",
      icon: "box",
      color: "#96CEB4",
      onPress: () => navigation.navigate("ProductManagement"),
    },
  ];

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      {
        text: "Hủy",
        style: "cancel",
      },
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

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bảng điều khiển Admin</Text>
        <Text style={styles.headerSubtitle}>Quản lý hệ thống Podcast</Text>
      </View>

      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>
          Chào mừng, {user?.username || "Admin"}!
        </Text>
        <Text style={styles.roleText}>Vai trò: {user?.role || "admin"}</Text>
      </View>

      {/* Admin Features Grid */}
      <View style={styles.featuresContainer}>
        <Text style={styles.sectionTitle}>Chức năng quản lý</Text>
        <View style={styles.featuresGrid}>
          {adminFeatures.map((feature) => (
            <TouchableOpacity
              key={feature.id}
              style={[styles.featureCard, { backgroundColor: feature.color }]}
              onPress={feature.onPress}
              activeOpacity={0.8}
            >
              <View style={styles.featureIconContainer}>
                <Feather name={feature.icon} size={32} color="#fff" />
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Logout Button */}
      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#fff" />
          <Text style={styles.logoutText}>Đăng xuất Admin</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    backgroundColor: "#FF6B35",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  welcomeSection: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 4,
  },
  roleText: {
    fontSize: 16,
    color: "#FF6B35",
    fontWeight: "500",
  },
  featuresContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 15,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featureIconContainer: {
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
  statsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: "#7F8C8D",
  },
  logoutSection: {
    marginHorizontal: 16,
    marginBottom: 30,
  },
  logoutButton: {
    backgroundColor: "#E74C3C",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
