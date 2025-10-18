import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../../config/apiConfig";
import {
  UPDATE_CART_ITEM,
  updateCartItemFail,
  updateCartItemSuccess,
} from "./updateCartItemSlice";

function* updateCartItemSaga(action) {
  try {
    const token = yield call(AsyncStorage.getItem, "accessToken");
    const { cartItemId, quantity } = action.payload;

    const response = yield call(
      api.put,
      `api/cartItem/${cartItemId}?quantity=${quantity}`,
      {}, // body rỗng
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200 || response.status === 201) {
      yield put(updateCartItemSuccess(response.data));
      Toast.show({
        type: "success",
        text1: "Update cart item successfully",
      });
    } else {
      yield put(updateCartItemFail(response.status));
      Toast.show({
        type: "error",
        text1: "Fail to update cart item",
      });
    }
  } catch (error) {
    yield put(updateCartItemFail(error.message));
    Toast.show({
      type: "error",
      text1: error.message,
    });
  }
}

function* watchUpdateCartItem() {
  yield takeLatest(UPDATE_CART_ITEM, updateCartItemSaga);
}
export default watchUpdateCartItem;
