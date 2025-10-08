import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../../config/apiConfig";
import {
  POST_LETTER,
  postLetterFailure,
  postLetterSuccess,
} from "./postLetterSlice";

function* postLetterSaga(action) {
  try {
    const token = yield call(AsyncStorage.getItem, "accessToken");
    const { recipient, title, description, sendTime } = action.payload;

    const response = yield call(
      api.post,
      `/api/emails/schedule`,
      {
        title: title,
        description: description,
        sendTime: sendTime, // Format: "2025-10-07T12:24:24.396Z"
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: {
          recipient: recipient, // Email người nhận
        },
      }
    );

    yield put(postLetterSuccess(response.data));
    Toast.show({
      type: "success",
      text1: "Thư đã được lên lịch gửi thành công! 🎉",
    });
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    yield put(postLetterFailure(errorMessage));
    Toast.show({
      type: "error",
      text1: "Gửi thư thất bại!",
      text2: errorMessage,
    });
  }
}

function* watchPostLetter() {
  yield takeLatest(POST_LETTER, postLetterSaga);
}

export default watchPostLetter;
