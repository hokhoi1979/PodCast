import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../../../config/apiConfig";
import {
  CREATE_COMMENT_REQUEST,
  createCommentFailure,
  createCommentSuccess,
} from "./createCommentSlice";

function* createCommentSaga(action) {
  try {
    const token = yield call(AsyncStorage.getItem, "accessToken");
    const response = yield call(api.post, `api/review/create`, action.payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200 || response.status === 201) {
      yield put(createCommentSuccess(response.data));
      Toast.show({
        type: "success",
        text1: "Comment created successfully",
      });
      // Không cần fetch lại comment ở đây vì RatingModal đã tự fetch
    } else {
      yield put(createCommentFailure("Failed to create comment"));
      Toast.show({
        type: "error",
        text1: "Failed to create comment",
      });
    }
  } catch (error) {
    yield put(createCommentFailure(error.message));
    Toast.show({
      type: "error",
      text1: "An error occurred while creating comment",
    });
  }
}
function* watchCreateCommentSaga() {
  yield takeLatest(CREATE_COMMENT_REQUEST, createCommentSaga);
}
export default watchCreateCommentSaga;
