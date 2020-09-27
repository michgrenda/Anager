import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import sections from "./sections";
import projects from "./projects";

export default combineReducers({
  alert,
  auth,
  sections,
  projects,
});
