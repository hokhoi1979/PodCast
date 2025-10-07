import { combineReducers } from "redux";
import categoryManagementReducer from "./Admin/categoryManagement/categoryManagementSlice";
import getAllProductReducer from "./Admin/Product/fetchProduct/getAllProductSlice";
import postProductReducer from "./Admin/Product/post_product/postProductSlice";
import accountReducers from "./auth/loginSlice";
import registerReducer from "./auth/registerSlice";
import getAllPodcastReducer from "./User/fetchAllPodcast/getAllPodcastSlice";
import fetchCategoryReducer from "./User/fetchCategory/fetchCategorySlice";
import fetchPodcastByCateReducer from "./User/fetchPodcastByCate/fetchPodcastByCateSlice";
import postFavoriteReducer from "./User/favourite/postFavortie/postFavoriteSlice";
import getFavoriteReducer from "./User/favourite/getFavorite/getFavoriteSlice";
import deleteFavoriteReducer from "./User/favourite/deleteFavorite/deleteFavoriteSlice";

const rootReducer = combineReducers({
  auth: accountReducers,
  register: registerReducer,
  // User
  fetchAllPodcast: getAllPodcastReducer,
  fetchAllCategory: fetchCategoryReducer,
  fetchPodcastByCate: fetchPodcastByCateReducer,
  categoryManagement: categoryManagementReducer,
  postProduct: postProductReducer,
  fetchAllProduct: getAllProductReducer,

  //User - favorite
  postFavorite: postFavoriteReducer,
  getFavorite: getFavoriteReducer,
  deleteFavorite: deleteFavoriteReducer,
});

export default rootReducer;
