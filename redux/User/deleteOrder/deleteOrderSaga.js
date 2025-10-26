import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../../config/apiConfig";
import {
  DELETE_ORDER,
  deleteOrderFail,
  deleteOrderSuccess,
} from "./deleteOrderSlice";

function* deleteOrderSaga(action) {
  try {
    const token = yield call(AsyncStorage.getItem, "accessToken");
    const { id } = action.payload;

    // <CHANGE> Sửa lại cách gọi API và xử lý response
    const response = yield call(api.delete, `api/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // <CHANGE> Kiểm tra response status đúng cách
    if (response.status === 200 || response.status === 204) {
      yield put(deleteOrderSuccess({ id }));
      Toast.show({
        type: "success",
        text1: "Delete order successfully",
      });
    } else {
      yield put(deleteOrderFail(`Lỗi: ${response.status}`));
      Toast.show({
        type: "error",
        text1: "Fail to delete order",
      });
    }
  } catch (error) {
    // <CHANGE> Sửa lại cách lấy error message từ axios
    console.error("Delete order error:", error);

    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Có lỗi xảy ra khi xóa đơn hàng";

    yield put(deleteOrderFail(errorMessage));
    Toast.show({
      type: "error",
      text1: errorMessage,
    });
  }
}

function* watchDeleteOrder() {
  yield takeLatest(DELETE_ORDER, deleteOrderSaga);
}

export default watchDeleteOrder;
