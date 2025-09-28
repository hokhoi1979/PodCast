import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import Toast from "react-native-toast-message";
import { all, call, put, takeLatest } from "redux-saga/effects";
import api from "../../config/apiConfig";
import { FETCH_API_LOGIN, fetchFail, fetchSuccess } from "./loginSlice";

export function* LoginSaga(action) {
  try {
    console.log("Login payload:", action.payload);

    const response = yield call(api.post, "/api/auth/login", action.payload);
    console.log("Login response:", response.data);

    const accessToken = response?.data?.token;

    if (accessToken) {
      const decodedUser = jwtDecode(accessToken);
      console.log("Decoded JWT:", decodedUser);

      yield call(AsyncStorage.setItem, "accessToken", accessToken);
      // user Details with role
      let userData = { ...response.data };

      try {
        if (decodedUser.sub) {
          const userDetailsResponse = yield call(
            api.get,
            `/api/users/${decodedUser.sub}`
          );

          userData = {
            ...userData,
            ...userDetailsResponse.data,
          };
        }
      } catch (apiError) {
        Toast.show({ type: "error", text1: "Failed to fetch user details!" });
      }

      yield put(
        fetchSuccess({
          user: userData,
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
