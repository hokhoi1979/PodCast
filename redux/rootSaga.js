import { all } from "redux-saga/effects";
import watchLogin from "./auth/loginSaga";
import watchRegister from "./auth/registerSaga";
import watchGetAllPodcastSaga from "./User/fetchAllPodcast/getAllPodcastSaga";
import watchFetchCategorySaga from "./User/fetchCategory/fetchCategorySaga";
import watchFetchPodcastByCateSaga from "./User/fetchPodcastByCate/fetchPodcastByCateSaga";

export default function* rootSaga() {
  yield all([
    watchLogin(),
    watchRegister(), // Thêm register saga
    watchGetAllPodcastSaga(),
    watchFetchCategorySaga(),
    watchFetchPodcastByCateSaga(),
  ]);
}
