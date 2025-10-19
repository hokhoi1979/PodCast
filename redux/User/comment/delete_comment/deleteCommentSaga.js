import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../../../config/apiConfig";
import {
  DELETE_COMMENT,
  deleteCommentFailure,
  deleteCommentSuccess,
} from "./deleteCommentSlice";

function* deleteCommentSaga(action) {
  try {
    const token = yield call(AsyncStorage.getItem, "accessToken");
    const { id } = action.payload;

    const response = yield call(api.delete, `/api/comments/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200 || response.status === 204) {
      yield put(deleteCommentSuccess(response.data));
      Toast.show({
        type: "success",
        text1: "Xóa bình luận thành công! 🗑️",
      });
    } else {
      yield put(deleteCommentFailure(response.statusText));
      Toast.show({
        type: "error",
        text1: "Xóa bình luận thất bại!",
      });
    }
  } catch (error) {
    console.error("Error deleting comment:", error);
    const errorMessage = error.response?.data?.message || error.message;
    yield put(deleteCommentFailure(errorMessage));
    Toast.show({
      type: "error",
      text1: "Xóa bình luận thất bại!",
      text2: errorMessage,
    });
  }
}

function* watchDeleteComment() {
  yield takeLatest(DELETE_COMMENT, deleteCommentSaga);
}

export default watchDeleteComment;
