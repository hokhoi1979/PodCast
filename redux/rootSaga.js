import { all } from "redux-saga/effects";
import watchCategoryManagementSaga from "./Admin/categoryManagement/categoryManagementSaga";
import watchDeleteProductSaga from "./Admin/Product/delete_product/deleteProductSaga";
import watchGetAllProduct from "./Admin/Product/fetchProduct/getAllProductSaga";
import watchPostProductSaga from "./Admin/Product/post_product/postProductSaga";
import watchUpdateProductSaga from "./Admin/Product/update_Product/updateProductSaga";
import watchLogin from "./auth/loginSaga";
import watchRegister from "./auth/registerSaga";
import watchGetAllPodcastSaga from "./User/fetchAllPodcast/getAllPodcastSaga";
import watchFetchCategorySaga from "./User/fetchCategory/fetchCategorySaga";
import watchFetchPodcastByCateSaga from "./User/fetchPodcastByCate/fetchPodcastByCateSaga";

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
  ]);
}
