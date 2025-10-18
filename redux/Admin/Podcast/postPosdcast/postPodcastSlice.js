export const POST_PODCAST_REQUEST = "POST_PODCAST_REQUEST";
export const POST_PODCAST_SUCCESS = "POST_PODCAST_SUCCESS";
export const POST_PODCAST_FAILURE = "POST_PODCAST_FAILURE";

export const postPodcastRequest = (podcastData) => ({
  type: POST_PODCAST_REQUEST,
  payload: podcastData,
});
export const postPodcastSuccess = (response) => ({
  type: POST_PODCAST_SUCCESS,
  payload: response,
});
export const postPodcastFailure = (error) => ({
  type: POST_PODCAST_FAILURE,
  payload: error,
});
const initial = {
  loading: false,
  postPodcast: null,
  error: null,
};
const postPodcastReducer = (state = initial, action) => {
  switch (action.type) {
    case POST_PODCAST_REQUEST:
      return { ...state, loading: true, error: null };
    case POST_PODCAST_SUCCESS:
      return { ...state, loading: false, postPodcast: action.payload };
    case POST_PODCAST_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default postPodcastReducer;
