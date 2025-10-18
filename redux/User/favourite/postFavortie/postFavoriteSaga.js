import { call, put, takeLatest } from "redux-saga/effects";

import api from "../../../../config/apiConfig";
import {
  POST__FAVORITE,
  postFavoriteFail,
  postFavoriteSuccess,
} from "./postFavoriteSlice";
import Toast from "react-native-toast-message";
import { getFavoriteSuccess } from "../getFavorite/getFavoriteSlice";

function* postFavoriteSaga(action) {
  try {
    const id = action.payload;
    const response = yield call(api.post, `/api/favorite-podcasts/${id}`);
    if (response.status === 200 || response.status === 201) {
      yield put(postFavoriteSuccess(response.data));
      console.log("DATA", response.data);
    }
    Toast.show({
      type: "success",
      text1: "Save favorite successful!",
    });

    const fetch = yield call(api.get, `/api/favorite-podcasts?page=1&size=100`);
    yield put(getFavoriteSuccess(fetch.data));
  } catch (error) {
    let errorMessage = "Fetch categories failed!";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    console.error("Category fetch error:", error);
    yield put(postFavoriteFail(errorMessage));
  }
}

function* watchPostFavoriteSaga() {
  yield takeLatest(POST__FAVORITE, postFavoriteSaga);
}

export default watchPostFavoriteSaga;
