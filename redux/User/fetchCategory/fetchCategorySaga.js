import AsyncStorage from "@react-native-async-storage/async-storage";
import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../../config/apiConfig";
import {
  FETCH_ALL_CATEGORY,
  fetchAllCategoryFail,
  fetchAllCategorySuccess,
} from "./fetchCategorySlice";

function* fetchCategorySaga(action) {
  try {
    const token = yield call(AsyncStorage.getItem, "accessToken");
    const response = yield call(api.get, "/api/categories", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Fetch Category response:", response.data);
    yield put(fetchAllCategorySuccess(response.data));
  } catch (error) {
    let errorMessage = "Fetch categories failed!";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    console.error("Category fetch error:", error);
    yield put(fetchAllCategoryFail(errorMessage));
  }
}

function* watchFetchCategorySaga() {
  yield takeLatest(FETCH_ALL_CATEGORY, fetchCategorySaga);
}

export default watchFetchCategorySaga;
