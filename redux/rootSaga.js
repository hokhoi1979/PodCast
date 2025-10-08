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
import watchGetComments from "./User/comment/fetch_comment/fetchCommentSaga";
import watchPostComment from "./User/comment/post_comment/postCommentSaga";
import watchDeleteFavoriteSaga from "./User/favourite/deleteFavorite/deleteFavoriteSaga";
import watchGetFavoriteSaga from "./User/favourite/getFavorite/getFavoriteSaga";
import watchPostFavoriteSaga from "./User/favourite/postFavortie/postFavoriteSaga";
import watchGetAllPodcastSaga from "./User/fetchAllPodcast/getAllPodcastSaga";
import watchFetchCategorySaga from "./User/fetchCategory/fetchCategorySaga";
import watchFetchPodcastByCateSaga from "./User/fetchPodcastByCate/fetchPodcastByCateSaga";
import watchPostLetter from "./User/letter/postLetterSaga";

export default function* rootSaga() {
  yield all([
    watchLogin(),
    watchRegister(),
    watchGetAllPodcastSaga(),
    watchFetchCategorySaga(),
    watchFetchPodcastByCateSaga(),
    watchCategoryManagementSaga(),
    //product
    watchGetAllProduct(),
    watchPostProductSaga(),
    watchUpdateProductSaga(),
    watchDeleteProductSaga(),

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
  ]);
}
