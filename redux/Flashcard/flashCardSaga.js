import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../config/apiConfig";
import {
  POST_FLASHCARD_REQUEST,
  postFlashCardFailure,
  postFlashCardSuccess,
} from "./flashCardSlice";

function* postFlashCardSaga(action) {
  try {
    const token = yield call(AsyncStorage.getItem, "accessToken");
    const { reply } = action.payload;

    // Retry mechanism với timeout riêng cho flashcard
    const response = yield call(
      api.post,
      "/api/ai/flashcard",
      { reply },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 45000, // 45 giây cho AI API
      }
    );

    if (response.status === 200 || response.status === 201) {
      yield put(postFlashCardSuccess(response.data));
      Toast.show({
        type: "success",
        text1: "Flashcard created successfully! 🎉",
      });
    } else {
      yield put(postFlashCardFailure(response.statusText));
      Toast.show({
        type: "error",
        text1: "Failed to create flashcard!",
        text2: response.statusText || "Unexpected error",
      });
    }
  } catch (error) {
    let errorMessage = "Có lỗi xảy ra khi tạo flashcard";

    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      errorMessage = "Kết nối quá chậm, vui lòng thử lại";
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    yield put(postFlashCardFailure(errorMessage));
    Toast.show({
      type: "error",
      text1: "Không thể tạo flashcard",
      text2: errorMessage,
      visibilityTime: 4000,
    });
    console.log("Flashcard error:", error);
  }
}

function* watchPostFlashCard() {
  yield takeLatest(POST_FLASHCARD_REQUEST, postFlashCardSaga);
}

export default watchPostFlashCard;
