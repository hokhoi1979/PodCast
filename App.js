import React from "react";
import AppNavigation from "./navigation/AppNavigation";
import Toast from "react-native-toast-message";

export default function App() {
  return (
    <>
      <AppNavigation />
      <Toast /> {/* Thêm Toast ở đây */}
    </>
  );
}
