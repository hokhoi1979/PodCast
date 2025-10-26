import AsyncStorage from "@react-native-async-storage/async-storage";
import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../../config/apiConfig";
import {
  FETCH_PRODUCT_DETAIL,
  fetchProductDetailFail,
  fetchProductDetailSuccess,
} from "./fetchAllProductDetailSlice";

function* fetchProductDetailSaga(action) {
  try {
    const token = yield call(AsyncStorage.getItem, "accessToken");
    const response = yield call(api.get, `api/products/${action.payload}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200 || response.status === 201) {
      yield put(fetchProductDetailSuccess(response.data));
    } else {
      yield put(fetchProductDetailFail(response.status));
    }
  } catch (error) {
    yield put(
      fetchProductDetailFail(error.response?.data?.message || error.message)
    );
  }
}
function* watchFetchProductDetailSaga() {
  yield takeLatest(FETCH_PRODUCT_DETAIL, fetchProductDetailSaga);
}
export default watchFetchProductDetailSaga;
