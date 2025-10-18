import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../config/apiConfig";
import { POST__CHAT, postChatFail, postChatSuccess } from "./chatAiSlice";

function* postChatSaga(action) {
  try {
    const response = yield call(api.post, `/api/ai/chat`, action.payload);
    if (response.status === 200 || response.status === 201) {
      yield put(postChatSuccess(response.data));
      console.log("DATA", response.data);
    }
  } catch (error) {
    let errorMessage = "Post chat failed!";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    console.error("Post chat error:", error);
    yield put(postChatFail(errorMessage));
  }
}

function* watchPostChatSaga() {
  yield takeLatest(POST__CHAT, postChatSaga);
}

export default watchPostChatSaga;
