import AsyncStorage from "@react-native-async-storage/async-storage";
import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../../../config/apiConfig";
import {
  GET_ALL_PRODUCT,
  getAllProductFail,
  getAllProductSuccess,
} from "./getAllProductSlice";

function* getAllProductSaga(action) {
  try {
    const token = yield call(AsyncStorage.getItem, "accessToken");
    const response = yield call(api.get, `/api/products/active`, {
      params: {
        page: action.payload.page,
        size: action.payload.size,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200 || response.status === 201) {
      yield put(getAllProductSuccess(response.data));
      console.log(response.data);
    } else {
      yield put(getAllProductFail(response.status));
    }
  } catch (error) {
    yield put(
      getAllProductFail(error.response?.data?.message || error.message)
    );
    console.log(error.response?.data?.message || error.message);
  }
}
function* watchGetAllProduct() {
  yield takeLatest(GET_ALL_PRODUCT, getAllProductSaga);
}
export default watchGetAllProduct;
