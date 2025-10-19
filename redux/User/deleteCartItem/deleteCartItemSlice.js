export const DELETE_CART_ITEM = "DELETE_CART_ITEM";
export const DELETE_CART_ITEM_SUCCESS = "DELETE_CART_ITEM_SUCCESS";
export const DELETE_CART_ITEM_FAIL = "DELETE_CART_ITEM_FAIL";

export const deleteCartItem = (data) => ({
  type: DELETE_CART_ITEM,
  payload: data,
});

export const deleteCartItemSuccess = (data) => ({
  type: DELETE_CART_ITEM_SUCCESS,
  payload: data,
});

export const deleteCartItemFail = (error) => ({
  type: DELETE_CART_ITEM,
  payload: error,
});

const initialState = {
  deleteCart: [],
  loading: null,
  error: null,
};

const deleteCartItemReducer = (state = initialState, action) => {
  switch (action.type) {
    case DELETE_CART_ITEM:
      return { ...state, loading: true, error: null };
    case DELETE_CART_ITEM_SUCCESS:
      return { ...state, loading: false, deleteCart: action.payload };
    case DELETE_CART_ITEM_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default deleteCartItemReducer;
