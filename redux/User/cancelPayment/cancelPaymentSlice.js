export const CANCEL_PAYMENT = "CANCEL_PAYMENT";
export const CANCEL_PAYMENT_SUCCESS = "CANCEL_PAYMENT_SUCCESS";
export const CANCEL_PAYMENT_FAIL = "CANCEL_PAYMENT_FAIL";

export const cancelPayment = (data) => ({
  type: CANCEL_PAYMENT,
  payload: data,
});

export const cancelPaymentSuccess = (data) => ({
  type: CANCEL_PAYMENT_SUCCESS,
  payload: data,
});

export const cancelPaymentFail = (error) => ({
  type: CANCEL_PAYMENT_FAIL,
  payload: error,
});

const initialState = {
  cancel: [],
  loading: null,
  error: null,
};

const cancelPaymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case CANCEL_PAYMENT:
      return { ...state, loading: true, error: false };
    case CANCEL_PAYMENT_SUCCESS:
      return { ...state, loading: false, cancel: action.payload };
    case CANCEL_PAYMENT_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default cancelPaymentReducer;
