export const FETCH_ALL_PODCAST = "FETCH_ALL_PODCAST";
export const FETCH_ALL_PODCAST_SUCCESS = "FETCH_ALL_PODCAST_SUCCESS";
export const FETCH_ALL_PODCAST_FAIL = "FETCH_ALL_PODCAST_FAIL";
// add selection types
export const SELECT_PODCAST = "SELECT_PODCAST";
export const CLEAR_SELECTED_PODCAST = "CLEAR_SELECTED_PODCAST";

export const fetchAllPodcast = (page = 1, size = 10) => ({
  type: FETCH_ALL_PODCAST,
  payload: { page, size },
});
export const fetchAllPodcastSuccess = (response) => ({
  type: FETCH_ALL_PODCAST_SUCCESS,
  payload: response.content,
});
export const fetchAllPodcastFail = (error) => ({
  type: FETCH_ALL_PODCAST_FAIL,
  payload: error,
});
// add action creators
export const selectPodcast = (podcast, autoPlay = true) => ({
  type: SELECT_PODCAST,
  payload: { podcast, autoPlay },
});
export const clearSelectedPodcast = () => ({ type: CLEAR_SELECTED_PODCAST });

const initialState = {
  loading: false,
  podcasts: [],
  // selection state for top display + autoplay
  selectedPodcast: null,
  autoPlay: false,
  error: null,
};

export default function getAllPodcastReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_ALL_PODCAST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ALL_PODCAST_SUCCESS:
      return {
        ...state,
        loading: false,
        podcasts: action.payload,
      };
    case FETCH_ALL_PODCAST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    // new cases
    case SELECT_PODCAST:
      return {
        ...state,
        selectedPodcast: action.payload.podcast,
        autoPlay: !!action.payload.autoPlay,
      };
    case CLEAR_SELECTED_PODCAST:
      return {
        ...state,
        selectedPodcast: null,
        autoPlay: false,
      };
    default:
      return state;
  }
}
