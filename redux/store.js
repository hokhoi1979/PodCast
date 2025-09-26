import { applyMiddleware, createStore } from "redux";
import rootReducer from "../rootReducer";
import rootSaga from "../rootSaga";

// Fix import redux-saga
const createSagaMiddleware = require("redux-saga").default;

const sagaMiddleware = createSagaMiddleware();

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

export default store;
