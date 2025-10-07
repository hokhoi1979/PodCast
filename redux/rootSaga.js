import { all } from "redux-saga/effects";
import watchCategoryManagementSaga from "./Admin/categoryManagement/categoryManagementSaga";
import watchGetAllProduct from "./Admin/Product/fetchProduct/getAllProductSaga";
import watchPostProductSaga from "./Admin/Product/post_product/postProductSaga";
import watchLogin from "./auth/loginSaga";
import watchRegister from "./auth/registerSaga";
import watchGetAllPodcastSaga from "./User/fetchAllPodcast/getAllPodcastSaga";
import watchFetchCategorySaga from "./User/fetchCategory/fetchCategorySaga";
import watchFetchPodcastByCateSaga from "./User/fetchPodcastByCate/fetchPodcastByCateSaga";
import watchPostFavoriteSaga from "./User/favourite/postFavortie/postFavoriteSaga";
import watchGetFavoriteSaga from "./User/favourite/getFavorite/getFavoriteSaga";
import watchDeleteFavoriteSaga from "./User/favourite/deleteFavorite/deleteFavoriteSaga";

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

    //User - favorite
    watchPostFavoriteSaga(),
    watchGetFavoriteSaga(),
    watchDeleteFavoriteSaga(),
  ]);
}
