export const CREATE_COMMENT_REQUEST = "CREATE_COMMENT_REQUEST";
export const CREATE_COMMENT_SUCCESS = "CREATE_COMMENT_SUCCESS";
export const CREATE_COMMENT_FAILURE = "CREATE_COMMENT_FAILURE";

export const createComment = (data) => ({
  type: CREATE_COMMENT_REQUEST,
  payload: data,
});

export const createCommentSuccess = (data) => ({
  type: CREATE_COMMENT_SUCCESS,
  payload: data,
});

export const createCommentFailure = (error) => ({
  type: CREATE_COMMENT_FAILURE,
  payload: error,
});

const inititalState = {
  createComment: null,
  loading: false,
  error: null,
};

const createCommentReducer = (state = inititalState, action) => {
  switch (action.type) {
    case CREATE_COMMENT_REQUEST:
      return { ...state, loading: true, error: null };
    case CREATE_COMMENT_SUCCESS:
      return { ...state, loading: false, createComment: action.payload };
    case CREATE_COMMENT_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default createCommentReducer;
