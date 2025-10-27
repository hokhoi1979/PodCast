import AsyncStorage from "@react-native-async-storage/async-storage";
import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../../../config/apiConfig";
import {
  FETCH_ALL_COMMENT_BY_PRODUCT,
  fetchAllCommentByProductFailure,
  fetchAllCommentByProductSuccess,
} from "./fetchCommentByProductSlice";

function* fetchAllCommentByProductSaga(action) {
  try {
    const token = yield call(AsyncStorage.getItem, "accessToken");
    const response = yield call(
      api.get,
      `api/review/product/${action.payload}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200 || response.status === 201) {
      // API trả về { data: [...], message: "..." }
      const comments = response.data?.data || response.data || [];
      yield put(fetchAllCommentByProductSuccess(comments));
    } else {
      yield put(fetchAllCommentByProductFailure("Failed to fetch comments"));
    }
  } catch (error) {
    yield put(fetchAllCommentByProductFailure(error));
  }
}
export default function* watchFetchAllCommentByProductSaga() {
  yield takeLatest(FETCH_ALL_COMMENT_BY_PRODUCT, fetchAllCommentByProductSaga);
}
