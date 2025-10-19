export const FETCH_ALL_CATEGORY = "FETCH_ALL_CATEGORY";
export const FETCH_ALL_CATEGORY_SUCCESS = "FETCH_ALL_CATEGORY_SUCCESS";
export const FETCH_ALL_CATEGORY_FAIL = "FETCH_ALL_CATEGORY_FAIL";

export const fetchAllCategory = (data) => ({
  type: FETCH_ALL_CATEGORY,
  payload: data,
});
export const fetchAllCategorySuccess = (data) => ({
  type: FETCH_ALL_CATEGORY_SUCCESS,
  payload: data.categories || data, // Handle both response.data.categories and direct array
});
export const fetchAllCategoryFail = (error) => ({
  type: FETCH_ALL_CATEGORY_FAIL,
  payload: error,
});

const initialState = {
  loading: false,
  categories: [],
  error: null,
};
export function fetchCategoryReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_ALL_CATEGORY:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ALL_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: action.payload,
      };
    case FETCH_ALL_CATEGORY_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
}
export default fetchCategoryReducer;
