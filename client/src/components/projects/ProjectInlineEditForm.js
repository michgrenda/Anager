import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { CSSTransition } from "react-transition-group";
import onClickOutside from "react-onclickoutside";
// Components
// import Button from "./../Button";

const ProjectInlineEditForm = function (props) {
  // States
  const [inputValue, setInputValue] = useState(
    props.inputEmpty ? "" : props.projectName
  );
  const [updated, setUpdated] = useState(false);

  // References
  const input = useRef(null);

  const onEntered = () => {
    if (input.current) input.current.focus();
  };

  // Control form input
  const handleInputChange = (e) => setInputValue(e.target.value);

  // Update project name
  const updateProjectName = () => {
    // Information - set project name to initial if it has not been updated?
    setUpdated(true);

    props
      .updateProject({ name: input.current.value }, props.projectId)
      .then(() => closeProjectInlineEdit())
      .catch((error) => console.log(error));
  };

  // Change name of project
  const handleFormSubmit = (e) => {
    e.preventDefault();

    const initialInputValue =
      (input.current && input.current.dataset["name"]) ||
      input.current.getAttribute("data-name");

    if (
      input.current &&
      input.current.value &&
      initialInputValue !== input.current.value
    )
      updateProjectName();
    else {
      // Information - set project name to initial if it has not been updated?
      setUpdated(false);

      closeProjectInlineEdit();
    }
  };

  // Close project inline edit using keyboard
  const handleProjectInlineEditKeyDownClose = (e) => {
    const keyboardEvent = e.which || e.key;
    switch (keyboardEvent) {
      case 27:
      case "Escape":
        // Information - set project name to initial if it has not been updated?
        setUpdated(false);

        closeProjectInlineEdit();

        const button = props.triggeringElement.current[props.projectId];
        if (button) button.focus();
        break;
      default:
        break;
    }
  };

  // Close project inline edit
  const closeProjectInlineEdit = () =>
    props.onClose((prevState) => ({
      ...prevState,
      [props.projectId]: false,
    }));

  const onExited = () => {
    props.onExited();

    // Set project name to initial if it has not been updated when closing
    if (!updated && input.current)
      setInputValue(
        input.current.dataset["name"] || input.current.getAttribute("data-name")
      );
  };

  // React-onClickOutside
  ProjectInlineEditForm[`handleClickOutside${props.projectId}`] = (e) => {
    const initialInputValue =
      (input.current && input.current.dataset["name"]) ||
      input.current.getAttribute("data-name");

    if (
      input.current &&
      input.current.value &&
      initialInputValue !== input.current.value
    )
      updateProjectName();
    else {
      // Information - set project name to initial if it has not been updated?
      setUpdated(false);

      if (e.type === "keydown") {
        const keyboardEvent = e.which || e.key;
        switch (keyboardEvent) {
          case 27:
          case "Escape":
            closeProjectInlineEdit();
            break;
          case 13:
          case "Enter":
            closeProjectInlineEdit();
            break;
          default:
            break;
        }
      } else closeProjectInlineEdit();
    }
  };

  return (
    <CSSTransition
      in={props.visible}
      timeout={props.transitionDuration}
      classNames={props.transitionClassNames}
      unmountOnExit
      onExited={onExited}
      onEntered={onEntered}
    >
      <div
        className="project-inline-edit"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onKeyDown={handleProjectInlineEditKeyDownClose}
      >
        <form
          className="project-inline-edit__form"
          onSubmit={handleFormSubmit}
          autoComplete="off"
        >
          <div className="project-inline-edit__input-wrapper">
            <input
              className="project-inline-edit__input"
              data-name={props.projectName}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              name={props.projectId}
              autoFocus
              required
              ref={input}
            ></input>
          </div>
          {/* <Button
            categories={["project-inline-edit"]}
            type="submit"
            icon="far fa-save"
            defaultLight={false}
            onClick={(e) => {
              e.stopPropagation();
            }}
          /> */}
        </form>
      </div>
    </CSSTransition>
  );
};

ProjectInlineEditForm.defaultProps = {
  transitionClassNames: "project-inline-edit",
  transitionDuration: 400,
  inputEmpty: false,
};

ProjectInlineEditForm.propTypes = {
  projectId: PropTypes.string.isRequired,
  projectName: PropTypes.string.isRequired,
  transitionDuration: PropTypes.number,
  transitionClassNames: PropTypes.string,
  visible: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onExited: PropTypes.func.isRequired,
  triggeringElement: PropTypes.object.isRequired,
  updateProject: PropTypes.func.isRequired,
  inputEmpty: PropTypes.bool,
};

const clickOutsideConfig = {
  handleClickOutside: ({ props }) =>
    ProjectInlineEditForm[`handleClickOutside${props.projectId}`],
};

export default onClickOutside(ProjectInlineEditForm, clickOutsideConfig);
