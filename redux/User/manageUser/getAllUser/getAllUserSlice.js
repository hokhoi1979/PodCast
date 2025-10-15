export const GET__ALL__USER = "GET__ALL__USER_";
export const GET__ALL__USER__SUCCESS = "GET__ALL__USER__SUCCESS";
export const GET__ALL__USER__FAIL = "GET__ALL__USER__FAIL";
export const RESET_GET__ALL__USER_ = "RESET_GET__ALL__USER_";

export const getAllUser = (data) => ({
  type: GET__ALL__USER,
  payload: data,
});

export const getAllUserSuccess = (data) => ({
  type: GET__ALL__USER__SUCCESS,
  payload: data,
});

export const getAllUserFail = (error) => ({
  type: GET__ALL__USER__FAIL,
  payload: error,
});

const initialState = {
  allUser: [],
  loading: false,
  error: null,
};

const getAllUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET__ALL__USER:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET__ALL__USER__SUCCESS:
      return {
        ...state,
        loading: false,
        allUser: action.payload,
      };
    case GET__ALL__USER__FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default getAllUserReducer;
