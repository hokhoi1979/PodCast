export const UPDATE_STATUS_ORDER = "UPDATE_STATUS_ORDER";
export const UPDATE_STATUS_ORDER_SUCCESS = "UPDATE_STATUS_ORDER_SUCCESS";
export const UPDATE_STATUS_ORDER_FAIL = "UPDATE_STATUS_ORDER_FAIL";

export const updateStatusOrder = (data) => ({
  type: UPDATE_STATUS_ORDER,
  payload: data,
});

export const updateStatusOrderSuccess = (data) => ({
  type: UPDATE_STATUS_ORDER_SUCCESS,
  payload: data,
});

export const updateStatusOrderFail = (error) => ({
  type: UPDATE_STATUS_ORDER_FAIL,
  payload: error,
});

const initialState = {
  updateStatus: [],
  loading: null,
  error: null,
};

const updateStatusOrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_STATUS_ORDER:
      return { ...state, loading: true, error: false };
    case UPDATE_STATUS_ORDER_SUCCESS:
      return { ...state, loading: false, updateStatus: action.payload };
    case UPDATE_STATUS_ORDER_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default updateStatusOrderReducer;
