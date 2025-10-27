import AsyncStorage from "@react-native-async-storage/async-storage";
import { call, put, takeEvery } from "redux-saga/effects";
import api from "../../../../config/apiConfig";
import {
  FETCH_ALL_COMMENT_BY_ORDER_ITEM_ID,
  fetchAllCommentByOrderItemIdFailure,
  fetchAllCommentByOrderItemIdSuccess,
} from "./fetchCommentByOrderItemIdSlice";

function* fetchAllCommentByOrderItemIdSaga(action) {
  try {
    const orderItemId = action.payload;
    const token = yield call(AsyncStorage.getItem, "accessToken");

    const response = yield call(api.get, `api/review/order/${orderItemId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200 || response.status === 201) {
      // API trả về { data: [...], message: "..." }
      const comments = response.data?.data || [];

      // Truyền orderItemId và comments vào success action (luôn dispatch kể cả empty)
      yield put(fetchAllCommentByOrderItemIdSuccess(orderItemId, comments));
    } else {
      console.error("Fetch comments failed with status:", response.status);
      yield put(fetchAllCommentByOrderItemIdFailure(response.status));
    }
  } catch (error) {
    // Vẫn dispatch failure để clear loading state
    yield put(
      fetchAllCommentByOrderItemIdFailure(
        error.response?.data?.message || error.message
      )
    );
  }
}

export default function* watchFetchAllCommentByOrderItemIdSaga() {
  yield takeEvery(
    FETCH_ALL_COMMENT_BY_ORDER_ITEM_ID,
    fetchAllCommentByOrderItemIdSaga
  );
}
