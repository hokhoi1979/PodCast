export const POST_PRODUCT_REQUEST = "POST_PRODUCT_REQUEST";
export const POST_PRODUCT_SUCCESS = "POST_PRODUCT_SUCCESS";
export const POST_PRODUCT_FAILURE = "POST_PRODUCT_FAILURE";
export const RESET_POST_PRODUCT = "RESET_POST_PRODUCT";

export const productPostRequest = (data) => ({
  type: POST_PRODUCT_REQUEST,
  payload: data,
});
export const productPostSucess = (data) => ({
  type: POST_PRODUCT_SUCCESS,
  payload: data,
});
export const productPostFailure = (error) => ({
  type: POST_PRODUCT_FAILURE,
  payload: error,
});
const initialState = {
  loading: false,
  postProduct: null,
  error: null,
};
const postProductReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_PRODUCT_REQUEST:
      return { ...state, loading: true, error: null };
    case POST_PRODUCT_SUCCESS:
      return { ...state, loading: false, postProduct: action.payload };
    case POST_PRODUCT_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
export default postProductReducer;
