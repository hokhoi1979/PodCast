import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../../config/apiConfig";
import {
  getOrderUserFail,
  getOrderUserSuccess,
} from "../fetchOrderByUser/getAllOrderByUserSlice";
import {
  UPDATE_STATUS_ORDER,
  updateStatusOrderFail,
  updateStatusOrderSuccess,
} from "./updateStatusOrderSlice";

function* updateStatusOrderSaga(action) {
  try {
    const token = yield call(AsyncStorage.getItem, "accessToken");
    // payload: { id, status, userId, page, size }
    const { id, status, userId, page = 1, size = 50 } = action.payload;

    // body phải là object status: 'confirmed' (không đóng gói thêm)
    const body = { status };

    const response = yield call(api.put, `api/orders/${id}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200 || response.status === 204) {
      // response.data có thể là order mới hoặc rỗng tuỳ API
      yield put(updateStatusOrderSuccess(response.data));
      Toast.show({
        type: "success",
        text1: "Cập nhật trạng thái đơn hàng thành công",
      });

      // fetch lại danh sách order của user (có Authorization)
      const fetch = yield call(api.get, `api/orders/user/${userId}`, {
        params: { page, size },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (fetch.status === 200 || fetch.status === 201) {
        yield put(getOrderUserSuccess(fetch.data));
      } else {
        yield put(getOrderUserFail(fetch.status));
      }
    } else {
      yield put(updateStatusOrderFail(response.status));
      Toast.show({
        type: "error",
        text1: "Cập nhật trạng thái thất bại",
      });
    }
  } catch (error) {
    const message =
      error?.response?.data?.message || error?.message || "Unknown error";
    yield put(updateStatusOrderFail(message));
    Toast.show({
      type: "error",
      text1: message,
    });
  }
}

function* watchUpdateStatusOrder() {
  yield takeLatest(UPDATE_STATUS_ORDER, updateStatusOrderSaga);
}

export default watchUpdateStatusOrder;
