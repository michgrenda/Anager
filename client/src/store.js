// Redux
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootRedcuer from "./reducers";
import setAuthToken from "./utils/setAuthToken";

const initialState = {};

const middleware = [thunk];

const store = createStore(
  rootRedcuer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

let currentState = store.getState();

// Store users' token
store.subscribe(() => {
  let previousState = currentState;
  currentState = store.getState();

  // If token changes set value and headers
  if (previousState.auth.token !== currentState.auth.token) {
    const token = currentState.auth.token;
    setAuthToken(token);
  }
});

export default store;
