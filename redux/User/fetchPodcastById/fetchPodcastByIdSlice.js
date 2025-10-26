export const GET__PODCAST__ID = "GET__PODCAST__ID";
export const GET__PODCAST__ID__SUCCESS = "GET__PODCAST__ID_SUCCESS";
export const GET__PODCAST__ID__FAIL = "GET__PODCAST__ID_FAIL";

export const getPodcastId = (data) => ({
  type: GET__PODCAST__ID,
  payload: data,
});
export const getPodcastIdSuccess = (data) => ({
  type: GET__PODCAST__ID__SUCCESS,
  payload: data,
});
export const getPodcastIdFail = (error) => ({
  type: GET__PODCAST__ID__FAIL,
  payload: error,
});

const initialState = {
  getPodId: [],
  loading: false,
  error: null,
};
const getPodcastIdReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET__PODCAST__ID:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET__PODCAST__ID__SUCCESS:
      return {
        ...state,
        loading: false,
        getPodId: action.payload,
      };
    case GET__PODCAST__ID__FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
export default getPodcastIdReducer;
