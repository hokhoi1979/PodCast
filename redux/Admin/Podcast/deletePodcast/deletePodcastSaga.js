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
    const token = yield call(AsyncStorage.getItem, "token");
    const response = yield call(api.delete, `/podcasts/${action.payload}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      yield put(deletePodcastSuccess(response.data));
      Toast.show({
        type: "success",
        text1: "Podcast deleted successfully",
      });
    }
  } catch (error) {
    yield put(deletePodcastFailure(error.message));
    Toast.show({
      type: "error",
      text1: "Failed to delete podcast",
      text2: error.message,
    });
  }
}

function* watchDeletePodcast() {
  yield takeLatest(DELETE_PODCAST_REQUEST, deletePodcastSaga);
}
export default watchDeletePodcast;
