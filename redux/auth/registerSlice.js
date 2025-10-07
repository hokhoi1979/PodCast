// Action Types
export const FETCH_API_REGISTER = "FETCH_API_REGISTER";
export const FETCH_API_REGISTER_SUCCESS = "FETCH_API_REGISTER_SUCCESS";
export const FETCH_API_REGISTER_FAIL = "FETCH_API_REGISTER_FAIL";

// Action Creators
export const fetchRegister = (data) => ({
  type: FETCH_API_REGISTER,
  payload: data,
});

export const registerSuccess = () => ({
  type: FETCH_API_REGISTER_SUCCESS,
});

export const registerFail = (error) => ({
  type: FETCH_API_REGISTER_FAIL,
  payload: error,
});

// Initial State
const initialState = {
  loading: false,
  error: null,
  success: false,
};

// Reducer
const registerReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_API_REGISTER:
      return { ...state, loading: true, error: null, success: false };
    case FETCH_API_REGISTER_SUCCESS:
      return { ...state, loading: false, success: true };
    case FETCH_API_REGISTER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };
    default:
      return state;
  }
};

export default registerReducer;
