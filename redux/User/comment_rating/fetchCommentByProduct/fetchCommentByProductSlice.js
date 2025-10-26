export const FETCH_ALL_COMMENT_BY_PRODUCT = "FETCH_ALL_COMMENT_BY_PRODUCT";
export const FETCH_ALL_COMMENT_BY_PRODUCT_SUCCESS =
  "FETCH_ALL_COMMENT_BY_PRODUCT_SUCCESS";
export const FETCH_ALL_COMMENT_BY_PRODUCT_FAILURE =
  "FETCH_ALL_COMMENT_BY_PRODUCT_FAILURE";

export const fetchAllCommentByProduct = (data) => ({
  type: FETCH_ALL_COMMENT_BY_PRODUCT,
  payload: data,
});

export const fetchAllCommentByProductSuccess = (data) => ({
  type: FETCH_ALL_COMMENT_BY_PRODUCT_SUCCESS,
  payload: data,
});

export const fetchAllCommentByProductFailure = (error) => ({
  type: FETCH_ALL_COMMENT_BY_PRODUCT_FAILURE,
  payload: error,
});

const initialState = {
  fetchCommentProduct: [],
  loading: false,
  error: null,
};

const fetchAllCommentByProductReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ALL_COMMENT_BY_PRODUCT:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ALL_COMMENT_BY_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        fetchCommentProduct: action.payload,
      };
    case FETCH_ALL_COMMENT_BY_PRODUCT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default fetchAllCommentByProductReducer;
