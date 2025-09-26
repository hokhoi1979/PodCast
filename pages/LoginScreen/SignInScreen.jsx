/* eslint-disable react/no-unescaped-entities */
import LottieView from "lottie-react-native";
import { LockKeyhole, Mail } from "lucide-react-native";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { FETCH_API_LOGIN } from "../../redux/auth/authSlice";

export default function SignInScreen({ navigation }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth); // Add state selector
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    dispatch({
      type: FETCH_API_LOGIN,
      payload: { username: email, passwordHash: password },
      onSuccess: ({ user }) => {
        console.log("Login success, user:", user);
        const role = user?.role || user?.authorities?.[0] || "USER";
        if (role?.toString().toUpperCase().includes("ADMIN")) {
          navigation.replace("Admin");
        } else {
          navigation.replace("MainApp");
        }
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.illustrationContainer}>
        <LottieView
          source={require("../../assests/Voicemail.json")}
          autoPlay
          loop
          style={{ width: 250, height: 250 }}
        />
      </View>

      <View style={styles.form}>
        {error && <Text style={styles.errorText}>{error}</Text>}

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

        <TouchableOpacity
          style={[styles.signUpButton, loading && styles.disabledButton]}
          onPress={handleSignIn}
          disabled={loading}
        >
          <Text style={styles.signUpText}>
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

        <View style={{ alignItems: "center" }}>
          <Text style={{ marginVertical: 10, fontSize: 14, color: "#888" }}>
            Or
          </Text>
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.footerText}>
            Don't have an account?{" "}
            <Text
              style={styles.linkText}
              onPress={() => navigation.navigate("SignUp")}
            >
              Sign Up
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
  illustration: {
    width: 180,
    height: 200,
    marginBottom: 16,
    borderRadius: 30,
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    height: "40%",
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
