import Toast from "react-native-toast-message";
import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../../config/apiConfig";
import {
  GET__PODCAST__ID,
  getPodcastIdFail,
  getPodcastIdSuccess,
} from "./fetchPodcastByIdSlice";

function* getPodcastIdSaga(action) {
  try {
    const id = action.payload;
    const response = yield call(api.get, `/api/podcasts/${id}`);
    yield put(getPodcastIdSuccess(response.data));
    console.log("RESPONSE", response.data);
  } catch (error) {
    let errorMessage = "Fetch all podcasts failed!";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    }
    Toast.show({
      type: "error",
      text1: "Fetch podcasts failed!",
      text2: errorMessage,
    });
    yield put(getPodcastIdFail(errorMessage));
  }
}
function* watchGetPodcastIdSaga() {
  yield takeLatest(GET__PODCAST__ID, getPodcastIdSaga);
}
export default watchGetPodcastIdSaga;
