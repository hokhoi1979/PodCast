export const UPDATE_COMMENT = "UPDATE_COMMENT";
export const UPDATE_COMMENT_SUCCESS = "UPDATE_COMMENT_SUCCESS";
export const UPDATE_COMMENT_FAILURE = "UPDATE_COMMENT_FAILURE";
export const RESET_UPDATE_COMMENT = "RESET_UPDATE_COMMENT";

export const updateComment = (data) => ({
  type: UPDATE_COMMENT,
  payload: data,
});

export const updateCommentSuccess = (data) => ({
  type: UPDATE_COMMENT_SUCCESS,
  payload: data,
});

export const updateCommentFailure = (error) => ({
  type: UPDATE_COMMENT_FAILURE,
  payload: error,
});

export const resetUpdateComment = () => ({
  type: RESET_UPDATE_COMMENT,
});

const initialState = {
  comment: null,
  loading: false,
  error: null,
  success: false,
};

const updateCommentReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_COMMENT:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      };
    case UPDATE_COMMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        comment: action.payload,
        success: true,
        error: null,
      };
    case UPDATE_COMMENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };
    case RESET_UPDATE_COMMENT:
      return initialState;
    default:
      return state;
  }
};

export default updateCommentReducer;

