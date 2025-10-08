export const POST__CHAT = "POST__CHAT";
export const POST__CHAT__SUCCESS = "POST__CHAT_SUCCESS";
export const POST__CHAT__FAIL = "POST__CHAT_FAIL";

export const postChat = (data) => ({
  type: POST__CHAT,
  payload: data,
});
export const postChatSuccess = (data) => ({
  type: POST__CHAT__SUCCESS,
  payload: data.categories || data,
});
export const postChatFail = (error) => ({
  type: POST__CHAT__FAIL,
  payload: error,
});

const initialState = {
  chat: [],
  loading: false,
  error: null,
};
const postChatReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST__CHAT:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case POST__CHAT__SUCCESS:
      return {
        ...state,
        loading: false,
        chat: action.payload,
      };
    case POST__CHAT__FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
export default postChatReducer;
