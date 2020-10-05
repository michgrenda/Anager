import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { CSSTransition } from "react-transition-group";
import onClickOutside from "react-onclickoutside";
// Components
import Button from "./../Button";

const SectionInlineEditForm = function (props) {
  // States
  const [inputValue, setInputValue] = useState(props.sectionName);

  // References
  const input = useRef(null);

  const onEntered = () => {
    if (input.current) input.current.focus();
  };

  // Control form input
  const handleInputChange = (e) => setInputValue(e.target.value);

  // Change name of section
  const handleFormSubmit = (e) => {
    e.preventDefault();

    props
      .updateSection({ name: inputValue }, props.sectionId)
      .then((updatedSection) => {
        setInputValue(updatedSection.name);

        closeSectionInlineEdit();
      })
      .catch((error) => console.log(error));
  };

  // Close section inline edit using keyboard
  const handleSectionInlineEditKeyDownClose = (e) => {
    switch (e.which) {
      case 27:
        closeSectionInlineEditExtended();

        const button = props.triggeringElement.current[props.sectionId];
        if (button) button.focus();
        break;
      default:
        break;
    }
  };

  // Close section inline edit
  const closeSectionInlineEdit = () => {
    props.onClose((prevState) => ({
      ...prevState,
      [props.sectionId]: false,
    }));

    setTimeout(() => props.onExited(), props.transitionDuration);
  };

  // Close section inline edit and set sectiona name to initial if it is not updated when closing
  const closeSectionInlineEditExtended = () => {
    if (input.current)
      setInputValue(
        input.current.dataset["name"] || input.current.getAttribute("data-name")
      );

    closeSectionInlineEdit();
  };

  // React-onClickOutside
  SectionInlineEditForm[`handleClickOutside${props.sectionId}`] = (e) => {
    if (e.type === "keydown") {
      switch (e.which) {
        case 27:
          closeSectionInlineEditExtended();
          break;
        case 13:
          closeSectionInlineEditExtended();
          break;
        default:
          break;
      }
    } else closeSectionInlineEditExtended();
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
        className="section-inline-edit"
        onKeyDown={handleSectionInlineEditKeyDownClose}
      >
        <form className="section-inline-edit__form" onSubmit={handleFormSubmit}>
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
          <Button
            categories={["section-inline-edit"]}
            type="submit"
            icon="far fa-save"
            defaultLight={false}
          />
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
