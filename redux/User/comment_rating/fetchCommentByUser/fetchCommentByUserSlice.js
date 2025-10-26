export const FETCH_ALL_COMMENT_BY_USER_REQUEST =
  "FETCH_ALL_COMMENT_BY_USER_REQUEST";
export const FETCH_ALL_COMMENT_BY_USER_SUCCESS =
  "FETCH_ALL_COMMENT_BY_USER_SUCCESS";
export const FETCH_ALL_COMMENT_BY_USER_FAILURE =
  "FETCH_ALL_COMMENT_BY_USER_FAILURE";

export const fetchAllCommentByUser = (data) => ({
  type: FETCH_ALL_COMMENT_BY_USER_REQUEST,
  payload: data,
});

export const fetchAllCommentByUserSuccess = (data) => ({
  type: FETCH_ALL_COMMENT_BY_USER_SUCCESS,
  payload: data,
});

export const fetchAllCommentByUserFailure = (error) => ({
  type: FETCH_ALL_COMMENT_BY_USER_FAILURE,
  payload: error,
});

const initialState = {
  fetchCommentUser: [],
  loading: null,
  error: null,
};

export const fetchAllCommentByUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ALL_COMMENT_BY_USER_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_ALL_COMMENT_BY_USER_SUCCESS:
      return { ...state, loading: false, fetchCommentUser: action.payload };
    case FETCH_ALL_COMMENT_BY_USER_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default fetchAllCommentByUserReducer;
