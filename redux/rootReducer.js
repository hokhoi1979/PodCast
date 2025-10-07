import { combineReducers } from "redux";
import categoryManagementReducer from "./Admin/categoryManagement/categoryManagementSlice";
import deleteProductReducer from "./Admin/Product/delete_product/deleteProductSlice";
import getAllProductReducer from "./Admin/Product/fetchProduct/getAllProductSlice";
import postProductReducer from "./Admin/Product/post_product/postProductSlice";
import updateProductReducer from "./Admin/Product/update_Product/updateProductSlice";
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
  //Product
  deleteProduct: deleteProductReducer,
  postProduct: postProductReducer,
  fetchAllProduct: getAllProductReducer,
  updateProduct: updateProductReducer,
});

export default rootReducer;
