export const GET_ORDER_USER = "GET_ORDER_USER";
export const GET_ORDER_USER_SUCCESS = "GET_ORDER_USER_SUCCESS";
export const GET_ORDER_USER_FAIL = "GET_ORDER_USER_FAIL";

export const getOrderUser = (data) => ({
  type: GET_ORDER_USER,
  payload: data,
});

export const getOrderUserSuccess = (data) => ({
  type: GET_ORDER_USER_SUCCESS,
  payload: data,
});

export const getOrderUserFail = (error) => ({
  type: GET_ORDER_USER_FAIL,
  payload: error,
});

const initialState = {
  orderUser: [],
  loading: null,
  error: null,
};

const getOrderUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ORDER_USER:
      return { ...state, loading: true, error: null };
    case GET_ORDER_USER_SUCCESS:
      return { ...state, loading: false, orderUser: action.payload };
    case GET_ORDER_USER_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default getOrderUserReducer;
