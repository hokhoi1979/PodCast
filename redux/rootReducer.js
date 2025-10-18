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
import getCommentsReducer from "./User/comment/fetch_comment/fetchCommentSlice";
import postCommentReducer from "./User/comment/post_comment/postCommentSilce";
import deleteFavoriteReducer from "./User/favourite/deleteFavorite/deleteFavoriteSlice";
import getFavoriteReducer from "./User/favourite/getFavorite/getFavoriteSlice";
import postFavoriteReducer from "./User/favourite/postFavortie/postFavoriteSlice";
import getAllPodcastReducer from "./User/fetchAllPodcast/getAllPodcastSlice";
import fetchCategoryReducer from "./User/fetchCategory/fetchCategorySlice";
import fetchPodcastByCateReducer from "./User/fetchPodcastByCate/fetchPodcastByCateSlice";
import postLetterReducer from "./User/letter/postLetterSlice";
import banUserReducer from "./User/manageUser/banUser/banUserSlice";
import getAllUserReducer from "./User/manageUser/getAllUser/getAllUserSlice";
import unBanUserReducer from "./User/manageUser/unBanUser/unBanUserSlice";

const rootReducer = combineReducers({
  auth: accountReducers,
  register: registerReducer,
  // User
  fetchAllPodcast: getAllPodcastReducer,
  fetchAllCategory: fetchCategoryReducer,
  fetchPodcastByCate: fetchPodcastByCateReducer,
  categoryManagement: categoryManagementReducer,
  getAllUser: getAllUserReducer,
  banUSer: banUserReducer,
  unBanUser: unBanUserReducer,

  //Product
  deleteProduct: deleteProductReducer,
  postProduct: postProductReducer,
  fetchAllProduct: getAllProductReducer,
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
  postLetter: postLetterReducer,
  chatAI: postChatReducer,
  postFlashCard: postFlashCardReducer,
});

export default rootReducer;
