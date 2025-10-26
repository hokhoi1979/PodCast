export const CHANGE_PASSWORD = "CHANGE_PASSWORD";
export const CHANGE_PASSWORD_SUCCESS = "CHANGE_PASSWORD_SUCCESS";
export const CHANGE_PASSWORD_FAIL = "CHANGE_PASSWORD_FAIL";

export const changePassword = (data) => ({
  type: CHANGE_PASSWORD,
  payload: data,
});

export const changePasswordSuccess = (data) => ({
  type: CHANGE_PASSWORD_SUCCESS,
  payload: data,
});

export const changePasswordFail = (error) => ({
  type: CHANGE_PASSWORD_FAIL,
  payload: error,
});

const initialState = {
  change: null,
  loading: null,
  error: null,
};

const changePasswordReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_PASSWORD:
      return { ...state, loading: true, error: false };
    case CHANGE_PASSWORD_SUCCESS:
      return { ...state, loading: false, change: action.payload };
    case CHANGE_PASSWORD_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default changePasswordReducer;
