import { combineReducers } from "redux";
import categoryManagementReducer from "./Admin/categoryManagement/categoryManagementSlice";
import getAllProductReducer from "./Admin/Product/fetchProduct/getAllProductSlice";
import postProductReducer from "./Admin/Product/post_product/postProductSlice";
import accountReducers from "./auth/loginSlice";
import registerReducer from "./auth/registerSlice";
import getAllPodcastReducer from "./User/fetchAllPodcast/getAllPodcastSlice";
import fetchCategoryReducer from "./User/fetchCategory/fetchCategorySlice";
import fetchPodcastByCateReducer from "./User/fetchPodcastByCate/fetchPodcastByCateSlice";

const rootReducer = combineReducers({
  auth: accountReducers,
  register: registerReducer,
  fetchAllPodcast: getAllPodcastReducer,
  fetchAllCategory: fetchCategoryReducer,
  fetchPodcastByCate: fetchPodcastByCateReducer,
  categoryManagement: categoryManagementReducer,
  postProduct: postProductReducer,
  fetchAllProduct: getAllProductReducer,
});

export default rootReducer;
