import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { CSSTransition } from "react-transition-group";
import onClickOutside from "react-onclickoutside";
// Redux
import { connect } from "react-redux";
import { deleteSection } from "../../actions/sections";
// Components
import Button from "../Button";

const DeleteConfirmation = function (props) {
  // Redux
  const { deleteSection } = props;

  // Manage received modifiers
  const { categories } = props;

  const catgs = {};
  if (categories)
    categories.forEach(
      (catg) => (catgs[`delete-cofnirmation--${catg}`] = catg)
    );

  const modifiers = classNames({
    ...catgs,
  });

  // Delete section
  const handleDeleteButtonClick = () => {
    deleteSection({ cascade: true }, props.sectionId)
      .then(() => closeDeleteSection())
      .catch((error) => console.log(error));
  };

  // Close delete section after button click
  const handleCancelButtonClick = () => closeDeleteSection();

  // Close delete section using keyboard
  const handleDeleteSectionKeyDownClose = (e) => {
    switch (e.which) {
      case 27:
        closeDeleteSection();

        const button = props.triggeringElement.current[props.sectionId];
        if (button) button.focus();
        break;
      default:
        break;
    }
  };

  // Close delete section
  const closeDeleteSection = () =>
    props.onClose((prevState) => ({ ...prevState, [props.sectionId]: false }));

  // React-onClickOutside
  DeleteConfirmation[`handleClickOutside${props.sectionId}`] = (e) => {
    if (e.type === "keydown") {
      switch (e.which) {
        case 27:
          closeDeleteSection();
          break;
        case 13:
          closeDeleteSection();
          break;
        default:
          break;
      }
    } else closeDeleteSection();
  };

  return (
    <CSSTransition
      in={props.visible}
      timeout={props.transitionDuration}
      classNames={props.transitionClassNames}
      mountOnEnter
      unmountOnExit
    >
      <section
        className={`delete-confirmation ${modifiers}`}
        onKeyDown={handleDeleteSectionKeyDownClose}
      >
        <header className="delete-confirmation__header">
          <h2>Are you sure you want to delete this {props.elementName}?</h2>
        </header>
        <article className="delete-confirmation__information">
          {props.information}
        </article>
        <div className="delete-confirmation__btns">
          <div className="delete-confirmation__btn-wrapper">
            <Button
              categories={["cancel"]}
              defaultLight={false}
              onClick={handleCancelButtonClick}
            >
              cancel
            </Button>
          </div>
          <div className="delete-confirmation__btn-wrapper">
            <Button
              categories={["delete"]}
              defaultLight={false}
              onClick={handleDeleteButtonClick}
            >
              delete
            </Button>
          </div>
        </div>
      </section>
    </CSSTransition>
  );
};

DeleteConfirmation.defaultProps = {
  transitionDuration: 400,
  transitionClassNames: "delete-confirmation",
};

DeleteConfirmation.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string),
  sectionId: PropTypes.string.isRequired,
  visible: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  transitionDuration: PropTypes.number,
  transitionClassNames: PropTypes.string,
  triggeringElement: PropTypes.object.isRequired,
  elementName: PropTypes.string,
  information: PropTypes.string,
  // Redux
  deleteSection: PropTypes.func.isRequired,
};

const clickOutsideConfig = {
  handleClickOutside: ({ props }) =>
    DeleteConfirmation[`handleClickOutside${props.sectionId}`],
};

export default connect(null, { deleteSection })(
  onClickOutside(DeleteConfirmation, clickOutsideConfig)
);
