import { all } from "redux-saga/effects";
import watchCategoryManagementSaga from "./Admin/categoryManagement/categoryManagementSaga";
import watchDeletePodcast from "./Admin/Podcast/deletePodcast/deletePodcastSaga";
import watchPostPodcastSaga from "./Admin/Podcast/postPosdcast/postPodcastSaga";
import watchUpdatePodcast from "./Admin/Podcast/updatePodcast/updatePodcastSaga";
import watchDeleteProductSaga from "./Admin/Product/delete_product/deleteProductSaga";
import watchGetAllProduct from "./Admin/Product/fetchProduct/getAllProductSaga";
import watchPostProductSaga from "./Admin/Product/post_product/postProductSaga";
import watchUpdateProductSaga from "./Admin/Product/update_Product/updateProductSaga";
import watchLogin from "./auth/loginSaga";
import watchRegister from "./auth/registerSaga";
import watchPostChatSaga from "./ChatAI/chatAiSaga";
import watchPostFlashCard from "./Flashcard/flashCardSaga";
import watchCancelPayment from "./User/cancelPayment/cancelPaymentSaga";
import watchCheckoutCart from "./User/checkoutCart/checkoutCartSaga";
import watchGetComments from "./User/comment/fetch_comment/fetchCommentSaga";
import watchPostComment from "./User/comment/post_comment/postCommentSaga";
import watchDeleteCartItem from "./User/deleteCartItem/deleteCartItemSaga";
import watchDeleteOrder from "./User/deleteOrder/deleteOrderSaga";
import watchDeleteFavoriteSaga from "./User/favourite/deleteFavorite/deleteFavoriteSaga";
import watchGetFavoriteSaga from "./User/favourite/getFavorite/getFavoriteSaga";
import watchPostFavoriteSaga from "./User/favourite/postFavortie/postFavoriteSaga";
import watchGetAllPodcastSaga from "./User/fetchAllPodcast/getAllPodcastSaga";
import watchGetAllCart from "./User/fetchCart/getAllCartSaga";
import watchFetchCategorySaga from "./User/fetchCategory/fetchCategorySaga";
import watchGetAllOrder from "./User/fetchOrder/getAllOrderSaga";
import watchGetOrderUser from "./User/fetchOrderByUser/getAllOrderByUserSaga";
import watchGetAllOrderItem from "./User/fetchOrderItem/getAllOrderItemSaga";
import watchFetchPodcastByCateSaga from "./User/fetchPodcastByCate/fetchPodcastByCateSaga";
import watchPostLetter from "./User/letter/postLetterSaga";
import watchBanUserSaga from "./User/manageUser/banUser/banUserSaga";
import watchGetAllUserSaga from "./User/manageUser/getAllUser/getAllUserSaga";
import watchUnBanUserSaga from "./User/manageUser/unBanUser/unBanUserSaga";
import watchCreatePayos from "./User/payos/createPayosSaga";
import watchAddToCart from "./User/postProductToCart/postProductToCartSaga";
import watchGetProfile from "./User/profile/getProfileSaga";
import watchUpdateCartItem from "./User/updateCartItem/updateCartItemSaga";
import watchUpdateStatusOrder from "./User/updateStatusOrder/updateStatusOrderSaga";

export default function* rootSaga() {
  yield all([
    watchLogin(),
    watchRegister(),
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
    watchCategoryManagementSaga(),
    //product
    watchGetAllProduct(),
    watchPostProductSaga(),
    watchUpdateProductSaga(),
    watchDeleteProductSaga(),

    //User
    watchGetAllUserSaga(),
    watchBanUserSaga(),
    watchUnBanUserSaga(),

    //User - favorite
    watchPostFavoriteSaga(),
    watchGetFavoriteSaga(),
    watchDeleteFavoriteSaga(),
    //podcast
    watchUpdatePodcast(),
    watchDeletePodcast(),
    watchPostPodcastSaga(),
    //comment
    watchGetComments(),
    watchPostComment(),
    watchPostLetter(),
    watchPostChatSaga(),
    watchPostFlashCard(),
  ]);
}
