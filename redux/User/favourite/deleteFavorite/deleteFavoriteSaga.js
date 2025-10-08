import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../../../config/apiConfig";
import Toast from "react-native-toast-message";
import { getFavoriteSuccess } from "../getFavorite/getFavoriteSlice";
import {
  DELETE__FAVORITE,
  deleteFavoriteFail,
  deleteFavoriteSuccess,
} from "./deleteFavoriteSlice";

function* deleteFavoriteSaga(action) {
  try {
    const id = action.payload;
    const response = yield call(api.delete, `/api/favorite-podcasts/${id}`);
    if (
      response.status === 200 ||
      response.status === 201 ||
      response.status === 204
    ) {
      yield put(deleteFavoriteSuccess({ id }));

      console.log("DELETE SC", id);

      Toast.show({
        type: "success",
        text1: "Remove favorite successful!",
      });
    }

    const fetch = yield call(api.get, `/api/favorite-podcasts?page=1&size=100`);
    yield put(getFavoriteSuccess(fetch.data));
  } catch (error) {
    let errorMessage = "Fetch categories failed!";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    console.error("Category fetch error:", error);
    yield put(deleteFavoriteFail(errorMessage));
  }
}

function* watchDeleteFavoriteSaga() {
  yield takeLatest(DELETE__FAVORITE, deleteFavoriteSaga);
}

export default watchDeleteFavoriteSaga;
