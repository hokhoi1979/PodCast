import { combineReducers } from "redux";
import accountReducers from "./auth/authSlice";
const rootReducer = combineReducers({
  auth: accountReducers, // Fix: remove the () - it's not a function call
});

export default rootReducer;
