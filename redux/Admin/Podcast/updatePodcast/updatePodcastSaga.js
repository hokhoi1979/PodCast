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

    // Tạo FormData và thêm tất cả parameters vào FormData thay vì query string
    const formData = data || new FormData();

    // Thêm text fields vào FormData
    if (params.title) formData.append("title", params.title);
    if (params.description) formData.append("description", params.description);

    // Category phải là array<integer> trong FormData
    if (params.category && params.category.length > 0) {
      params.category.forEach((catId) => {
        formData.append("category", catId);
      });
    }

    const url = `/api/podcasts/${id}`;

    console.log("Update URL:", url);
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
