import AsyncStorage from "@react-native-async-storage/async-storage";
import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../../../config/apiConfig";
import {
  UPDATE_PODCAST_REQUEST,
  updatePodcastFail,
  updatePodcastSuccess,
} from "./updatePodcastSlice";

function* updatePodcastSaga(action) {
  try {
    const { id, data, params } = action.payload;
    const token = yield call(AsyncStorage.getItem, "accessToken");

    // Build query string từ params
    const queryParams = new URLSearchParams();
    if (params.title) queryParams.append("title", params.title);
    if (params.description)
      queryParams.append("description", params.description);

    // Category phải là array trong query string
    if (params.category && params.category.length > 0) {
      params.category.forEach((catId) => {
        queryParams.append("category", catId);
      });
    }

    const url = `/api/podcasts/${id}?${queryParams.toString()}`;

    console.log("Update URL:", url);

    // LUÔN gửi FormData (rỗng nếu không có file)
    const formData = data || new FormData();

    console.log("FormData parts:", formData._parts || []);

    const response = yield call(api.put, url, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    yield put(updatePodcastSuccess(response.data));
  } catch (error) {
    console.error("Update podcast error:", error.response?.data || error);
    const errorMessage =
      error.response?.data?.message || "Update podcast failed!";
    yield put(updatePodcastFail(errorMessage));
  }
}

function* watchUpdatePodcastSaga() {
  yield takeLatest(UPDATE_PODCAST_REQUEST, updatePodcastSaga);
}

export default watchUpdatePodcastSaga;
