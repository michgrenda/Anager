import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { CSSTransition } from "react-transition-group";
import onClickOutside from "react-onclickoutside";
// Components
// import Button from "./../Button";

const SectionInlineEditForm = function (props) {
  // States
  const [inputValue, setInputValue] = useState(props.sectionName);
  const [updated, setUpdated] = useState(false);

  // References
  const input = useRef(null);

  const onEntered = () => {
    if (input.current) input.current.focus();
  };

  // Control form input
  const handleInputChange = (e) => setInputValue(e.target.value);

  // Update section name
  const updateSectionName = () => {
    // Information - set section name to initial if it has not been updated?
    setUpdated(true);

    props
      .updateSection({ name: input.current.value }, props.sectionId)
      .then(() => closeSectionInlineEdit())
      .catch((error) => console.log(error));
  };

  // Change name of section
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
      updateSectionName();
    else {
      // Information - set section name to initial if it has not been updated?
      setUpdated(false);

      closeSectionInlineEdit();
    }
  };

  // Close section inline edit using keyboard
  const handleSectionInlineEditKeyDownClose = (e) => {
    const keyboardEvent = e.which || e.key;
    switch (keyboardEvent) {
      case 27:
      case "Escape":
        // Information - set section name to initial if it has not been updated?
        setUpdated(false);

        closeSectionInlineEdit();

        const button = props.triggeringElement.current[props.sectionId];
        if (button) button.focus();
        break;
      default:
        break;
    }
  };

  // Close section inline edit
  const closeSectionInlineEdit = () =>
    props.onClose((prevState) => ({
      ...prevState,
      [props.sectionId]: false,
    }));

  const onExited = () => {
    props.onExited();

    // Set section name to initial if it has not been updated when closing
    if (!updated && input.current)
      setInputValue(
        input.current.dataset["name"] || input.current.getAttribute("data-name")
      );
  };

  // React-onClickOutside
  SectionInlineEditForm[`handleClickOutside${props.sectionId}`] = (e) => {
    const initialInputValue =
      (input.current && input.current.dataset["name"]) ||
      input.current.getAttribute("data-name");

    if (
      input.current &&
      input.current.value &&
      initialInputValue !== input.current.value
    )
      updateSectionName();
    else {
      // Information - set section name to initial if it has not been updated?
      setUpdated(false);

      if (e.type === "keydown") {
        const keyboardEvent = e.which || e.key;
        switch (keyboardEvent) {
          case 27:
          case "Escape":
            closeSectionInlineEdit();
            break;
          case 13:
          case "Enter":
            closeSectionInlineEdit();
            break;
          default:
            break;
        }
      } else closeSectionInlineEdit();
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
        className="section-inline-edit"
        onKeyDown={handleSectionInlineEditKeyDownClose}
      >
        <form
          className="section-inline-edit__form"
          onSubmit={handleFormSubmit}
          autoComplete="off"
        >
          <div className="section-inline-edit__input-wrapper">
            <input
              className="section-inline-edit__input"
              data-name={props.sectionName}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              name={props.sectionId}
              autoFocus
              required
              ref={input}
            ></input>
          </div>
          {/* <Button
            categories={["section-inline-edit"]}
            type="submit"
            icon="far fa-save"
            defaultLight={false}
          /> */}
        </form>
      </div>
    </CSSTransition>
  );
};

SectionInlineEditForm.defaultProps = {
  transitionClassNames: "section-inline-edit",
  transitionDuration: 400,
};

SectionInlineEditForm.propTypes = {
  sectionId: PropTypes.string.isRequired,
  sectionName: PropTypes.string.isRequired,
  transitionDuration: PropTypes.number,
  transitionClassNames: PropTypes.string,
  visible: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onExited: PropTypes.func.isRequired,
  triggeringElement: PropTypes.object.isRequired,
  updateSection: PropTypes.func.isRequired,
};

const clickOutsideConfig = {
  handleClickOutside: ({ props }) =>
    SectionInlineEditForm[`handleClickOutside${props.sectionId}`],
};

export default onClickOutside(SectionInlineEditForm, clickOutsideConfig);
