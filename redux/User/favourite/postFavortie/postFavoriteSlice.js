export const POST__FAVORITE = "POST__FAVORITE";
export const POST__FAVORITE__SUCCESS = "POST__FAVORITE_SUCCESS";
export const POST__FAVORITE__FAIL = "POST__FAVORITE_FAIL";

export const postFavorite = (data) => ({
  type: POST__FAVORITE,
  payload: data,
});
export const postFavoriteSuccess = (data) => ({
  type: POST__FAVORITE__SUCCESS,
  payload: data.categories || data,
});
export const postFavoriteFail = (error) => ({
  type: POST__FAVORITE__FAIL,
  payload: error,
});

const initialState = {
  postFavo: [],
  loading: false,
  error: null,
};
const postFavoriteReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST__FAVORITE:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case POST__FAVORITE__SUCCESS:
      return {
        ...state,
        loading: false,
        postFavo: action.payload,
      };
    case POST__FAVORITE__FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
export default postFavoriteReducer;
