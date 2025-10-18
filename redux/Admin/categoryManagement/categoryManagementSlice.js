export const FETCH_ALL_CATEGORY = "ADMIN_FETCH_ALL_CATEGORY";
export const FETCH_ALL_CATEGORY_SUCCESS = "ADMIN_FETCH_ALL_CATEGORY_SUCCESS";
export const FETCH_ALL_CATEGORY_FAIL = "ADMIN_FETCH_ALL_CATEGORY_FAIL";

export const CREATE_CATEGORY = "CREATE_CATEGORY";
export const CREATE_CATEGORY_SUCCESS = "CREATE_CATEGORY_SUCCESS";
export const CREATE_CATEGORY_FAIL = "CREATE_CATEGORY_FAIL";

export const UPDATE_CATEGORY = "UPDATE_CATEGORY";
export const UPDATE_CATEGORY_SUCCESS = "UPDATE_CATEGORY_SUCCESS";
export const UPDATE_CATEGORY_FAIL = "UPDATE_CATEGORY_FAIL";

export const DELETE_CATEGORY = "DELETE_CATEGORY";
export const DELETE_CATEGORY_SUCCESS = "DELETE_CATEGORY_SUCCESS";
export const DELETE_CATEGORY_FAIL = "DELETE_CATEGORY_FAIL";

// Action creators
export const fetchAllCategory = () => ({ type: FETCH_ALL_CATEGORY });
export const fetchAllCategorySuccess = (data) => ({
  type: FETCH_ALL_CATEGORY_SUCCESS,
  payload: data.categories || data,
});
export const fetchAllCategoryFail = (error) => ({
  type: FETCH_ALL_CATEGORY_FAIL,
  payload: error,
});

export const createCategory = (categoryData) => ({
  type: CREATE_CATEGORY,
  payload: categoryData,
});
export const createCategorySuccess = (category) => ({
  type: CREATE_CATEGORY_SUCCESS,
  payload: category,
});
export const createCategoryFail = (error) => ({
  type: CREATE_CATEGORY_FAIL,
  payload: error,
});

export const updateCategory = (categoryData) => ({
  type: UPDATE_CATEGORY,
  payload: categoryData,
});
export const updateCategorySuccess = (category) => ({
  type: UPDATE_CATEGORY_SUCCESS,
  payload: category,
});
export const updateCategoryFail = (error) => ({
  type: UPDATE_CATEGORY_FAIL,
  payload: error,
});

export const deleteCategory = (categoryId) => ({
  type: DELETE_CATEGORY,
  payload: categoryId,
});
export const deleteCategorySuccess = (categoryId) => ({
  type: DELETE_CATEGORY_SUCCESS,
  payload: categoryId,
});
export const deleteCategoryFail = (error) => ({
  type: DELETE_CATEGORY_FAIL,
  payload: error,
});

const initialState = {
  loading: false,
  categories: [],
  error: null,
};

export default function categoryManagementReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case FETCH_ALL_CATEGORY:
    case CREATE_CATEGORY:
    case UPDATE_CATEGORY:
    case DELETE_CATEGORY:
      return { ...state, loading: true, error: null };

    case FETCH_ALL_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: action.payload,
      };

    case CREATE_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: [...state.categories, action.payload],
      };

    case UPDATE_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: state.categories.map((cat) =>
          cat.id === action.payload.id ? action.payload : cat
        ),
      };

    case DELETE_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: state.categories.filter((cat) => cat.id !== action.payload),
      };

    case FETCH_ALL_CATEGORY_FAIL:
    case CREATE_CATEGORY_FAIL:
    case UPDATE_CATEGORY_FAIL:
    case DELETE_CATEGORY_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
}
