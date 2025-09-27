import { all } from "redux-saga/effects";
import watchLogin from "./auth/loginSaga";
import watchRegister from "./auth/registerSaga";

export default function* rootSaga() {
  yield all([
    watchLogin(),
    watchRegister(), // Thêm register saga
  ]);
}
