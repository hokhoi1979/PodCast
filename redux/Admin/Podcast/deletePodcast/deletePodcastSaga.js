import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../../../config/apiConfig";
import {
  DELETE_PODCAST_REQUEST,
  deletePodcastFailure,
  deletePodcastSuccess,
} from "./deletePodcastSlice";

function* deletePodcastSaga(action) {
  try {
    const token = yield call(AsyncStorage.getItem, "accessToken");
    const response = yield call(api.delete, `/api/podcasts/${action.payload}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200 || response.status === 204) {
      yield put(deletePodcastSuccess(response.data));
      Toast.show({
        type: "success",
        text1: "Xóa podcast thành công",
      });
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    yield put(deletePodcastFailure(errorMessage));
    Toast.show({
      type: "error",
      text1: "Xóa podcast thất bại",
      text2: errorMessage,
    });
  }
}

function* watchDeletePodcast() {
  yield takeLatest(DELETE_PODCAST_REQUEST, deletePodcastSaga);
}
export default watchDeletePodcast;
