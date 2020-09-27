import { setAlert } from "./alert";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGOUT,
} from "./types";
import api from "../utils/api";

// Load user
export const loadUser = () => async (dispatch) => {
  try {
    const res = await api.get("/auth");

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });

    return Promise.resolve(res.data);
  } catch (error) {
    dispatch({
      type: AUTH_ERROR,
    });

    return Promise.reject(error);
  }
};

// Create user
export const signUp = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/users", formData);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });

    return dispatch(loadUser());
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach((error) =>
        dispatch(
          setAlert(error.msg, "danger", "fas fa-exclamation-circle", "sign-up")
        )
      );
    }

    dispatch({
      type: REGISTER_FAIL,
    });

    return Promise.reject(error);
  }
};

// Authenticate user
export const signIn = (formData) => async (dispatch) => {
  try {
    const res = await api.post("/auth", formData);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    return dispatch(loadUser());
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach((error) =>
        dispatch(
          setAlert(error.msg, "danger", "fas fa-exclamation-circle", "sign-in")
        )
      );
    }

    dispatch({
      type: LOGIN_FAIL,
    });

    return Promise.reject(error);
  }
};

// Logout user
export const signOut = () => (dispatch) => {
  return dispatch({ type: LOGOUT });
};
