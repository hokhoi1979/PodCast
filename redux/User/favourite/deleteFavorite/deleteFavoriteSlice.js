export const DELETE__FAVORITE = "DELETE__FAVORITE";
export const DELETE__FAVORITE__SUCCESS = "DELETE__FAVORITE_SUCCESS";
export const DELETE__FAVORITE__FAIL = "DELETE__FAVORITE_FAIL";

export const deleteFavorite = (data) => ({
  type: DELETE__FAVORITE,
  payload: data,
});
export const deleteFavoriteSuccess = (data) => ({
  type: DELETE__FAVORITE__SUCCESS,
  payload: data.categories || data,
});
export const deleteFavoriteFail = (error) => ({
  type: DELETE__FAVORITE__FAIL,
  payload: error,
});

const initialState = {
  deleteFavo: [],
  loading: false,
  error: null,
};
const deleteFavoriteReducer = (state = initialState, action) => {
  switch (action.type) {
    case DELETE__FAVORITE:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DELETE__FAVORITE__SUCCESS:
      return {
        ...state,
        loading: false,
        deleteFavo: action.payload,
      };
    case DELETE__FAVORITE__FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
export default deleteFavoriteReducer;
