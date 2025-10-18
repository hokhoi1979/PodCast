export const ADD_TO_CART = "ADD_TO_CART";
export const ADD_TO_CART_SUCCESS = "ADD_TO_CART_SUCCESS";
export const ADD_TO_CART_FAIL = "ADD_TO_CART_FAIL";

export const addToCart = (data) => ({
  type: ADD_TO_CART,
  payload: data,
});

export const addToCartSuccess = (data) => ({
  type: ADD_TO_CART_SUCCESS,
  payload: data,
});

export const addToCartFail = (error) => ({
  type: ADD_TO_CART_FAIL,
  payload: error,
});

const initialState = {
  addCart: null,
  loading: null,
  error: null,
};

const addToCartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      return { ...state, loading: true, error: null };
    case ADD_TO_CART_SUCCESS:
      return { ...state, loading: false, addCart: action.payload };
    case ADD_TO_CART_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default addToCartReducer;
