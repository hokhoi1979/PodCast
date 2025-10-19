export const DELETE_COMMENT = "DELETE_COMMENT";
export const DELETE_COMMENT_SUCCESS = "DELETE_COMMENT_SUCCESS";
export const DELETE_COMMENT_FAILURE = "DELETE_COMMENT_FAILURE";
export const RESET_DELETE_COMMENT = "RESET_DELETE_COMMENT";

export const deleteComment = (data) => ({
  type: DELETE_COMMENT,
  payload: data,
});

export const deleteCommentSuccess = (data) => ({
  type: DELETE_COMMENT_SUCCESS,
  payload: data,
});

export const deleteCommentFailure = (error) => ({
  type: DELETE_COMMENT_FAILURE,
  payload: error,
});

export const resetDeleteComment = () => ({
  type: RESET_DELETE_COMMENT,
});

const initialState = {
  comment: null,
  loading: false,
  error: null,
  success: false,
};

const deleteCommentReducer = (state = initialState, action) => {
  switch (action.type) {
    case DELETE_COMMENT:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      };
    case DELETE_COMMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        comment: action.payload,
        success: true,
        error: null,
      };
    case DELETE_COMMENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };
    case RESET_DELETE_COMMENT:
      return initialState;
    default:
      return state;
  }
};

export default deleteCommentReducer;
