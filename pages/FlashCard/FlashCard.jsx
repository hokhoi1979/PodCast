import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useDispatch, useSelector } from "react-redux";
import { postFlashCardRequest } from "../../redux/Flashcard/flashCardSlice";

export default function FlashcardNative() {
  const [isOpened, setIsOpened] = useState(false);
  const dispatch = useDispatch();

  const {
    loading,
    data: flashResult,
    error,
  } = useSelector((state) => state.postFlashCard);

  const flapAnim = useRef(new Animated.Value(0)).current;
  const letterY = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    if (isOpened) {
      dispatch(
        postFlashCardRequest({
          reply:
            "Tạo câu chuyện ngắn gọn, truyền động lực bằng tiếng Việt. Giữ giọng văn ấm áp và chỉ trả về phần câu chuyện cùng câu nói hay.",
        })
      );
    }

    Animated.parallel([
      Animated.timing(flapAnim, {
        toValue: isOpened ? 1 : 0,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(letterY, {
        toValue: isOpened ? 0 : 40,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [isOpened]);

  const flapRotateX = flapAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const toggleOpen = () => setIsOpened((prev) => !prev);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>✨ Flashcard Truyền Cảm Hứng ✨</Text>

        <TouchableOpacity onPress={toggleOpen} activeOpacity={0.9}>
          {/* Nắp thư */}
          <Animated.View
            style={[
              styles.flap,
              {
                transform: [{ perspective: 1000 }, { rotateX: flapRotateX }],
                backgroundColor: isOpened ? "#facc15" : "#fcd34d",
              },
            ]}
          >
            <Icon
              name={isOpened ? "sun" : "heart"}
              size={60}
              color={isOpened ? "#eab308" : "#ef4444"}
            />
          </Animated.View>

          {/* Thân thư */}
          <View style={styles.body}>
            <Animated.View
              style={{
                transform: [{ translateY: letterY }],
                opacity: isOpened ? 1 : 0.001,
                width: "100%",
              }}
            >
              {loading && (
                <View style={styles.center}>
                  <ActivityIndicator size="large" color="#92400e" />
                  <Text style={styles.loadingText}>
                    Đang viết thư cho bạn...
                  </Text>
                </View>
              )}

              {!loading && flashResult && (
                <ScrollView style={styles.letterScroll}>
                  <Text style={styles.letterText}>{flashResult?.reply}</Text>
                </ScrollView>
              )}

              {!isOpened && !loading && (
                <Text style={styles.hint}>Nhấn để mở phong thư 💌</Text>
              )}
            </Animated.View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffaf0",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#7c2d12",
    marginBottom: 30,
    textAlign: "center",
  },
  flap: {
    width: 400,
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  body: {
    width: 400,
    minHeight: 500,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  letterScroll: {
    width: "100%",
    flexGrow: 1,
  },
  letterText: {
    color: "#4b2e07",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  hint: {
    color: "#92400e",
    marginTop: 10,
    fontStyle: "italic",
    fontSize: 15,
  },
  center: {
    alignItems: "center",
  },
  loadingText: {
    color: "#78350f",
    marginTop: 8,
    fontSize: 15,
  },
  errorText: {
    color: "#b91c1c",
    fontSize: 15,
    marginTop: 10,
    textAlign: "center",
  },
});
