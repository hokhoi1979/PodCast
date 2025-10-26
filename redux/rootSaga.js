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
import watchGetComments from "./User/comment/fetch_comment/fetchCommentSaga";
import watchPostComment from "./User/comment/post_comment/postCommentSaga";
import watchDeleteFavoriteSaga from "./User/favourite/deleteFavorite/deleteFavoriteSaga";
import watchGetFavoriteSaga from "./User/favourite/getFavorite/getFavoriteSaga";
import watchPostFavoriteSaga from "./User/favourite/postFavortie/postFavoriteSaga";
import watchGetAllPodcastSaga from "./User/fetchAllPodcast/getAllPodcastSaga";
import watchFetchCategorySaga from "./User/fetchCategory/fetchCategorySaga";
import watchFetchPodcastByCateSaga from "./User/fetchPodcastByCate/fetchPodcastByCateSaga";
import watchPostLetter from "./User/letter/postLetterSaga";
import watchGetAllUserSaga from "./User/manageUser/getAllUser/getAllUserSaga";
import watchBanUserSaga from "./User/manageUser/banUser/banUserSaga";
import watchUnBanUserSaga from "./User/manageUser/unBanUser/unBanUserSaga";
import watchGetPodcastIdSaga from "./User/fetchPodcastById/fetchPodcastByIdSaga";

export default function* rootSaga() {
  yield all([
    watchLogin(),
    watchRegister(),
    watchGetAllPodcastSaga(),
    watchGetPodcastIdSaga(),
    watchFetchCategorySaga(),
    watchFetchPodcastByCateSaga(),
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
  ]);
}
