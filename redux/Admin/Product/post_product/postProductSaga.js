import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../../../config/apiConfig";
import {
  POST_PRODUCT_REQUEST,
  productPostFailure,
  productPostSucess,
} from "./postProductSlice";

function* postProductSaga(action) {
  try {
    const token = yield call(AsyncStorage.getItem, "accessToken");

    const payload = action.payload;
    const formData = payload?.form || payload;
    const query = payload?.query || {};

    const res = yield call(api.post, "/api/products", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },

      params: {
        name: query.name?.trim(),
        description: query.description || "",
        price: query.price,
        stockQuantity: query.stockQuantity,
      },
    });

    yield put(productPostSucess(res.data));
  } catch (error) {
    const msg =
      error.response?.data?.message || error.message || "Post product error";
    yield put(productPostFailure(msg));
    Toast.show({ type: "error", text1: msg });
  }
}

function* watchPostProductSaga() {
  yield takeLatest(POST_PRODUCT_REQUEST, postProductSaga);
}
export default watchPostProductSaga;
