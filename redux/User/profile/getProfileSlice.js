export const GET_PROFILE = "GET_PROFILE";
export const GET_PROFILE_SUCCESS = "GET_PROFILE_SUCCESS";
export const GET_PROFILE_FAIL = "GET_PROFILE_FAIL";

export const getProfile = (data) => ({
  type: GET_PROFILE,
  payload: data,
});

export const getProfileSuccess = (data) => ({
  type: GET_PROFILE_SUCCESS,
  payload: data,
});

export const getProfileFail = (error) => ({
  type: GET_PROFILE_FAIL,
  payload: error,
});

const initialState = {
  profile: [],
  loading: null,
  error: null,
};

const getProfileReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PROFILE:
      return { ...state, loading: true, error: null };
    case GET_PROFILE_SUCCESS:
      return { ...state, loading: false, profile: action.payload };
    case GET_PROFILE_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default getProfileReducer;
