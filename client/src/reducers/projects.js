import {
  GET_PROJECTS,
  ADD_PROJECT,
  PROJECT_ERROR,
  UPDATE_PROJECT,
  DELETE_PROJECT,
} from "../actions/types";

const initialState = {
  project: null,
  deletedProject: null,
  projects: [],
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PROJECTS:
      return {
        ...state,
        projects: payload,
        loading: false,
      };
    case ADD_PROJECT:
      return {
        ...state,
        project: payload,
        projects: [...state.projects, payload],
        loading: false,
      };
    case UPDATE_PROJECT:
      return { ...state, project: payload, loading: false };
    case DELETE_PROJECT:
      return {
        ...state,
        deletedProject: payload,
        projects: state.projects.filter(
          (project) => project._id !== payload._id
        ),
        loading: false,
      };
    case PROJECT_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
}
