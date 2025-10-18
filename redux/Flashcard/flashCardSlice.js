export const POST_FLASHCARD_REQUEST = "POST_FLASHCARD_REQUEST";
export const POST_FLASHCARD_SUCCESS = "POST_FLASHCARD_SUCCESS";
export const POST_FLASHCARD_FAILURE = "POST_FLASHCARD_FAILURE";

export const postFlashCardRequest = (payload) => ({
  type: POST_FLASHCARD_REQUEST,
  payload,
});
export const postFlashCardSuccess = (data) => ({
  type: POST_FLASHCARD_SUCCESS,
  payload: data,
});
export const postFlashCardFailure = (error) => ({
  type: POST_FLASHCARD_FAILURE,
  payload: error,
});
const initialState = {
  loading: false,
  data: null,
  error: null,
};
export const postFlashCardReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_FLASHCARD_REQUEST:
      return { ...state, loading: true, error: null };
    case POST_FLASHCARD_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case POST_FLASHCARD_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default postFlashCardReducer;
