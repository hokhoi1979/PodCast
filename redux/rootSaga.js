import { all } from "redux-saga/effects";
import watchLogin from "./auth/authSaga";

export default function* rootSaga() {
  yield all([watchLogin()]);
}
