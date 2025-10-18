export const GET_ALL_ORDER = "GET_ALL_ORDER";
export const GET_ALL_ORDER_SUCCESS = "GET_ALL_ORDER_SUCCESS";
export const GET_ALL_ORDER_FAIL = "GET_ALL_ORDER_FAIL";

export const getAllOrder = (data) => ({
  type: GET_ALL_ORDER,
  payload: data,
});

export const getAllOrderSuccess = (data) => ({
  type: GET_ALL_ORDER_SUCCESS,
  payload: data,
});

export const getAllOrderFail = (error) => ({
  type: GET_ALL_ORDER_FAIL,
  payload: error,
});

const initialState = {
  order: null,
  loading: null,
  error: null,
};

const getAllOrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_ORDER:
      return { ...state, loading: true, error: null };
    case GET_ALL_ORDER_SUCCESS:
      return { ...state, loading: false, order: action.payload };
    case GET_ALL_ORDER_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default getAllOrderReducer;
