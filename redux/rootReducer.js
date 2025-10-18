import { combineReducers } from "redux";
import accountReducers from "./auth/loginSlice";
import registerReducer from "./auth/registerSlice";
import cancelPaymentReducer from "./User/cancelPayment/cancelPaymentSlice";
import checkoutCartReducer from "./User/checkoutCart/checkoutCartSlice";
import deleteCartItemReducer from "./User/deleteCartItem/deleteCartItemSlice";
import deleteOrderReducer from "./User/deleteOrder/deleteOrderSlice";
import getAllPodcastReducer from "./User/fetchAllPodcast/getAllPodcastSlice";
import getAllProductReducer from "./User/fetchAllProduct/getAllProductSlice";
import getAllCartReducer from "./User/fetchCart/getAllCartSlice";
import fetchCategoryReducer from "./User/fetchCategory/fetchCategorySlice";
import getAllOrderReducer from "./User/fetchOrder/getAllOrderSlice";
import getOrderUserReducer from "./User/fetchOrderByUser/getAllOrderByUserSlice";
import getAllOrderItemReducer from "./User/fetchOrderItem/getAllOrderItemSlice";
import fetchPodcastByCateReducer from "./User/fetchPodcastByCate/fetchPodcastByCateSlice";
import createPayosReducer from "./User/payos/createPayosSlice";
import addToCartReducer from "./User/postProductToCart/postProductToCartSlice";
import getProfileReducer from "./User/profile/getProfileSlice";
import updateCartItemReducer from "./User/updateCartItem/updateCartItemSlice";
import updateStatusOrderReducer from "./User/updateStatusOrder/updateStatusOrderSlice";
const rootReducer = combineReducers({
  auth: accountReducers,
  register: registerReducer,
  fetchAllPodcast: getAllPodcastReducer,
  fetchAllCategory: fetchCategoryReducer,
  fetchPodcastByCate: fetchPodcastByCateReducer,
  fetchProduct: getAllProductReducer,
  addProduct: addToCartReducer,

  //cart
  cart: getAllCartReducer,
  updateCart: updateCartItemReducer,
  deleteCart: deleteCartItemReducer,
  checkoutCart: checkoutCartReducer,

  //order
  order: getAllOrderReducer,
  orderUser: getOrderUserReducer,
  orderItem: getAllOrderItemReducer,
  deleteOrderId: deleteOrderReducer,
  updateStatus: updateStatusOrderReducer,

  //profile
  getProfile: getProfileReducer,

  //payos
  createPayos: createPayosReducer,

  //cancel payment
  cancelPayos: cancelPaymentReducer,
});

export default rootReducer;
