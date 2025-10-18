export const UPDATE_CART_ITEM = "UPDATE_CART_ITEM";
export const UPDATE_CART_ITEM_SUCCESS = "UPDATE_CART_ITEM_SUCCESS";
export const UPDATE_CART_ITEM_FAIL = "UPDATE_CART_ITEM_FAIL";

export const updateCartItem = (data) => ({
  type: UPDATE_CART_ITEM,
  payload: data,
});

export const updateCartItemSuccess = (data) => ({
  type: UPDATE_CART_ITEM_SUCCESS,
  payload: data,
});

export const updateCartItemFail = (error) => ({
  type: UPDATE_CART_ITEM_FAIL,
  payload: error,
});

const initialState = {
  updateCart: [],
  loading: null,
  error: null,
};

const updateCartItemReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_CART_ITEM:
      return { ...state, loading: true, error: null };
    case UPDATE_CART_ITEM_SUCCESS:
      return { ...state, loading: false, updateCart: action.payload };
    case UPDATE_CART_ITEM_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default updateCartItemReducer;
