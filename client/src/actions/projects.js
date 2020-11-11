import api from "../utils/api";

import {
  GET_PROJECTS,
  ADD_PROJECT,
  PROJECT_ERROR,
  UPDATE_PROJECT,
  DELETE_PROJECT,
} from "./types";

// Get all user's projects
export const getProjects = () => async (dispatch) => {
  try {
    const res = await api.get("/projects");

    dispatch({
      type: GET_PROJECTS,
      payload: res.data,
    });

    return Promise.resolve(res.data);
  } catch (error) {
    dispatch({
      type: PROJECT_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });

    return Promise.reject(error);
  }
};

// Add project
export const addProject = (formData) => async (dispatch) => {
  try {
    let res;

    if (formData.projectSection && formData.projectSection !== "noSection")
      res = await api.post(`/projects/${formData.projectSection}`, formData);
    else res = await api.post("/projects/", formData);

    dispatch({
      type: ADD_PROJECT,
      payload: res.data,
    });

    return Promise.resolve(res.data);
  } catch (error) {
    dispatch({
      type: PROJECT_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });

    return Promise.reject(error);
  }
};

// Update project
export const updateProject = (formData, projectId) => async (dispatch) => {
  try {
    const res = await api.patch(`/projects/${projectId}`, formData);

    dispatch({
      type: UPDATE_PROJECT,
      payload: res.data,
    });

    return Promise.resolve(res.data);
  } catch (error) {
    dispatch({
      type: PROJECT_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });

    return Promise.reject(error);
  }
};

// Delete project
export const deleteProject = (projectId) => async (dispatch) => {
  try {
    const res = await api.delete(`/projects/${projectId}`);

    dispatch({
      type: DELETE_PROJECT,
      payload: res.data,
    });

    return Promise.resolve(res.data);
  } catch (error) {
    dispatch({
      type: PROJECT_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });

    return Promise.reject(error);
  }
};
