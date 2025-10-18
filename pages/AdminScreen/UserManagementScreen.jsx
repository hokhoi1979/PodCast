import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllUser } from "../../redux/User/manageUser/getAllUser/getAllUserSlice";
import Toast from "react-native-toast-message";
import { MaterialIcons } from "@expo/vector-icons"; // Icon trạng thái
import { banUser } from "../../redux/User/manageUser/banUser/banUserSlice";
import { unBanUser } from "../../redux/User/manageUser/unBanUser/unBanUserSlice";

export default function UserManagementScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { allUser } = useSelector((state) => state.getAllUser);
  const { data } = useSelector((state) => state.banUSer);
  useEffect(() => {
    dispatch(getAllUser());
  }, [dispatch]);

  const handleBanToggle = async (user) => {
    try {
      if (user.active) {
        dispatch(banUser(user?.id));
        Toast.show({
          type: "success",
          text1: "Ban User successful!",
        });
      } else {
        dispatch(unBanUser(user?.id));
        Toast.show({
          type: "success",
          text1: "UnBan User successful!",
        });
      }
      dispatch(getAllUser());
    } catch (err) {
      console.error(err);
      Toast.show({ type: "error", text1: "Có lỗi xảy ra!" });
    }
  };

  console.log("BANAN", data);

  const renderUserItem = ({ item }) => {
    if (item.authorities[0]?.authority === "ROLE_ADMIN") return null;

    return (
      <View style={styles.userCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.fullName}</Text>
          <Text style={styles.username}>@{item.username}</Text>
          <Text style={styles.email}>{item.email}</Text>
          <Text style={styles.role}>
            Vai trò: <Text style={{ fontWeight: "600" }}>{item.role}</Text>
          </Text>

          <View style={styles.statusWrapper}>
            <MaterialIcons
              name="circle"
              size={12}
              color={item.active ? "green" : "red"}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[styles.status, { color: item.active ? "green" : "red" }]}
            >
              {item.active ? "Hoạt động" : "Bị khóa"}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.banButton,
            { backgroundColor: item.active ? "#ff4d4f" : "#52c41a" },
          ]}
          onPress={() => handleBanToggle(item)}
        >
          <Text style={styles.banText}>{item.active ? "Ban" : "Unban"}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Admin")}
          style={styles.backBtn}
        >
          <Text style={styles.backIcon}>‹</Text>
          <Text style={styles.backLabel}>Admin</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quản lý User</Text>
        <View style={{ width: 60 }} />
      </View>

      <FlatList
        data={allUser?.content || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderUserItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 50 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#F8FAFB" },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "space-between",
    marginTop: 20,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingRight: 8,
  },
  backIcon: { fontSize: 24, color: "#FF6B35", lineHeight: 24, marginRight: 4 },
  backLabel: { color: "#FF6B35", fontWeight: "700", fontSize: 14 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#1A1A1A" },

  userCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  name: { fontSize: 16, fontWeight: "700", color: "#1A1A1A" },
  username: { color: "#888", fontSize: 12 },
  email: { color: "#555", marginVertical: 4 },
  role: { fontSize: 13, color: "#888" },
  statusWrapper: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  status: { fontSize: 13, fontWeight: "600" },
  banButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  banText: { color: "#fff", fontWeight: "700", fontSize: 14 },
});
