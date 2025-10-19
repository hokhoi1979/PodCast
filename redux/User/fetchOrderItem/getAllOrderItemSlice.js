export const GET_ALL_ORDER_ITEM = "GET_ALL_ORDER_ITEM";
export const GET_ALL_ORDER_ITEM_SUCCESS = "GET_ALL_ORDER_ITEM_SUCCESS";
export const GET_ALL_ORDER_ITEM_FAIL = "GET_ALL_ORDER_ITEM_FAIL";

export const getAllOrderItem = (data) => ({
  type: GET_ALL_ORDER_ITEM,
  payload: data,
});

export const getAllOrderItemSuccess = (data) => ({
  type: GET_ALL_ORDER_ITEM_SUCCESS,
  payload: data,
});

export const getAllOrderItemFail = (error) => ({
  type: GET_ALL_ORDER_ITEM_FAIL,
  payload: error,
});

const initialState = {
  orderItem: null,
  loading: null,
  error: null,
};

const getAllOrderItemReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_ORDER_ITEM:
      return { ...state, loading: true, error: null };
    case GET_ALL_ORDER_ITEM_SUCCESS:
      return { ...state, loading: false, orderItem: action.payload };
    case GET_ALL_ORDER_ITEM_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default getAllOrderItemReducer;
