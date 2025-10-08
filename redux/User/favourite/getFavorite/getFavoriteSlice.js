export const GET__FAVORITE = "GET__FAVORITE";
export const GET__FAVORITE__SUCCESS = "GET__FAVORITE_SUCCESS";
export const GET__FAVORITE__FAIL = "GET__FAVORITE_FAIL";

export const getFavorite = (data) => ({
  type: GET__FAVORITE,
  payload: data,
});
export const getFavoriteSuccess = (data) => ({
  type: GET__FAVORITE__SUCCESS,
  payload: data.categories || data,
});
export const getFavoriteFail = (error) => ({
  type: GET__FAVORITE__FAIL,
  payload: error,
});

const initialState = {
  getFavo: [],
  loading: false,
  error: null,
};
const getFavoriteReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET__FAVORITE:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET__FAVORITE__SUCCESS:
      return {
        ...state,
        loading: false,
        getFavo: action.payload,
      };
    case GET__FAVORITE__FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
export default getFavoriteReducer;
