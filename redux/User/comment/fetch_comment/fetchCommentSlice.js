export const GET_COMMENTS = "GET_COMMENTS";
export const GET_COMMENTS_SUCCESS = "GET_COMMENTS_SUCCESS";
export const GET_COMMENTS_FAILURE = "GET_COMMENTS_FAILURE";

export const getComments = (podcastId) => ({
  type: GET_COMMENTS,
  payload: podcastId,
});

export const getCommentsSuccess = (data) => ({
  type: GET_COMMENTS_SUCCESS,
  payload: data,
});

export const getCommentsFailure = (error) => ({
  type: GET_COMMENTS_FAILURE,
  payload: error,
});

const initialState = {
  comments: [],
  loading: false,
  error: null,
};

const getCommentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_COMMENTS:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_COMMENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        comments: action.payload,
        error: null,
      };
    case GET_COMMENTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default getCommentsReducer;
