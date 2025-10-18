import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../../config/apiConfig";
import {
  GET_PROFILE,
  getProfileFail,
  getProfileSuccess,
} from "./getProfileSlice";

function* getProfileSaga(action) {
  try {
    const token = yield call(AsyncStorage.getItem, "accessToken");
    const id = action.payload;
    const response = yield call(api.get, `api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200 || response.status === 201) {
      yield put(getProfileSuccess(response.data));
      Toast.show({
        type: "success",
        text1: "Fetch profile successfully",
      });
    } else {
      yield put(getProfileFail(response.status));
      Toast.show({
        type: "error",
        text1: "Fail to fetch profile user",
      });
    }
  } catch (error) {
    yield put(getProfileFail(error.data.message));
    Toast.show({
      type: "error",
      text1: error.data.message,
    });
  }
}
function* watchGetProfile() {
  yield takeLatest(GET_PROFILE, getProfileSaga);
}
export default watchGetProfile;
