import { all } from "redux-saga/effects";
import watchLogin from "./auth/loginSaga";
import watchRegister from "./auth/registerSaga";
import watchCancelPayment from "./User/cancelPayment/cancelPaymentSaga";
import watchCheckoutCart from "./User/checkoutCart/checkoutCartSaga";
import watchDeleteCartItem from "./User/deleteCartItem/deleteCartItemSaga";
import watchDeleteOrder from "./User/deleteOrder/deleteOrderSaga";
import watchGetAllPodcastSaga from "./User/fetchAllPodcast/getAllPodcastSaga";
import watchGetAllProduct from "./User/fetchAllProduct/getAllProductSaga";
import watchGetAllCart from "./User/fetchCart/getAllCartSaga";
import watchFetchCategorySaga from "./User/fetchCategory/fetchCategorySaga";
import watchGetAllOrder from "./User/fetchOrder/getAllOrderSaga";
import watchGetOrderUser from "./User/fetchOrderByUser/getAllOrderByUserSaga";
import watchGetAllOrderItem from "./User/fetchOrderItem/getAllOrderItemSaga";
import watchFetchPodcastByCateSaga from "./User/fetchPodcastByCate/fetchPodcastByCateSaga";
import watchCreatePayos from "./User/payos/createPayosSaga";
import watchAddToCart from "./User/postProductToCart/postProductToCartSaga";
import watchGetProfile from "./User/profile/getProfileSaga";
import watchUpdateCartItem from "./User/updateCartItem/updateCartItemSaga";
import watchUpdateStatusOrder from "./User/updateStatusOrder/updateStatusOrderSaga";

export default function* rootSaga() {
  yield all([
    watchLogin(),
    watchRegister(), // Thêm register saga
    watchGetAllPodcastSaga(),
    watchFetchCategorySaga(),
    watchFetchPodcastByCateSaga(),
    watchGetAllProduct(),

    //cart
    watchAddToCart(),
    watchGetAllCart(),
    watchUpdateCartItem(),
    watchDeleteCartItem(),
    watchCheckoutCart(),

    //order
    watchGetAllOrder(),
    watchGetOrderUser(),
    watchGetAllOrderItem(),
    watchDeleteOrder(),
    watchUpdateStatusOrder(),

    //profile
    watchGetProfile(),

    //payos
    watchCreatePayos(),

    //cancel payment
    watchCancelPayment(),
  ]);
}
