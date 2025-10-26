export const CHECKOUT_CART = "CHECKOUT_CART";
export const CHECKOUT_CART_SUCCESS = "CHECKOUT_CART_SUCCESS";
export const CHECKOUT_CART_FAIL = "CHECKOUT_CART_FAIL";
export const RESET_CHECKOUT = "RESET_CHECKOUT";

export const checkoutCart = (data) => ({
  type: CHECKOUT_CART,
  payload: data,
});

export const checkoutCartSuccess = (data) => ({
  type: CHECKOUT_CART_SUCCESS,
  payload: data,
});

export const checkoutCartFail = (error) => ({
  type: CHECKOUT_CART_FAIL,
  payload: error,
});

export const resetCheckout = () => ({
  type: RESET_CHECKOUT,
});

const initialState = {
  checkout: null,
  loading: null,
  error: null,
};

const checkoutCartReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHECKOUT_CART:
      return { ...state, loading: true, error: null };
    case CHECKOUT_CART_SUCCESS:
      return { ...state, loading: false, checkout: action.payload };
    case CHECKOUT_CART_FAIL:
      return { ...state, loading: false, error: action.payload };
    case RESET_CHECKOUT:
      return { ...initialState };
    default:
      return state;
  }
};
export default checkoutCartReducer;
