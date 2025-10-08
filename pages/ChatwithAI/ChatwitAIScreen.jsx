import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatwithAIScreen() {
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Xin chào 👋 Mình là AI, bạn muốn nói về điều gì hôm nay?",
      sender: "ai",
    },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMsg = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    // Giả lập phản hồi AI sau 1.2s
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "AI đang suy nghĩ... 🤔\nBạn có thể kể thêm về điều đó không?",
          sender: "ai",
        },
      ]);
    }, 1200);
  };

  const renderItem = ({ item }) => {
    const isUser = item.sender === "user";
    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userContainer : styles.aiContainer,
        ]}
      >
        {!isUser && (
          <View style={styles.avatar}>
            <Ionicons name="chatbubbles" size={18} color="#fff" />
          </View>
        )}
        <View
          style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}
        >
          <Text style={isUser ? styles.userText : styles.aiText}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="chatbubbles" size={22} color="#946f4a" />
        <Text style={styles.headerTitle}>Chat with AI</Text>
      </View>

      {/* Danh sách tin nhắn */}
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 480 }}
      />

      {/* Ô nhập tin nhắn */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 80}
        style={styles.inputWrapper}
      >
        <View style={styles.textBox}>
          <TextInput
            style={styles.input}
            placeholder="Nhập tin nhắn..."
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Ionicons name="send" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fefcf7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  headerTitle: {
    marginLeft: 6,
    fontSize: 18,
    fontWeight: "600",
    color: "#946f4a",
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-end",
  },
  aiContainer: {
    alignSelf: "flex-start",
  },
  userContainer: {
    alignSelf: "flex-end",
    flexDirection: "row-reverse",
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#946f4a",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  bubble: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 14,
  },
  aiBubble: {
    backgroundColor: "#f1e8df",
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: "#946f4a",
    borderBottomRightRadius: 4,
  },
  aiText: {
    color: "#333",
    fontSize: 15,
  },
  userText: {
    color: "#fff",
    fontSize: 15,
  },
  textBox: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#f1e8df",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    fontSize: 16,
    color: "#333",
    paddingRight: 8,
  },
  sendButton: {
    backgroundColor: "#946f4a",
    borderRadius: 20,
    padding: 10,
  },
  inputWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fefcf7",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
    zIndex: 10,
    marginBottom: 90,
  },
});
