import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../../config/apiConfig";
import {
  getAllOrderFail,
  getAllOrderSuccess,
} from "../fetchOrder/getAllOrderSlice";
import {
  UPDATE_ADDRESS_REQUEST,
  updateAddressFailure,
  updateAddressSuccess,
} from "./updateAddressSlice";

function* updateAddressSaga(action) {
  try {
    const token = yield call(AsyncStorage.getItem, "accessToken");
    const { id, address } = action.payload;
    const response = yield call(
      api.put,
      `api/orders/update-address`,
      { orderId: Number(id), address },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200 || response.status === 204) {
      yield put(updateAddressSuccess(response.data));
      Toast.show({
        type: "success",
        text1: "Cập nhật địa chỉ thành công",
      });
      const fetch = yield call(api.get, `api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (fetch.status === 200 || fetch.status === 201) {
        yield put(getAllOrderSuccess(fetch.data));
      } else {
        yield put(getAllOrderFail(fetch.status));
      }
    } else {
      yield put(updateAddressFailure(response.status));
      Toast.show({
        type: "error",
        text1: "Cập nhật địa chỉ thất bại",
      });
    }
  } catch (error) {
    const message =
      error?.response?.data?.message || error?.message || "Unknown error";
    yield put(updateAddressFailure(message));
    Toast.show({
      type: "error",
      text1: `Cập nhật địa chỉ thất bại: ${message}`,
    });
  }
}

export function* watchUpdateAddressSaga() {
  yield takeLatest(UPDATE_ADDRESS_REQUEST, updateAddressSaga);
}
