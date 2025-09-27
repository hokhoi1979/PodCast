import { combineReducers } from "redux";
import accountReducers from "./auth/loginSlice";
import registerReducer from "./auth/registerSlice";

const rootReducer = combineReducers({
  auth: accountReducers,
  register: registerReducer, // Thêm register reducer
});

export default rootReducer;
