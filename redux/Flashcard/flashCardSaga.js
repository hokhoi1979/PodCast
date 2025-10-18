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

    const response = yield call(
      api.post,
      "/api/ai/flashcard",
      { reply },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
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
    const errorMessage = error.response?.data?.message || error.message;
    yield put(postFlashCardFailure(errorMessage));
    Toast.show({
      type: "error",
      text1: "Failed to create flashcard!",
      text2: errorMessage,
    });
    console.log(error);
  }
}

function* watchPostFlashCard() {
  yield takeLatest(POST_FLASHCARD_REQUEST, postFlashCardSaga);
}

export default watchPostFlashCard;
