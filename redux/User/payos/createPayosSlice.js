// actions
export const CREATE_PAYOS_REQUEST = "CREATE_PAYOS_REQUEST";
export const CREATE_PAYOS_SUCCESS = "CREATE_PAYOS_SUCCESS";
export const CREATE_PAYOS_FAILURE = "CREATE_PAYOS_FAILURE";
export const RESET_PAYOS = "RESET_PAYOS";

// action creators
export const createPayosRequest = (data) => ({
  type: CREATE_PAYOS_REQUEST,
  payload: data,
});

export const createPayosSuccess = (data) => ({
  type: CREATE_PAYOS_SUCCESS,
  payload: data,
});

export const createPayosFailure = (error) => ({
  type: CREATE_PAYOS_FAILURE,
  payload: error,
});

export const resetPayos = () => ({
  type: RESET_PAYOS,
});

// reducer
const initialState = {
  payosUrl: null,
  orderCode: null,
  loading: false,
  error: null,
};

const createPayosReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_PAYOS_REQUEST:
      return { ...state, loading: true, error: null };
    case CREATE_PAYOS_SUCCESS:
      return {
        ...state,
        loading: false,
        payosUrl: action.payload.checkoutUrl,
        orderCode: action.payload.orderCode,
      };
    case CREATE_PAYOS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case RESET_PAYOS:
      return { ...state, payosUrl: null, error: null };
    default:
      return state;
  }
};

export default createPayosReducer;
