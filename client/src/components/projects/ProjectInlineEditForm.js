import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { CSSTransition } from "react-transition-group";
import onClickOutside from "react-onclickoutside";
// Components
import Button from "./../Button";

const ProjectInlineEditForm = function (props) {
  // States
  const [inputValue, setInputValue] = useState(props.projectName);

  // References
  const input = useRef(null);

  const onEntered = () => {
    if (input.current) input.current.focus();
  };

  // Control form input
  const handleInputChange = (e) => setInputValue(e.target.value);

  // Change name of project
  const handleFormSubmit = (e) => {
    e.preventDefault();

    props
      .updateProject({ name: inputValue }, props.projectId)
      .then((updatedProject) => {
        setInputValue(updatedProject.name);

        closeProjectInlineEdit();
      })
      .catch((error) => console.log(error));
  };

  // Close project inline edit using keyboard
  const handleProjectInlineEditKeyDownClose = (e) => {
    const keyboardEvent = e.which || e.key
    switch (keyboardEvent) {
      case 27:
      case "Escape":
        closeProjectInlineEditExtended();

        const button = props.triggeringElement.current[props.projectId];
        if (button) button.focus();
        break;
      default:
        break;
    }
  };

  // Close project inline edit
  const closeProjectInlineEdit = () => {
    props.onClose((prevState) => ({
      ...prevState,
      [props.projectId]: false,
    }));

    setTimeout(() => props.onExited(), props.transitionDuration);
  };

  // Close project inline edit and set project name to initial if it not updated when closing
  const closeProjectInlineEditExtended = () => {
    if (input.current)
      setInputValue(
        input.current.dataset["name"] || input.current.getAttribute("data-name")
      );

    closeProjectInlineEdit();
  };

  // React-onClickOutside
  ProjectInlineEditForm[`handleClickOutside${props.projectId}`] = (e) => {
    if (e.type === "keydown") {
      const keyboardEvent = e.which || e.key
      switch (keyboardEvent) {
        case 27:
        case "Escape":
          closeProjectInlineEditExtended();
          break;
        case 13:
        case "Enter":
          closeProjectInlineEditExtended();
          break;
        default:
          break;
      }
    } else closeProjectInlineEditExtended();
  };

  return (
    <CSSTransition
      in={props.visible}
      timeout={props.transitionDuration}
      classNames={props.transitionClassNames}
      mountOnEnter
      unmountOnExit
      onExited={props.onExited}
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
        <form className="project-inline-edit__form" onSubmit={handleFormSubmit}>
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
          <Button
            categories={["project-inline-edit"]}
            type="submit"
            icon="far fa-save"
            defaultLight={false}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        </form>
      </div>
    </CSSTransition>
  );
};

ProjectInlineEditForm.defaultProps = {
  transitionClassNames: "project-inline-edit",
  transitionDuration: 400,
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
};

const clickOutsideConfig = {
  handleClickOutside: ({ props }) =>
    ProjectInlineEditForm[`handleClickOutside${props.projectId}`],
};

export default onClickOutside(ProjectInlineEditForm, clickOutsideConfig);
