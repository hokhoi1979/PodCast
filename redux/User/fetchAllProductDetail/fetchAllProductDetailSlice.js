export const FETCH_PRODUCT_DETAIL = "FETCH_PRODUCT_DETAIL";
export const FETCH_PRODUCT_DETAIL_SUCCESS = "FETCH_PRODUCT_DETAIL_SUCCESS";
export const FETCH_PRODUCT_DETAIL_FAIL = "FETCH_PRODUCT_DETAIL_FAIL";

export const fetchProductDetail = (data) => ({
  type: FETCH_PRODUCT_DETAIL,
  payload: data,
});

export const fetchProductDetailSuccess = (data) => ({
  type: FETCH_PRODUCT_DETAIL_SUCCESS,
  payload: data,
});

export const fetchProductDetailFail = (error) => ({
  type: FETCH_PRODUCT_DETAIL_FAIL,
  payload: error,
});

const initialState = {
  productDetail: [],
  loading: null,
  error: null,
};

const fetchProductDetailReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PRODUCT_DETAIL:
      return { ...state, loading: true, error: null };
    case FETCH_PRODUCT_DETAIL_SUCCESS:
      return { ...state, loading: false, productDetail: action.payload };
    case FETCH_PRODUCT_DETAIL_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default fetchProductDetailReducer;
