import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../../../config/apiConfig";
import {
  UPDATE_PRODUCT_REQUEST,
  updateProductFail,
  updateProductSuccess,
} from "./updateProductSlice";

function* updateProductSaga(action) {
  try {
    const token = yield call(AsyncStorage.getItem, "accessToken");
    const { formData, productId, query = {} } = action.payload;

    const response = yield call(
      api.put,
      `api/products/${productId}`,
      formData,
      {
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
      }
    );

    if (response.status === 200) {
      yield put(updateProductSuccess(response.data));
      Toast.show({
        type: "success",
        text1: "Cập nhật sản phẩm thành công",
      });
    } else {
      yield put(updateProductFail("Failed to update product"));
    }
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    yield put(updateProductFail(msg));
    Toast.show({ type: "error", text1: msg });
  }
}

function* watchUpdateProductSaga() {
  yield takeLatest(UPDATE_PRODUCT_REQUEST, updateProductSaga);
}
export default watchUpdateProductSaga;
