import AsyncStorage from "@react-native-async-storage/async-storage";
import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../../../config/apiConfig";
import {
  FETCH_ALL_COMMENT_BY_USER_REQUEST,
  fetchAllCommentByUserFailure,
  fetchAllCommentByUserSuccess,
} from "./fetchCommentByUserSlice";

function* fetchAllCommentByUserSaga(action) {
  try {
    const token = yield call(AsyncStorage.getItem, "accessToken");
    const response = yield call(api.get, `api/review/user/${action.payload}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200 || response.status === 201) {
      yield put(fetchAllCommentByUserSuccess(response.data));
    } else {
      yield put(fetchAllCommentByUserFailure("Failed to fetch comments"));
    }
  } catch (error) {
    yield put(fetchAllCommentByUserFailure(error.message));
  }
}
function* watchFetchAllCommentByUserSaga() {
  yield takeLatest(
    FETCH_ALL_COMMENT_BY_USER_REQUEST,
    fetchAllCommentByUserSaga
  );
}
export default watchFetchAllCommentByUserSaga;
