import {
  GET_SECTIONS,
  ADD_SECTION,
  UPDATE_SECTION,
  SECTION_ERROR,
  DELETE_SECTION,
} from "../actions/types";

const initialState = {
  section: null,
  deletedSection: null,
  sections: [],
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_SECTIONS:
      return {
        ...state,
        sections: payload,
        loading: false,
      };
    case ADD_SECTION:
      return {
        ...state,
        section: payload,
        sections: [...state.sections, payload],
        loading: false,
      };
    case UPDATE_SECTION:
      return { ...state, section: payload, loading: false };
    case DELETE_SECTION:
      return {
        ...state,
        deletedSection: payload,
        sections: state.sections.filter(
          (section) => section._id !== payload._id
        ),
        loading: false,
      };
    case SECTION_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
}
