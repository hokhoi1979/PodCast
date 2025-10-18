export const FETCH_ALL_PODCAST_BY_CATE = "FETCH_ALL_PODCAST_BY_CATE";
export const FETCH_ALL_PODCAST_BY_CATE_SUCCESS =
  "FETCH_ALL_PODCAST_BY_CATE_SUCCESS";
export const FETCH_ALL_PODCAST_BY_CATE_FAIL = "FETCH_ALL_PODCAST_BY_CATE_FAIL";

export const fetchAllPodcastByCate = (data) => ({
  type: FETCH_ALL_PODCAST_BY_CATE,
  payload: data,
});
export const fetchAllPodcastByCateSuccess = (response) => ({
  type: FETCH_ALL_PODCAST_BY_CATE_SUCCESS,
  payload: Array.isArray(response) ? response : response.content || [], // Handle direct array or content property
});
export const fetchAllPodcastByCateFail = (error) => ({
  type: FETCH_ALL_PODCAST_BY_CATE_FAIL,
  payload: error,
});
const initialState = {
  loading: false,
  podcastsByCate: [],
  error: null,
};
export function fetchPodcastByCateReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_ALL_PODCAST_BY_CATE:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ALL_PODCAST_BY_CATE_SUCCESS:
      return {
        ...state,
        loading: false,
        podcastsByCate: action.payload,
      };
    case FETCH_ALL_PODCAST_BY_CATE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
}
export default fetchPodcastByCateReducer;
