import AsyncStorage from "@react-native-async-storage/async-storage";
import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../../../config/apiConfig";
import {
  GET_COMMENTS,
  getCommentsFailure,
  getCommentsSuccess,
} from "./fetchCommentSlice";

function* getCommentsSaga(action) {
  try {
    const token = yield call(AsyncStorage.getItem, "accessToken");
    const podcastId = action.payload;

    const response = yield call(api.get, `/api/comments/podcast/${podcastId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      yield put(getCommentsSuccess(response.data));
    } else {
      yield put(getCommentsFailure(response.statusText));
    }
  } catch (error) {
    console.error("Error fetching comments:", error);
    const errorMessage = error.response?.data?.message || error.message;
    yield put(getCommentsFailure(errorMessage));
  }
}

function* watchGetComments() {
  yield takeLatest(GET_COMMENTS, getCommentsSaga);
}

export default watchGetComments;
