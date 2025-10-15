import { call, put, takeLatest } from "redux-saga/effects";

import api from "../../../../config/apiConfig";

import { BAN__USER, banUserFail, banUserSuccess } from "./banUserSlice";
import { getAllUserSuccess } from "../getAllUser/getAllUserSlice";

function* banUserSaga(action) {
  try {
    const id = action.payload;
    const response = yield call(api.delete, `/api/users/${id}`);
    if (response.status === 200 || response.status === 201) {
      yield put(banUserSuccess(response.data));
      // console.log("BAN", response.data);
    }

    const fetch = yield call(api.get, `/api/users?page=1&size=100`);
    yield put(getAllUserSuccess(fetch.data));
  } catch (error) {
    let errorMessage = "Fetch categories failed!";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    console.error("Category fetch error:", error);
    yield put(banUserFail(errorMessage));
  }
}

function* watchBanUserSaga() {
  yield takeLatest(BAN__USER, banUserSaga);
}

export default watchBanUserSaga;
