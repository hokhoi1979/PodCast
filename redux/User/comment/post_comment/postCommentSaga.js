import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../../../config/apiConfig";
import {
  POST_COMMENT,
  postCommentFailure,
  postCommentSuccess,
} from "./postCommentSilce";

function* postCommentSaga(action) {
  try {
    const token = yield call(AsyncStorage.getItem, "accessToken");
    const { podcastId, commentUser, content } = action.payload;

    const requestData = {
      podcastId: podcastId,
      commentUser: commentUser,
      content: content,
    };

    const response = yield call(api.post, `/api/comments/create`, requestData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200 || response.status === 201) {
      yield put(postCommentSuccess(response.data));
      Toast.show({
        type: "success",
        text1: "Đã thêm bình luận thành công! 💬",
      });
    } else {
      yield put(postCommentFailure(response.statusText));
      Toast.show({
        type: "error",
        text1: "Thêm bình luận thất bại!",
      });
    }
  } catch (error) {
    console.error("Error posting comment:", error);
    const errorMessage = error.response?.data?.message || error.message;
    yield put(postCommentFailure(errorMessage));
    Toast.show({
      type: "error",
      text1: "Thêm bình luận thất bại!",
      text2: errorMessage,
    });
  }
}

function* watchPostComment() {
  yield takeLatest(POST_COMMENT, postCommentSaga);
}

export default watchPostComment;
