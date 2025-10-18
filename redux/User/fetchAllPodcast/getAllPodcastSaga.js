import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../../config/apiConfig";
import {
  FETCH_ALL_PODCAST,
  fetchAllPodcastFail,
  fetchAllPodcastSuccess,
} from "./getAllPodcastSlice";

function* getAllPodcastSaga(action) {
  try {
    const token = yield call(AsyncStorage.getItem, "accessToken");
    const response = yield call(api.get, "/api/podcasts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page: action.payload?.page || 1, // Default to page 0 if not provided
        size: action.payload?.size || 10, // Default to size 10 if not provided
      },
    });
    yield put(fetchAllPodcastSuccess(response.data));
  } catch (error) {
    let errorMessage = "Fetch all podcasts failed!";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    }
    Toast.show({
      type: "error",
      text1: "Fetch all podcasts failed!",
      text2: errorMessage,
    });
    yield put(fetchAllPodcastFail(errorMessage));
  }
}
function* watchGetAllPodcastSaga() {
  yield takeLatest(FETCH_ALL_PODCAST, getAllPodcastSaga);
}
export default watchGetAllPodcastSaga;
