import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../../config/apiConfig";
import {
  CHECKOUT_CART,
  checkoutCartFail,
  checkoutCartSuccess,
} from "./checkoutCartSlice";

function* checkoutCartSaga() {
  try {
    const token = yield call(AsyncStorage.getItem, "accessToken");
    const response = yield call(
      api.post,
      "api/cart/checkout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200 || response.status === 201) {
      yield put(checkoutCartSuccess(response.data));
      Toast.show({
        type: "success",
        text1: "Order successfully",
      });
    } else {
      yield put(checkoutCartFail(response.status));
      Toast.show({
        type: "error",
        text1: "Fail to order item",
      });
    }
  } catch (error) {
    yield put(checkoutCartFail(error?.response.data.message));
    Toast.show({
      type: "error",
      text1: error?.response.data.message,
    });
  }
}
function* watchCheckoutCart() {
  yield takeLatest(CHECKOUT_CART, checkoutCartSaga);
}
export default watchCheckoutCart;
