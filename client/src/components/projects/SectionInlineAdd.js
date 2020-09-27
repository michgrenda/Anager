import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { CSSTransition } from "react-transition-group";
import onClickOutside from "react-onclickoutside";
// Redux
import { connect } from "react-redux";
import { addSection } from "../../actions/sections";
// Components
import Button from "../Button";

// Form ***
const Form = function (props) {
  // Redux
  const { addSection } = props;

  // States
  const [sectionName, setSectionName] = useState("");

  // Close form using keyboard
  const handleFormKeyDownClose = (e) => {
    switch (e.which) {
      case 27:
        closeForm();
        break;
      default:
        break;
    }
  };

  // Control form input
  const handleInputChange = (e) => {
    setSectionName(e.target.value);
  };

  // Create section
  const handleFormSubmit = (e) => {
    e.preventDefault();

    addSection({ name: sectionName })
      .then(() => closeForm())
      .catch((error) => console.log(error));
  };

  // Close form
  const closeForm = () => {
    // Set section name to initial if it is not updated when closing
    setSectionName("");

    props.onClose();
  };

  // React-onClickOutside
  Form.handleClickOutside = () => closeForm();

  return (
    <CSSTransition
      in={props.visible}
      timeout={props.transitionDuration}
      classNames={props.transitionClassNames}
      mountOnEnter
      unmountOnExit
      onExited={props.onExited}
    >
      <div
        className="section-inline-add__form-wrapper"
        onKeyDown={handleFormKeyDownClose}
      >
        <form className="section-inline-add__form" onSubmit={handleFormSubmit}>
          <div className="section-inline-add__input-wrapper">
            <input
              className="section-inline-add__input"
              type="text"
              onChange={handleInputChange}
              autoFocus
              name="name"
              value={sectionName["name"]}
              required
            />
          </div>
          <Button
            categories={["section-inline-add"]}
            type="submit"
            defaultLight={false}
            plus
          />
        </form>
      </div>
    </CSSTransition>
  );
};

Form.propTypes = {
  transitionClassName: PropTypes.string,
  transitionDuration: PropTypes.number,
  visible: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onExited: PropTypes.func.isRequired,
  // Redux
  addSection: PropTypes.func.isRequired,
};

const clickOutsideConfig = {
  handleClickOutside: () => Form.handleClickOutside,
};

const EnhancedForm = connect(null, { addSection })(
  onClickOutside(Form, clickOutsideConfig)
);
// End ***

const SectionInlineAdd = (props) => {
  // States
  const [formOpen, setFormOpen] = useState(false);
  const [addSectionHidden, setAddSectionHidden] = useState(false);

  // References
  const triggeringElement = useRef(null);

  // Open form using keyboard
  const handleAddSectionKeyDown = (e) => {
    switch (e.which) {
      case 13:
        e.preventDefault();
        handleAddSectionClick();
        break;
      default:
        break;
    }
  };

  // Open form
  const handleAddSectionClick = () => {
    setFormOpen(true);
    setAddSectionHidden(true);
  };

  // Close form
  const closeForm = () => {
    setFormOpen(false);
  };

  const restoreAddSection = () => {
    setAddSectionHidden(false);
    setTimeout(() => {
      const button = triggeringElement.current;
      if (button) button.focus();
    }, 0);
  };

  return (
    <section className="section-inline-add">
      {!addSectionHidden && (
        <div
          className="section-inline-add__information"
          onClick={handleAddSectionClick}
          onKeyDown={handleAddSectionKeyDown}
          tabIndex={0}
          ref={triggeringElement}
        >
          <div className="section-inline-add__icon">
            <span className="section-inline-add__plus-line"></span>
            <span className="section-inline-add__plus-line"></span>
          </div>
          <span className="section-inline-add__text">add section</span>
        </div>
      )}
      <EnhancedForm
        onClose={closeForm}
        visible={formOpen}
        onExited={restoreAddSection}
        transitionDuration={props.transitionDuration}
        transitionClassNames={props.transitionClassNames}
      />
    </section>
  );
};

SectionInlineAdd.defaultProps = {
  transitionDuration: 400,
  transitionClassNames: "section-inline-add__form-wrapper",
};

SectionInlineAdd.propTypes = {
  transitionDuration: PropTypes.number,
  transitionClassNames: PropTypes.string,
};

export default SectionInlineAdd;
