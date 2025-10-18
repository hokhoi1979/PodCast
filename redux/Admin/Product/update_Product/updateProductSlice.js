export const UPDATE_PRODUCT_REQUEST = "UPDATE_PRODUCT_REQUEST";
export const UPDATE_PRODUCT_SUCCESS = "UPDATE_PRODUCT_SUCCESS";
export const UPDATE_PRODUCT_FAIL = "UPDATE_PRODUCT_FAIL";

export const updateProductRequest = (data) => ({
  type: UPDATE_PRODUCT_REQUEST,
  payload: data,
});
export const updateProductSuccess = (data) => ({
  type: UPDATE_PRODUCT_SUCCESS,
  payload: data,
});
export const updateProductFail = (error) => ({
  type: UPDATE_PRODUCT_FAIL,
  payload: error,
});

const initialState = {
  loading: false,
  updateProduct: null,
  error: null,
};
export const updateProductReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_PRODUCT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        product: null,
      };
    case UPDATE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        product: action.payload,
        error: null,
      };
    case UPDATE_PRODUCT_FAIL:
      return {
        ...state,
        loading: false,
        product: null,
        error: action.payload,
      };
    default:
      return state;
  }
};
export default updateProductReducer;
