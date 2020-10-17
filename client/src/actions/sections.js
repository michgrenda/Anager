import api from "../utils/api";

import {
  GET_SECTIONS,
  ADD_SECTION,
  UPDATE_SECTION,
  SECTION_ERROR,
  DELETE_SECTION,
} from "./types";

// Get all user's sections
export const getSections = () => async (dispatch) => {
  try {
    const res = await api.get("/project-sections");

    dispatch({
      type: GET_SECTIONS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: SECTION_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

// Add section
export const addSection = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/project-sections", formData);

    dispatch({
      type: ADD_SECTION,
      payload: res.data,
    });

    return Promise.resolve(res.data);
  } catch (error) {
    dispatch({
      type: SECTION_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });

    return Promise.reject(error);
  }
};

// Update section
export const updateSection = (formData, sectionId) => async (dispatch) => {
  try {
    const res = await api.patch(`/project-sections/${sectionId}`, formData);

    dispatch({
      type: UPDATE_SECTION,
      payload: res.data,
    });

    return Promise.resolve(res.data);
  } catch (error) {
    dispatch({
      type: SECTION_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });

    return Promise.reject(error);
  }
};

// Delete section
export const deleteSection = (formData, sectionId) => async (dispatch) => {
  try {
    const res = await api.delete(`/project-sections/${sectionId}`, {
      data: formData,
    });

    dispatch({
      type: DELETE_SECTION,
      payload: res.data,
    });

    return Promise.resolve(res.data);
  } catch (error) {
    dispatch({
      type: SECTION_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });

    return Promise.reject(error);
  }
};
