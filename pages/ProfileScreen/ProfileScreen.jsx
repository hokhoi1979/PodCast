import AsyncStorage from "@react-native-async-storage/async-storage";
import { LogOut } from "lucide-react-native";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/auth/loginSlice";

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("accessToken");

            dispatch(logout());

            Toast.show({
              type: "success",
              text1: "Logged out successfully!",
            });

            navigation.replace("SignIn");
          } catch (error) {
            console.error("Logout error:", error);
            Toast.show({
              type: "error",
              text1: "Logout failed!",
            });
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ProfileScreen</Text>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={20} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F0",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#2C1810",
    marginBottom: 40,
  },
  logoutButton: {
    backgroundColor: "#E53E3E",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 150,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
