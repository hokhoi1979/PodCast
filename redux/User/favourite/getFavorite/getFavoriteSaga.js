import { call, put, takeLatest } from "redux-saga/effects";

import api from "../../../../config/apiConfig";
import {
  GET__FAVORITE,
  getFavoriteFail,
  getFavoriteSuccess,
} from "./getFavoriteSlice";

function* getFavoriteSaga() {
  try {
    const response = yield call(
      api.get,
      `/api/favorite-podcasts?page=1&size=100`
    );
    if (response.status === 200 || response.status === 201) {
      yield put(getFavoriteSuccess(response.data));
    }
  } catch (error) {
    let errorMessage = "Fetch categories failed!";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    console.error("Category fetch error:", error);
    yield put(getFavoriteFail(errorMessage));
  }
}

function* watchGetFavoriteSaga() {
  yield takeLatest(GET__FAVORITE, getFavoriteSaga);
}

export default watchGetFavoriteSaga;
