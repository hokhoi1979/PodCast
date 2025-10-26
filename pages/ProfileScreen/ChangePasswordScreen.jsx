import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../../redux/User/changePassword/changePasswordSlice";

export default function ChangePasswordScreen({ navigation }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.changePass);
  const profile = useSelector((state) => state.getProfile?.profile);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Toast.show({ type: "error", text1: "Vui lòng nhập đầy đủ thông tin!" });
      return;
    }
    if (newPassword !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Mật khẩu mới và xác nhận không khớp!",
      });
      return;
    }
    if (!profile?.email) {
      Toast.show({ type: "error", text1: "Không tìm thấy email người dùng!" });
      return;
    }
    const payload = {
      email: profile.email,
      password: oldPassword,
      newPassword,
    };
    dispatch(changePassword(payload));
  };

  return (
    <LinearGradient
      colors={["#D7CCC8", "#EFEBE9"]}
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>🔐 Đổi mật khẩu</Text>

        {profile?.email && (
          <View style={styles.emailBox}>
            <Text style={styles.emailLabel}>Tài khoản</Text>
            <Text style={styles.emailText}>{profile.email}</Text>
          </View>
        )}

        <View style={styles.formBox}>
          <Text style={styles.label}>Mật khẩu cũ</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu cũ"
            secureTextEntry
            value={oldPassword}
            onChangeText={setOldPassword}
          />
          <Text style={styles.label}>Mật khẩu mới</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu mới"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <Text style={styles.label}>Xác nhận mật khẩu mới</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập lại mật khẩu mới"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={handleChangePassword}
          disabled={loading}
        >
          <LinearGradient colors={["#8D6E63", "#5D4037"]} style={styles.button}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Xác nhận đổi mật khẩu</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Quay lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: { flex: 1 },
  container: { flex: 1, padding: 24 },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#4E342E",
    textAlign: "center",
    marginBottom: 25,
  },
  emailBox: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 12,
    padding: 14,
    marginBottom: 25,
  },
  emailLabel: { color: "#6D4C41", fontSize: 13 },
  emailText: { color: "#3E2723", fontWeight: "600", fontSize: 16 },
  formBox: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 16,
    padding: 20,
  },
  label: { color: "#5D4037", fontSize: 14, marginBottom: 6 },
  input: {
    borderColor: "#D7CCC8",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    color: "#3E2723",
  },
  buttonContainer: { marginTop: 24 },
  button: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  backBtn: { marginTop: 20, alignItems: "center" },
  backText: { color: "#5D4037", fontSize: 15, textDecorationLine: "underline" },
});
