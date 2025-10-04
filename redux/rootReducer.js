import { combineReducers } from "redux";
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
});

export default rootReducer;
