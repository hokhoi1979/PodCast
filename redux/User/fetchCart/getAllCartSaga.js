import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../../config/apiConfig";
import {
  GET_ALL_CART,
  getAllCartFail,
  getAllCartSuccess,
} from "./getAllCartSlice";

function* getAllCartSaga() {
  try {
    const token = yield call(AsyncStorage.getItem, "accessToken");
    const response = yield call(api.get, "api/cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200 || response.status === 201) {
      yield put(getAllCartSuccess(response.data));
      Toast.show({
        type: "success",
        text1: "Fetch all cart success",
      });
    } else {
      yield put(getAllCartFail(response.status));
      Toast.show({
        type: "error",
        text1: "Fetch all cart failed",
      });
    }
  } catch (error) {
    yield put(getAllCartFail(error.message));
    Toast.show({
      type: "error",
      text1: "Fetch all cart failed!",
      text2: error.message,
    });
  }
}

function* watchGetAllCart() {
  yield takeLatest(GET_ALL_CART, getAllCartSaga);
}
export default watchGetAllCart;
