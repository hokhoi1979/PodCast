import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../../../config/apiConfig";
import {
  POST_PODCAST_REQUEST,
  postPodcastFailure,
  postPodcastSuccess,
} from "./postPodcastSlice";

function* postPodcastSaga(action) {
  try {
    const token = yield call(AsyncStorage.getItem, "accessToken");
    const formData = action.payload;
    const res = yield call(api.post, "/api/podcasts/upload", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    yield put(postPodcastSuccess(res.data));
  } catch (error) {
    const msg =
      error.response?.data?.message || error.message || "Post podcast error";
    yield put(postPodcastFailure(msg));
    Toast.show({ type: "error", text1: msg });
  }
}

function* watchPostPodcastSaga() {
  yield takeLatest(POST_PODCAST_REQUEST, postPodcastSaga);
}
export default watchPostPodcastSaga;
