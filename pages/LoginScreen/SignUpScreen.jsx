import LottieView from "lottie-react-native";
import { LockKeyhole, Mail, User } from "lucide-react-native";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { FETCH_API_REGISTER } from "../../redux/auth/registerSlice"; // Thay đổi import

export default function SignUpScreen({ navigation }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.register); // Thêm selector
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const normalizePhone = (raw) => raw.replace(/\D+/g, "");

  const handleSignUp = () => {
    if (!fullName || !email || !password || !phoneNumber) {
      Toast.show({ type: "error", text1: "Vui lòng nhập đầy đủ thông tin" });
      return;
    }

    const digits = normalizePhone(phoneNumber);
    if (digits.length < 9 || digits.length > 11) {
      Toast.show({ type: "error", text1: "Số điện thoại không hợp lệ" });
      return;
    }

    dispatch({
      type: FETCH_API_REGISTER,
      payload: {
        email,
        username: email,
        phoneNumber: digits,
        fullName,
        passwordHash: password,
      },
      onSuccess: () => {
        navigation.replace("SignIn");
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        <LottieView
          source={require("../../assests/Voicemail.json")}
          autoPlay
          loop
          style={{ width: 250, height: 250 }}
        />
      </View>

      {/* Form */}
      <View style={styles.form}>
        {/* Error message */}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* Phone Number */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>+84</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            placeholderTextColor="#9ca3af"
            maxLength={14}
          />
        </View>

        {/* Full Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>
            <User />
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Email */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>
            <Mail />
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Password */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>
            <LockKeyhole />
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Button */}
        <TouchableOpacity
          style={[styles.signUpButton, loading && styles.disabledButton]}
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text style={styles.signUpText}>
            {loading ? "Signing Up..." : "Sign Up"}
          </Text>
        </TouchableOpacity>

        {/* Or */}
        <View style={{ alignItems: "center" }}>
          <Text style={{ marginVertical: 10, fontSize: 14, color: "#888" }}>
            Or
          </Text>
        </View>

        {/* Footer */}
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Text
              style={styles.linkText}
              onPress={() => navigation.navigate("SignIn")}
            >
              Login
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fbe7ba",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  illustrationContainer: {
    alignItems: "center",
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    height: "60%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },
  signUpButton: {
    backgroundColor: "#fbbf24",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  signUpText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerText: {
    marginTop: 15,
    color: "black",
    fontSize: 14,
  },
  linkText: {
    color: "#fbbf24",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 14,
  },
  disabledButton: {
    opacity: 0.6,
  },
});
