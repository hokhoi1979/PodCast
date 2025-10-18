import Toast from "react-native-toast-message";
import { all, call, put, takeLatest } from "redux-saga/effects";
import api from "../../config/apiConfig";
import {
  FETCH_API_REGISTER,
  registerFail,
  registerSuccess,
} from "./registerSlice";

export function* RegisterSaga(action) {
  try {
    console.log("Register payload:", action.payload);

    const response = yield call(api.post, "/api/auth/register", action.payload);

    yield put(registerSuccess());

    Toast.show({
      type: "success",
      text1: "Register successful!",
      text2: "Please login with your account",
    });

    if (action.onSuccess) {
      yield call(action.onSuccess);
    }
  } catch (error) {
    Toast.show("Register error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
    });

    let errorMessage = "Register failed!";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    }

    Toast.show({
      type: "error",
      text1: "Registration failed!",
      text2: errorMessage,
    });

    yield put(registerFail(errorMessage));
  }
}

export default function* watchRegister() {
  yield all([takeLatest(FETCH_API_REGISTER, RegisterSaga)]);
}
