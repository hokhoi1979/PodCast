import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../../config/apiConfig";
import {
  DELETE_CART_ITEM,
  deleteCartItemFail,
  deleteCartItemSuccess,
} from "./deleteCartItemSlice";

function* deleteCartItemSaga(action) {
  try {
    const token = yield call(AsyncStorage.getItem, "accessToken");
    const cartItemId = action.payload;
    const response = yield call(api.delete, `api/cartItem/${cartItemId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200 || response.status === 204) {
      yield put(deleteCartItemSuccess(response.data));
      Toast.show({
        type: "success",
        text1: "Delete cart item successfully",
      });
    } else {
      yield put(deleteCartItemFail(response.status));
      Toast.show({
        type: "error",
        text1: "Fail to delete cart item",
      });
    }
  } catch (error) {
    yield put(deleteCartItemFail(error.message));
    Toast.show({
      type: "error",
      text1: error.message,
    });
  }
}

function* watchDeleteCartItem() {
  yield takeLatest(DELETE_CART_ITEM, deleteCartItemSaga);
}
export default watchDeleteCartItem;
