import AsyncStorage from "@react-native-async-storage/async-storage";
import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../../config/apiConfig";
import {
  CANCEL_PAYMENT,
  cancelPaymentFail,
  cancelPaymentSuccess,
} from "./cancelPaymentSlice";

function* cancelPaymentSaga(action) {
  try {
    const token = yield call(AsyncStorage.getItem, "accessToken");
    const orderCode = action.payload; // 🟡 Chính là transactionId

    console.log("🟢 Gửi yêu cầu hủy PayOS với orderCode:", orderCode);

    const response = yield call(
      api.put,
      `payos/cancel?transactionId=${orderCode}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.status === 200 || response.status === 204) {
      yield put(cancelPaymentSuccess(response.data));
    } else {
      yield put(cancelPaymentFail(response.status));
    }
  } catch (error) {
    console.log("❌ Lỗi hủy PayOS:", error.message);
    yield put(cancelPaymentFail(error));
  }
}

function* watchCancelPayment() {
  yield takeLatest(CANCEL_PAYMENT, cancelPaymentSaga);
}

export default watchCancelPayment;
