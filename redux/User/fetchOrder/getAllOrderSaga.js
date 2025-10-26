import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../../config/apiConfig";
import {
  GET_ALL_ORDER,
  getAllOrderFail,
  getAllOrderSuccess,
} from "./getAllOrderSlice";

function* getAllOrderSaga(action) {
  try {
    const id = action.payload;
    const token = yield call(AsyncStorage.getItem, "accessToken");
    const response = yield call(api.get, `api/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200 || response.status === 201) {
      yield put(getAllOrderSuccess(response.data));
      Toast.show({
        type: "success",
        text1: "Fetch all order successfully",
      });
    } else {
      yield put(getAllOrderFail(response.status));
      Toast.show({
        type: "error",
        text1: "Fail to fetch order",
      });
    }
  } catch (error) {
    yield put(
      getAllOrderFail(error?.response.data.message || error.data.message)
    );
    Toast.show({
      type: "error",
      text1: error.data.message,
    });
  }
}
function* watchGetAllOrder() {
  yield takeLatest(GET_ALL_ORDER, getAllOrderSaga);
}
export default watchGetAllOrder;
