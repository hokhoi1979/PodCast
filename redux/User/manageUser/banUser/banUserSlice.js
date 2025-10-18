export const BAN__USER = "BAN__USER_";
export const BAN__USER__SUCCESS = "BAN__USER__SUCCESS";
export const BAN__USER__FAIL = "BAN__USER__FAIL";

export const banUser = (data) => ({
  type: BAN__USER,
  payload: data,
});

export const banUserSuccess = (data) => ({
  type: BAN__USER__SUCCESS,
  payload: data,
});

export const banUserFail = (error) => ({
  type: BAN__USER__FAIL,
  payload: error,
});

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const banUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case BAN__USER:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case BAN__USER__SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case BAN__USER__FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default banUserReducer;
