import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import Toast from "react-native-toast-message";
import { all, call, put, takeLatest } from "redux-saga/effects";
import api from "../../config/apiConfig";
import { FETCH_API_LOGIN, fetchFail, fetchSuccess } from "./authSlice";

export function* LoginSaga(action) {
  try {
    const response = yield call(api.post, "/api/auth/login", action.payload);

    const accessToken = response?.data?.token;

    if (accessToken) {
      const decodedUser = jwtDecode(accessToken);

      yield call(AsyncStorage.setItem, "accessToken", accessToken);

      yield put(
        fetchSuccess({
          user: response.data,
          token: decodedUser,
        })
      );

      Toast.show({
        type: "success",
        text1: "Login successful!",
      });
    } else {
      throw new Error("Email or password is not correct! Try again");
    }
  } catch (error) {
    Toast.show({ type: "error", text1: "Login failed!" });
    console.error("Full error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
    });

    let errorMessage = "Login failed!";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    yield put(fetchFail(errorMessage));
  }
}

export default function* watchLogin() {
  yield all([takeLatest(FETCH_API_LOGIN, LoginSaga)]);
}
