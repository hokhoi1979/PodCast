// createPayosSaga.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../../config/apiConfig";
import {
  CREATE_PAYOS_REQUEST,
  createPayosFailure,
  createPayosSuccess,
} from "./createPayosSlice";

function* createPayosSaga(action) {
  try {
    console.log("🔹 PayOS Saga triggered with orderId:", action.payload);
    const token = yield call(AsyncStorage.getItem, "accessToken");
    const orderId = action.payload;

    const response = yield call(
      api.post,
      "payos/create",
      { orderId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("🔹 PayOS response:", response.data);

    if (response.status === 200 && response.data?.error === 0) {
      const payosData = response.data.data;
      yield put(createPayosSuccess(payosData));
    } else {
      yield put(createPayosFailure("Không nhận được URL từ PayOS"));
    }
  } catch (error) {
    console.log("❌ PayOS error:", error);
    yield put(
      createPayosFailure(error.message || "Không nhận được URL từ PayOS")
    );
  }
}

function* watchCreatePayos() {
  yield takeLatest(CREATE_PAYOS_REQUEST, createPayosSaga);
}

export default watchCreatePayos;
