export const POST_COMMENT = "POST_COMMENT";
export const POST_COMMENT_SUCCESS = "POST_COMMENT_SUCCESS";
export const POST_COMMENT_FAILURE = "POST_COMMENT_FAILURE";
export const RESET_POST_COMMENT = "RESET_POST_COMMENT";

export const postComment = (data) => ({
  type: POST_COMMENT,
  payload: data,
});

export const postCommentSuccess = (data) => ({
  type: POST_COMMENT_SUCCESS,
  payload: data,
});

export const postCommentFailure = (error) => ({
  type: POST_COMMENT_FAILURE,
  payload: error,
});

export const resetPostComment = () => ({
  type: RESET_POST_COMMENT,
});

const initialState = {
  comment: null,
  loading: false,
  error: null,
  success: false,
};

const postCommentReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_COMMENT:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      };
    case POST_COMMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        comment: action.payload,
        success: true,
        error: null,
      };
    case POST_COMMENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };
    case RESET_POST_COMMENT:
      return initialState;
    default:
      return state;
  }
};

export default postCommentReducer;
