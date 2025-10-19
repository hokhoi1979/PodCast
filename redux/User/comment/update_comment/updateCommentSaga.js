import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../../../config/apiConfig";
import {
  UPDATE_COMMENT,
  updateCommentFailure,
  updateCommentSuccess,
} from "./updateCommentSlice";

function* updateCommentSaga(action) {
  try {
    const token = yield call(AsyncStorage.getItem, "accessToken");
    const { commentId, podcastId, commentUser, content } = action.payload;

    const requestData = {
      podcastId: podcastId,
      commentUser: commentUser,
      content: content,
    };

    const response = yield call(
      api.put,
      `/api/comments/update/${commentId}`,
      requestData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200 || response.status === 201) {
      yield put(updateCommentSuccess(response.data));
      Toast.show({
        type: "success",
        text1: "Cập nhật bình luận thành công! ✏️",
      });
    } else {
      yield put(updateCommentFailure(response.statusText));
      Toast.show({
        type: "error",
        text1: "Cập nhật bình luận thất bại!",
      });
    }
  } catch (error) {
    console.error("Error updating comment:", error);
    const errorMessage = error.response?.data?.message || error.message;
    yield put(updateCommentFailure(errorMessage));
    Toast.show({
      type: "error",
      text1: "Cập nhật bình luận thất bại!",
      text2: errorMessage,
    });
  }
}

function* watchUpdateComment() {
  yield takeLatest(UPDATE_COMMENT, updateCommentSaga);
}

export default watchUpdateComment;
