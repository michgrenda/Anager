import axios from "axios";
import store from "../store";
import { LOGOUT } from "../actions/types";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response.data.msg === "Token is not valid") {
      store.dispatch({ type: LOGOUT });
    }
    return Promise.reject(error);
  }
);

export default api;
