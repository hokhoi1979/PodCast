export const UN__BAN__USER = "UN__BAN__USER";
export const UN__BAN__USER__SUCCESS = "UN__BAN__USER__SUCCESS";
export const UN__BAN__USER__FAIL = "UN__BAN__USER__FAIL";

export const unBanUser = (data) => ({
  type: UN__BAN__USER,
  payload: data,
});

export const unBanUserSuccess = (data) => ({
  type: UN__BAN__USER__SUCCESS,
  payload: data,
});

export const unBanUserFail = (error) => ({
  type: UN__BAN__USER__FAIL,
  payload: error,
});

const initialState = {
  unban: [],
  loading: false,
  error: null,
};

const unBanUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case UN__BAN__USER:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UN__BAN__USER__SUCCESS:
      return {
        ...state,
        loading: false,
        unban: action.payload,
      };
    case UN__BAN__USER__FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default unBanUserReducer;
