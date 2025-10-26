import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../../config/apiConfig";
import {
  CHANGE_PASSWORD,
  changePasswordFail,
  changePasswordSuccess,
} from "./changePasswordSlice";

function* changePasswordSaga(action) {
  try {
    const token = yield call(AsyncStorage.getItem, "accessToken");
    const response = yield call(
      api.post,
      `api/users/change-password`,
      action.payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200 || response.status === 201) {
      yield put(changePasswordSuccess(response.data));
      Toast.show({
        type: "success",
        text1: "Cập nhật mật khẩu thành công",
      });
    } else {
      yield put(changePasswordFail(response.status));
      Toast.show({
        type: "error",
        text1: "Cập nhật mật khẩu thất bại",
      });
    }
  } catch (error) {
    yield put(
      changePasswordFail(error.response?.data?.message || "Lỗi không xác định")
    );
    Toast.show({
      type: "error",
      text1: "Cập nhật mật khẩu thất bại",
      text2: error.response?.data?.message || "Vui lòng thử lại sau",
    });
  }
}
function* watchChangePassword() {
  yield takeLatest(CHANGE_PASSWORD, changePasswordSaga);
}
export default watchChangePassword;
