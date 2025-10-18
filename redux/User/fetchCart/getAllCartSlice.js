export const GET_ALL_CART = "GET_ALL_CART";
export const GET_ALL_CART_SUCCESS = "GET_ALL_CART_SUCCESS";
export const GET_ALL_CART_FAIL = "GET_ALL_CART_FAIL";

export const getAllCart = (data) => ({
  type: GET_ALL_CART,
  payload: data,
});

export const getAllCartSuccess = (data) => ({
  type: GET_ALL_CART_SUCCESS,
  payload: data,
});

export const getAllCartFail = (error) => ({
  type: GET_ALL_CART_FAIL,
  payload: error,
});

const initialState = {
  cart: [],
  loading: null,
  error: null,
};

const getAllCartReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_CART:
      return { ...state, loading: true, error: null };
    case GET_ALL_CART_SUCCESS:
      return { ...state, loading: false, cart: action.payload };
    case GET_ALL_CART_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default getAllCartReducer;
