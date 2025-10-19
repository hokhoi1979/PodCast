import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../../config/apiConfig";
import {
  GET_ALL_ORDER_ITEM,
  getAllOrderItemFail,
  getAllOrderItemSuccess,
} from "./getAllOrderItemSlice";

function* getAllOrderItemSaga(action) {
  try {
    const id = action.payload;
    const token = yield call(AsyncStorage.getItem, "accessToken");
    const response = yield call(api.get, `api/order-items/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200 || response.status === 201) {
      yield put(getAllOrderItemSuccess(response.data));
      Toast.show({
        type: "success",
        text1: "Fetch all order item successfully",
      });
    } else {
      yield put(getAllOrderItemFail(response.status));
      Toast.show({
        type: "error",
        text1: "Fail to fetch all order item",
      });
    }
  } catch (error) {
    yield put(
      getAllOrderItemFail(error?.response.data.message || error.data.message)
    );
    Toast.show({
      type: "success",
      text1: error.data.message,
    });
  }
}
function* watchGetAllOrderItem() {
  yield takeLatest(GET_ALL_ORDER_ITEM, getAllOrderItemSaga);
}
export default watchGetAllOrderItem;
