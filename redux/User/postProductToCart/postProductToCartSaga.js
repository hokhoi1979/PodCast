import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../../config/apiConfig";
import {
  ADD_TO_CART,
  addToCartFail,
  addToCartSuccess,
} from "./postProductToCartSlice";

function* addToCartSaga(action) {
  try {
    const token = yield call(AsyncStorage.getItem, "accessToken");
    const response = yield call(
      api.post,
      "/api/cartItem",
      null, // body = null, vì API chỉ nhận query param
      {
        params: {
          productId: action.payload.productId,
          quantity: action.payload.quantity,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200 || response.status === 201) {
      yield put(addToCartSuccess(response.data));
      Toast.show({
        type: "success",
        text1: "Add to cart successfully",
      });
    } else {
      yield put(addToCartFail(response.status));
      Toast.show({
        type: "error",
        text1: "Fail to add to cart!",
      });
    }
  } catch (error) {
    yield put(addToCartFail(error.response?.data?.message || error.message));
    Toast.show({
      type: "error",
      text1: error.message,
    });
  }
}
function* watchAddToCart() {
  yield takeLatest(ADD_TO_CART, addToCartSaga);
}
export default watchAddToCart;
