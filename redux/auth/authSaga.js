import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
// Fix import jwt_decode
import { jwtDecode } from "jwt-decode";
import Toast from "react-native-toast-message";
import { all, call, put, takeLatest } from "redux-saga/effects";
import { FETCH_API_LOGIN, fetchFail, fetchSuccess } from "./authSlice";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export function* LoginSaga(action) {
  try {
    const response = yield call(
      axios.post,
      `${API_URL}/api/auth/login`,
      action.payload,
      {
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const accessToken = response?.data?.token;

    if (accessToken) {
      // Fix: Sử dụng jwtDecode thay vì jwt_decode
      const decodedUser = jwtDecode(accessToken);

      yield call(AsyncStorage.setItem, "accessToken", accessToken);

      yield put(
        fetchSuccess({
          user: decodedUser,
          token: accessToken,
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

// export function* watchRegisters(action) {
//   try {
//     console.log("API_URL:", API_URL);
//     console.log("Register payload:", action.payload);

//     const response = yield call(
//       axios.post,
//       `${API_URL}/api/auth/register`,
//       action.payload
//     );

//     console.log("Register response:", response.data);

//     yield put(registerSuccess());
//     Toast.show({ type: "success", text1: "Register successful!" });

//     if (action.onSuccess) {
//       yield call(action.onSuccess);
//     }
//   } catch (error) {
//     console.error("Register error:", error);
//     let errorMessage = "Register failed!";
//     if (error.response?.data?.message) {
//       errorMessage = error.response.data.message;
//     } else if (error.message) {
//       errorMessage = error.message;
//     }
//     yield put(fetchFail(errorMessage));
//   }
// }

export default function* watchLogin() {
  yield all([
    takeLatest(FETCH_API_LOGIN, LoginSaga),
    // takeLatest(FETCH_API_REGISTER, fetchRegister),
  ]);
}
