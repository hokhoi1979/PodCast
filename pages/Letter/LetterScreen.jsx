import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { postLetter } from "../../redux/User/letter/postLetterSlice";
import Header from "../../shared/header/Header";

export default function LetterScreen() {
  const [recipient, setRecipient] = useState("");
  const [letterTitle, setLetterTitle] = useState("");
  const [letterDesc, setLetterDesc] = useState("");
  const [sendTime, setSendTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const dispatch = useDispatch();
  const { success: letterSuccess, loading } = useSelector(
    (state) => state.postLetter
  );

  // Reset form sau khi gửi thành công
  useEffect(() => {
    if (letterSuccess) {
      setRecipient("");
      setLetterTitle("");
      setLetterDesc("");
      setSendTime(new Date());
    }
  }, [letterSuccess]);

  const handleSubmitLetter = () => {
    if (!recipient.trim() || !letterTitle.trim() || !letterDesc.trim()) {
      Toast.show({ type: "error", text1: "Vui lòng điền đầy đủ thông tin" });
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipient)) {
      Toast.show({ type: "error", text1: "Email không hợp lệ" });
      return;
    }

    // Kiểm tra thời gian gửi phải > hiện tại
    if (sendTime <= new Date()) {
      Toast.show({
        type: "error",
        text1: "Thời gian gửi phải sau thời điểm hiện tại",
      });
      return;
    }

    dispatch(
      postLetter({
        recipient: recipient.trim(),
        title: letterTitle.trim(),
        description: letterDesc.trim(),
        sendTime: sendTime.toISOString(),
      })
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerSection}>
            <Ionicons name="mail" size={48} color="#946f4a" />
            <Text style={styles.title}>Gửi Thư Lên Lịch</Text>
            <Text style={styles.subtitle}>
              Lên lịch gửi email cho người thân và bạn bè
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email người nhận *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="example@email.com"
                value={recipient}
                onChangeText={setRecipient}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tiêu đề *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Nhập tiêu đề thư"
                value={letterTitle}
                onChangeText={setLetterTitle}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nội dung *</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Nhập nội dung thư..."
                value={letterDesc}
                onChangeText={setLetterDesc}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Thời gian gửi *</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={20} color="#946f4a" />
                <Text style={styles.dateText}>
                  {sendTime.toLocaleString("vi-VN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={sendTime}
                  mode="datetime"
                  display="default"
                  onChange={(event, date) => {
                    setShowDatePicker(false);
                    if (date) setSendTime(date);
                  }}
                  minimumDate={new Date()}
                />
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                loading && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmitLetter}
              disabled={loading}
            >
              <Ionicons
                name="send"
                size={20}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.submitButtonText}>
                {loading ? "Đang gửi..." : "Lên lịch gửi"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4EDE4", // Màu nền be nhạt như giấy cũ nhẹ
  },
  flex: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 28,
    paddingTop: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: "600",
    color: "#5C4033",
    marginTop: 10,
    marginBottom: 6,
    fontFamily: Platform.OS === "ios" ? "Palatino" : "serif",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#8B6F47",
    textAlign: "center",
    paddingHorizontal: 24,
    fontStyle: "italic",
    fontFamily: Platform.OS === "ios" ? "Palatino-Italic" : "serif",
  },
  formContainer: {
    backgroundColor: "#FFFBF6", // Màu giấy sáng hơn, cảm giác ấm và sạch
    borderRadius: 10,
    padding: 24,
    shadowColor: "#7B6650",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#E4D5C4",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6D4C41",
    marginBottom: 8,
    letterSpacing: 0.4,
    fontFamily: Platform.OS === "ios" ? "Palatino" : "serif",
  },
  textInput: {
    backgroundColor: "#FFFDF9",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#D8C9B5",
    color: "#3E2723",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  textArea: {
    minHeight: 160,
    textAlignVertical: "top",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#D8C9B5",
    backgroundColor: "#FFFDF9",
    padding: 10,
    fontSize: 16,
    lineHeight: 24,
    color: "#3E2723",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFDF9",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#D8C9B5",
    gap: 10,
  },
  dateText: {
    fontSize: 16,
    color: "#3E2723",
    flex: 1,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  submitButton: {
    flexDirection: "row",
    backgroundColor: "#A47C48", // Màu nâu vàng cổ điển, nhẹ nhàng hơn
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
    shadowColor: "#7B6650",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: "#CBBBA0",
    shadowOpacity: 0,
  },
  submitButtonText: {
    color: "#FFFDF9",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
});
