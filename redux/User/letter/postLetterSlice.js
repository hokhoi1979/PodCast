export const POST_LETTER = "POST_LETTER";
export const POST_LETTER_SUCCESS = "POST_LETTER_SUCCESS";
export const POST_LETTER_FAILURE = "POST_LETTER_FAILURE";
export const RESET_POST_LETTER = "RESET_POST_LETTER";

export const postLetter = (data) => ({
  type: POST_LETTER,
  payload: data,
});

export const postLetterSuccess = (data) => ({
  type: POST_LETTER_SUCCESS,
  payload: data,
});

export const postLetterFailure = (error) => ({
  type: POST_LETTER_FAILURE,
  payload: error,
});

export const resetPostLetter = () => ({
  type: RESET_POST_LETTER,
});

const initialState = {
  letter: null,
  loading: false,
  error: null,
  success: false,
};

const postLetterReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_LETTER:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      };
    case POST_LETTER_SUCCESS:
      return {
        ...state,
        loading: false,
        letter: action.payload,
        success: true,
        error: null,
      };
    case POST_LETTER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };
    case RESET_POST_LETTER:
      return initialState;
    default:
      return state;
  }
};

export default postLetterReducer;
