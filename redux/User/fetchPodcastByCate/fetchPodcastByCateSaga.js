import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../../config/apiConfig";
import {
  FETCH_ALL_PODCAST_BY_CATE,
  fetchAllPodcastByCateFail,
  fetchAllPodcastByCateSuccess,
} from "./fetchPodcastByCateSlice";

function* fetchPodcastByCateSaga(action) {
  try {
    const token = yield call(AsyncStorage.getItem, "accessToken");
    const categoryName = action.payload?.categoryName || "All";
    const response = yield call(
      api.get,
      `/api/podcasts/category/${categoryName}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: action.payload?.page || 1, // Default to page 1 if not provided
          size: action.payload?.size || 10, // Default to size 10 if not provided
        },
      }
    );
    console.log("Fetch Podcast By Category response:", response.data);
    yield put(fetchAllPodcastByCateSuccess(response.data));
  } catch (error) {
    let errorMessage = "Fetch podcasts by category failed!";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    }
    Toast.show({
      type: "error",
      text1: "Fetch podcasts by category failed!",
      text2: errorMessage,
    });
    yield put(fetchAllPodcastByCateFail(errorMessage));
  }
}

function* watchFetchPodcastByCateSaga() {
  yield takeLatest(FETCH_ALL_PODCAST_BY_CATE, fetchPodcastByCateSaga);
}
export default watchFetchPodcastByCateSaga;
