import { v4 as uuidv4 } from "uuid";
import { SET_ALERT, REMOVE_ALERT } from "./types";

export const setAlert = (message, alertType, icon, from, timeout = 5000) => (
  dispatch
) => {
  const id = uuidv4();
  dispatch({
    type: SET_ALERT,
    from: from,
    payload: { message, alertType, icon, id },
  });
  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};
