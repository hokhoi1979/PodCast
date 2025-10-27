import { combineReducers } from "redux";
import categoryManagementReducer from "./Admin/categoryManagement/categoryManagementSlice";
import deletePodcastReducer from "./Admin/Podcast/deletePodcast/deletePodcastSlice";
import postPodcastReducer from "./Admin/Podcast/postPosdcast/postPodcastSlice";
import updatePodcastReducer from "./Admin/Podcast/updatePodcast/updatePodcastSlice";
import deleteProductReducer from "./Admin/Product/delete_product/deleteProductSlice";
import getAllProductReducer from "./Admin/Product/fetchProduct/getAllProductSlice";
import postProductReducer from "./Admin/Product/post_product/postProductSlice";
import updateProductReducer from "./Admin/Product/update_Product/updateProductSlice";
import accountReducers from "./auth/loginSlice";
import registerReducer from "./auth/registerSlice";
import postChatReducer from "./ChatAI/chatAiSlice";
import postFlashCardReducer from "./Flashcard/flashCardSlice";
import cancelPaymentReducer from "./User/cancelPayment/cancelPaymentSlice";
import changePasswordReducer from "./User/changePassword/changePasswordSlice";
import checkoutCartReducer from "./User/checkoutCart/checkoutCartSlice";
import deleteCommentReducer from "./User/comment/delete_comment/deleteCommentSlice";
import getCommentsReducer from "./User/comment/fetch_comment/fetchCommentSlice";
import postCommentReducer from "./User/comment/post_comment/postCommentSilce";
import updateCommentReducer from "./User/comment/update_comment/updateCommentSlice";
import createCommentReducer from "./User/comment_rating/create_comment/createCommentSlice";
import fetchAllCommentByOrderItemIdReducer from "./User/comment_rating/fetchCommentByOrderItemId/fetchCommentByOrderItemIdSlice";
import fetchAllCommentByProductReducer from "./User/comment_rating/fetchCommentByProduct/fetchCommentByProductSlice";
import fetchAllCommentByUserReducer from "./User/comment_rating/fetchCommentByUser/fetchCommentByUserSlice";
import deleteCartItemReducer from "./User/deleteCartItem/deleteCartItemSlice";
import deleteOrderReducer from "./User/deleteOrder/deleteOrderSlice";
import deleteFavoriteReducer from "./User/favourite/deleteFavorite/deleteFavoriteSlice";
import getFavoriteReducer from "./User/favourite/getFavorite/getFavoriteSlice";
import postFavoriteReducer from "./User/favourite/postFavortie/postFavoriteSlice";
import getAllPodcastReducer from "./User/fetchAllPodcast/getAllPodcastSlice";
import fetchProductDetailReducer from "./User/fetchAllProductDetail/fetchAllProductDetailSlice";
import getAllCartReducer from "./User/fetchCart/getAllCartSlice";
import fetchCategoryReducer from "./User/fetchCategory/fetchCategorySlice";
import getAllOrderReducer from "./User/fetchOrder/getAllOrderSlice";
import getOrderUserReducer from "./User/fetchOrderByUser/getAllOrderByUserSlice";
import getAllOrderItemReducer from "./User/fetchOrderItem/getAllOrderItemSlice";
import fetchPodcastByCateReducer from "./User/fetchPodcastByCate/fetchPodcastByCateSlice";
import postLetterReducer from "./User/letter/postLetterSlice";
import banUserReducer from "./User/manageUser/banUser/banUserSlice";
import getAllUserReducer from "./User/manageUser/getAllUser/getAllUserSlice";
import unBanUserReducer from "./User/manageUser/unBanUser/unBanUserSlice";
import createPayosReducer from "./User/payos/createPayosSlice";
import addToCartReducer from "./User/postProductToCart/postProductToCartSlice";
import getProfileReducer from "./User/profile/getProfileSlice";
import updateAddressReducer from "./User/updateAddress/updateAddressSlice";
import updateCartItemReducer from "./User/updateCartItem/updateCartItemSlice";
import updateStatusOrderReducer from "./User/updateStatusOrder/updateStatusOrderSlice";

const rootReducer = combineReducers({
  auth: accountReducers,
  register: registerReducer,
  // User
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
  updateAddress: updateAddressReducer,

  //profile
  getProfile: getProfileReducer,

  //payos
  createPayos: createPayosReducer,

  //cancel payment
  cancelPayos: cancelPaymentReducer,
  categoryManagement: categoryManagementReducer,
  getAllUser: getAllUserReducer,
  banUSer: banUserReducer,
  unBanUser: unBanUserReducer,

  //Product
  deleteProduct: deleteProductReducer,
  postProduct: postProductReducer,
  fetchAllProduct: getAllProductReducer,
  fetchProductDetail: fetchProductDetailReducer,
  updateProduct: updateProductReducer,

  //User - favorite
  postFavorite: postFavoriteReducer,
  getFavorite: getFavoriteReducer,
  deleteFavorite: deleteFavoriteReducer,
  //Podcast
  deletePodcast: deletePodcastReducer,
  postPodcast: postPodcastReducer,
  updatePodcast: updatePodcastReducer,
  //comment
  getComments: getCommentsReducer, // NEW
  postComment: postCommentReducer, // NEW
  updateComment: updateCommentReducer,
  deleteComment: deleteCommentReducer,
  postLetter: postLetterReducer,
  chatAI: postChatReducer,
  postFlashCard: postFlashCardReducer,

  //change password
  changePass: changePasswordReducer,

  //comment rating
  createComment: createCommentReducer,
  fetchCommentByUser: fetchAllCommentByUserReducer,
  fetchCommentByProduct: fetchAllCommentByProductReducer,
  fetchCommentByOrderItemId: fetchAllCommentByOrderItemIdReducer,
});

export default rootReducer;
