import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../../../config/apiConfig";
import {
  DELETE_PRODUCT_REQUEST,
  deleteProductFail,
  deleteProductSuccess,
} from "./deleteProductSlice";

function* deleteProductSaga(action) {
  try {
    const token = yield call(AsyncStorage.getItem, "accessToken");
    const productId = action.payload;

    const response = yield call(api.delete, `api/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      yield put(deleteProductSuccess(productId));
      Toast.show({
        type: "success",
        text1: "Xóa sản phẩm thành công",
      });
    } else {
      yield put(deleteProductFail("Failed to delete product"));
    }
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    yield put(deleteProductFail(msg));
    Toast.show({ type: "error", text1: msg });
  }
}

function* watchDeleteProductSaga() {
  yield takeLatest(DELETE_PRODUCT_REQUEST, deleteProductSaga);
}
export default watchDeleteProductSaga;
