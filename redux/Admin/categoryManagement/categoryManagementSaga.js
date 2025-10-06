import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../../config/apiConfig";
import {
  CREATE_CATEGORY,
  createCategoryFail,
  createCategorySuccess,
  DELETE_CATEGORY,
  deleteCategoryFail,
  deleteCategorySuccess,
  FETCH_ALL_CATEGORY,
  fetchAllCategory,
  fetchAllCategoryFail,
  fetchAllCategorySuccess,
  UPDATE_CATEGORY,
  updateCategoryFail,
  updateCategorySuccess,
} from "./categoryManagementSlice";

function* fetchAllCategorySaga() {
  try {
    const token = yield call(AsyncStorage.getItem, "accessToken");
    const response = yield call(api.get, "/api/categories", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Fetch all categories response:", response.data);
    yield put(fetchAllCategorySuccess(response.data));
  } catch (error) {
    console.error("Fetch all categories error:", error);
    const errorMessage =
      error.response?.data?.message || "Fetch all categories failed!";
    yield put(fetchAllCategoryFail(errorMessage));
  }
}

function* createCategorySaga(action) {
  try {
    const token = yield call(AsyncStorage.getItem, "accessToken");
    console.log("Creating category:", action.payload);
    const response = yield call(
      api.post,
      "/api/categories/admin/create",
      action.payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Create category response:", response.data);
    yield put(createCategorySuccess(response.data));
    yield put(fetchAllCategory());
    Toast.show({
      type: "success",
      text1: "Thành công",
      text2: "Danh mục đã được tạo!",
    });
  } catch (error) {
    console.error("Create category error:", error);
    const errorMessage =
      error.response?.data?.message || "Create category failed!";
    yield put(createCategoryFail(errorMessage));
    Toast.show({
      type: "error",
      text1: "Lỗi",
      text2: errorMessage,
    });
  }
}

function* updateCategorySaga(action) {
  try {
    const token = yield call(AsyncStorage.getItem, "accessToken");
    const { id, ...updateData } = action.payload;
    console.log("Updating category:", id, updateData);
    const response = yield call(api.put, `/api/categories/${id}`, updateData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Update category response:", response.data);
    yield put(updateCategorySuccess(response.data));
    yield put(fetchAllCategory());
    Toast.show({
      type: "success",
      text1: "Thành công",
      text2: "Danh mục đã được cập nhật!",
    });
  } catch (error) {
    console.error("Update category error:", error);
    const errorMessage =
      error.response?.data?.message || "Update category failed!";
    yield put(updateCategoryFail(errorMessage));
    Toast.show({
      type: "error",
      text1: "Lỗi",
      text2: errorMessage,
    });
  }
}

function* deleteCategorySaga(action) {
  try {
    const token = yield call(AsyncStorage.getItem, "accessToken");
    console.log("Deleting category:", action.payload);
    yield call(api.delete, `/api/categories/${action.payload}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    yield put(deleteCategorySuccess(action.payload));
    yield put(fetchAllCategory());
    Toast.show({
      type: "success",
      text1: "Thành công",
      text2: "Danh mục đã được xóa!",
    });
  } catch (error) {
    console.error("Delete category error:", error);
    const errorMessage =
      error.response?.data?.message || "Delete category failed!";
    yield put(deleteCategoryFail(errorMessage));
    Toast.show({
      type: "error",
      text1: "Lỗi",
      text2: errorMessage,
    });
  }
}

function* watchCategoryManagementSaga() {
  yield takeLatest(FETCH_ALL_CATEGORY, fetchAllCategorySaga);
  yield takeLatest(CREATE_CATEGORY, createCategorySaga);
  yield takeLatest(UPDATE_CATEGORY, updateCategorySaga);
  yield takeLatest(DELETE_CATEGORY, deleteCategorySaga);
}

export default watchCategoryManagementSaga;
