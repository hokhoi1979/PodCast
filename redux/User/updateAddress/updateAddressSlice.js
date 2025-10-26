export const UPDATE_ADDRESS_REQUEST = "UPDATE_ADDRESS_REQUEST";
export const UPDATE_ADDRESS_SUCCESS = "UPDATE_ADDRESS_SUCCESS";
export const UPDATE_ADDRESS_FAILURE = "UPDATE_ADDRESS_FAILURE";

export const updateAddress = (data) => ({
  type: UPDATE_ADDRESS_REQUEST,
  payload: data,
});

export const updateAddressSuccess = (data) => ({
  type: UPDATE_ADDRESS_SUCCESS,
  payload: data,
});

export const updateAddressFailure = (error) => ({
  type: UPDATE_ADDRESS_FAILURE,
  payload: error,
});

const initialState = {
  address: [],
  loading: null,
  error: null,
};

const updateAddressReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_ADDRESS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_ADDRESS_SUCCESS:
      return {
        ...state,
        loading: false,
        address: action.payload,
      };
    case UPDATE_ADDRESS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
export default updateAddressReducer;
