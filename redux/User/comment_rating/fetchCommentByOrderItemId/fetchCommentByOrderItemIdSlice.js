export const FETCH_ALL_COMMENT_BY_ORDER_ITEM_ID =
  "FETCH_ALL_COMMENT_BY_ORDER_ITEM_ID";
export const FETCH_ALL_COMMENT_BY_ORDER_ITEM_ID_SUCCESS =
  "FETCH_ALL_COMMENT_BY_ORDER_ITEM_ID_SUCCESS";
export const FETCH_ALL_COMMENT_BY_ORDER_ITEM_ID_FAILURE =
  "FETCH_ALL_COMMENT_BY_ORDER_ITEM_ID_FAILURE";

export const fetchAllCommentByOrderItemId = (data) => ({
  type: FETCH_ALL_COMMENT_BY_ORDER_ITEM_ID,
  payload: data,
});

export const fetchAllCommentByOrderItemIdSuccess = (orderItemId, comments) => ({
  type: FETCH_ALL_COMMENT_BY_ORDER_ITEM_ID_SUCCESS,
  payload: { orderItemId, comments },
});

export const fetchAllCommentByOrderItemIdFailure = (error) => ({
  type: FETCH_ALL_COMMENT_BY_ORDER_ITEM_ID_FAILURE,
  payload: error,
});

const initialState = {
  // Lưu comments theo structure: { [orderItemId]: [...comments] }
  commentsByOrderItemId: {},
  loading: null,
  error: null,
};

export const fetchAllCommentByOrderItemIdReducer = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case FETCH_ALL_COMMENT_BY_ORDER_ITEM_ID:
      return { ...state, loading: true, error: null };
    case FETCH_ALL_COMMENT_BY_ORDER_ITEM_ID_SUCCESS: {
      const { orderItemId, comments } = action.payload;

      const newState = {
        ...state,
        loading: false,
        commentsByOrderItemId: {
          ...state.commentsByOrderItemId,
          [orderItemId]: Array.isArray(comments) ? comments : [],
        },
      };

      return newState;
    }
    case FETCH_ALL_COMMENT_BY_ORDER_ITEM_ID_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default fetchAllCommentByOrderItemIdReducer;
