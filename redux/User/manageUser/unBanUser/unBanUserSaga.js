import { call, put, takeLatest } from "redux-saga/effects";

import api from "../../../../config/apiConfig";
import {
  UN__BAN__USER,
  unBanUserFail,
  unBanUserSuccess,
} from "./unBanUserSlice";
import { getAllUserSuccess } from "../getAllUser/getAllUserSlice";

function* unBanUserSaga(action) {
  try {
    const id = action.payload;
    const response = yield call(api.put, `/api/users/reactivate/${id}`);
    if (response.status === 200 || response.status === 201) {
      yield put(unBanUserSuccess(response.data));
    }

    const fetch = yield call(api.get, `/api/users?page=1&size=100`);
    yield put(getAllUserSuccess(fetch.data));
  } catch (error) {
    let errorMessage = "Fetch categories failed!";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    console.error("Category fetch error:", error);
    yield put(unBanUserFail(errorMessage));
  }
}

function* watchUnBanUserSaga() {
  yield takeLatest(UN__BAN__USER, unBanUserSaga);
}

export default watchUnBanUserSaga;
