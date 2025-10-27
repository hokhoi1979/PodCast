import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // Tăng timeout lên 30 giây cho AI API
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to headers
api.interceptors.request.use(
  async (config) => {
    console.log("UIRL", API_URL);

    const token = await AsyncStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Xử lý timeout riêng cho AI API
    if (error.code === "ECONNABORTED" && error.config?.url?.includes("/ai/")) {
      console.error("AI API timeout:", error.message);
    } else {
      console.error("API error:", error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
