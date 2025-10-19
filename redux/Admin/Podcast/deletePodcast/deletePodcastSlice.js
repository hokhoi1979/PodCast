export const DELETE_PODCAST_REQUEST = "DELETE_PODCAST_REQUEST";
export const DELETE_PODCAST_SUCCESS = "DELETE_PODCAST_SUCCESS";
export const DELETE_PODCAST_FAILURE = "DELETE_PODCAST_FAILURE";
export const deletePodcastRequest = (id) => ({
  type: DELETE_PODCAST_REQUEST,
  payload: id,
});
export const deletePodcastSuccess = (data) => ({
  type: DELETE_PODCAST_SUCCESS,
  payload: data,
});
export const deletePodcastFailure = (error) => ({
  type: DELETE_PODCAST_FAILURE,
  payload: error,
});
const initialState = {
  loading: false,
  deletePodcast: null,
  error: null,
};
const deletePodcastReducer = (state = initialState, action) => {
  switch (action.type) {
    case DELETE_PODCAST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DELETE_PODCAST_SUCCESS:
      return {
        ...state,
        loading: false,
        deletePodcast: action.payload,
        error: null,
      };
    case DELETE_PODCAST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
export default deletePodcastReducer;
