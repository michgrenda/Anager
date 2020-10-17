import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { CSSTransition } from "react-transition-group";
import onClickOutside from "react-onclickoutside";
// Components
import Button from "../Button";

const DeleteConfirmation = function (props) {
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
    props
      .deleteFunction()
      .then(() => closeDeleteConfirmation())
      .catch((error) => console.log(error));
  };

  // Close delete section after button click
  const handleCancelButtonClick = () => closeDeleteConfirmation();

  // Close delete confirmation using keyboard
  const handleDeleteConfirmationKeyDown = (e) => {
    const keyboardEvent = e.which || e.key;
    switch (keyboardEvent) {
      case 27:
      case "Escape":
        closeDeleteConfirmation();

        const button = props.triggeringElement.current[props.uniqueId];
        if (button) button.focus();
        break;
      default:
        break;
    }
  };

  // Close delete confirmation
  const closeDeleteConfirmation = () =>
    props.onClose((prevState) => ({ ...prevState, [props.uniqueId]: false }));

  // React-onClickOutside
  DeleteConfirmation[`handleClickOutside${props.uniqueId}`] = (e) => {
    if (e.type === "keydown") {
      const keyboardEvent = e.which || e.key;
      switch (keyboardEvent) {
        case 27:
        case "Escape":
          closeDeleteConfirmation();
          break;
        case 13:
        case "Enter":
          closeDeleteConfirmation();
          break;
        default:
          break;
      }
    } else closeDeleteConfirmation();
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
        onKeyDown={handleDeleteConfirmationKeyDown}
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
  uniqueId: PropTypes.string.isRequired,
  visible: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  transitionDuration: PropTypes.number,
  transitionClassNames: PropTypes.string,
  triggeringElement: PropTypes.object.isRequired,
  elementName: PropTypes.string,
  information: PropTypes.string,
  deleteFunction: PropTypes.func.isRequired,
};

const clickOutsideConfig = {
  handleClickOutside: ({ props }) =>
    DeleteConfirmation[`handleClickOutside${props.uniqueId}`],
};

export default onClickOutside(DeleteConfirmation, clickOutsideConfig);
