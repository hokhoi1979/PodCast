export const DELETE_ORDER = "DELETE_ORDER";
export const DELETE_ORDER_SUCCESS = "DELETE_ORDER_SUCCESS";
export const DELETE_ORDER_FAIL = "DELETE_ORDER_FAIL";

export const deleteOrder = (data) => ({
  type: DELETE_ORDER,
  payload: data,
});

export const deleteOrderSuccess = (data) => ({
  type: DELETE_ORDER_SUCCESS,
  payload: data,
});

export const deleteOrderFail = (error) => ({
  type: DELETE_ORDER_FAIL,
  payload: error,
});

const initialState = {
  deleteOrder: [],
  loading: null,
  success: null,
  error: null,
};

const deleteOrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case DELETE_ORDER:
      return { ...state, loading: true, success: false, error: null };
    case DELETE_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        deleteOrder: action.payload,
      };
    case DELETE_ORDER_FAIL:
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
export default deleteOrderReducer;
