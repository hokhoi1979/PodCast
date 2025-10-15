import { call, put, takeLatest } from "redux-saga/effects";

import api from "../../../../config/apiConfig";

import Toast from "react-native-toast-message";
import {
  GET__ALL__USER,
  getAllUserFailure,
  getAllUserSuccess,
} from "./getAllUserSlice";

function* getAllUserSaga(action) {
  try {
    const response = yield call(api.get, `/api/users?page=1&size=100`);
    if (response.status === 200 || response.status === 201) {
      yield put(getAllUserSuccess(response.data));
      console.log("DATA", response.data);
    }
  } catch (error) {
    let errorMessage = "Fetch categories failed!";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    console.error("Category fetch error:", error);
    yield put(getAllUserFailure(errorMessage));
  }
}

function* watchGetAllUserSaga() {
  yield takeLatest(GET__ALL__USER, getAllUserSaga);
}

export default watchGetAllUserSaga;
