import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import {
  GET_ORDER_USER,
  getOrderUserFail,
  getOrderUserSuccess,
} from "./getAllOrderByUserSlice";

function* getOrderUserSaga(action) {
  try {
    const token = yield call(AsyncStorage.getItem, "accessToken");

    // ✅ Lấy đúng các field trong payload
    const { userId, page, size } = action.payload;

    const response = yield call(
      axios.get,
      `https://podcast-shoppings-1.onrender.com/api/orders/user/${userId}`,
      {
        params: { page, size },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200 || response.status === 201) {
      yield put(getOrderUserSuccess(response.data));
    } else {
      yield put(getOrderUserFail(response.status));
    }
  } catch (error) {
    yield put(
      getOrderUserFail(error?.response?.data?.message || error.message)
    );
  }
}
function* watchGetOrderUser() {
  yield takeLatest(GET_ORDER_USER, getOrderUserSaga);
}
export default watchGetOrderUser;
