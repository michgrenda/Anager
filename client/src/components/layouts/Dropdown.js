import React, { useState, useRef } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { CSSTransition } from "react-transition-group";
import onClickOutside from "react-onclickoutside";
// Components
import Button from "../Button";

// Dropdown menu ***
const DropdownMenu = function (props) {
  // React-onClickOutside
  DropdownMenu[`handleClickOutside${props.uniqueId}`] = (e) => {
    if (e.type === "keydown") {
      const keyboardEvent = e.which || e.key
      switch (keyboardEvent) {
        case 27:
        case "Escape":
          props.onClose();
          break;
        case 13:
        case "Enter":
          props.onClose();
          break;
        default:
          break;
      }
    } else props.onClose();
  };

  return (
    <CSSTransition
      in={props.visible}
      timeout={props.transitionDuration}
      classNames={props.transitionClassNames}
      mountOnEnter
      unmountOnExit
    >
      {props.dropdownMenu}
    </CSSTransition>
  );
};

DropdownMenu.propTypes = {
  transitionDuration: PropTypes.number,
  transitionClassNames: PropTypes.string,
  visible: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  uniqueId: PropTypes.string.isRequired,
  dropdownMenu: PropTypes.object.isRequired,
};

const clickOutsideConfig = {
  handleClickOutside: ({ props }) =>
    DropdownMenu[`handleClickOutside${props.uniqueId}`],
};

const EnhancedDropdownMenu = onClickOutside(DropdownMenu, clickOutsideConfig);
// End ***

const Dropdown = (props) => {
  // States
  const [dropdownMenuOpen, setDropdownMenuOpen] = useState(false);

  // References
  const triggeringElement = useRef(null);

  // Manage received modifiers
  const { categories } = props;

  const catgs = {};
  if (categories)
    categories.forEach((catg) => (catgs[`dropdown--${catg}`] = catg));

  const modifiers = classNames({
    ...catgs,
  });

  // Close dropdown menu using keyboard
  const handleDropdownKeyDownClose = (e) => {
    const keyboardEvent = e.which || e.key
    switch (keyboardEvent) {
      case 27:
      case "Escape":
        if (dropdownMenuOpen) {
          closeDropdownMenu();

          const button = triggeringElement.current;
          if (button) button.focus();
        }
        break;
      default:
        break;
    }
  };

  // Toggle dropdown menu
  const handleButtonClick = (e) => {
    e.currentTarget.classList.toggle(`button--${props.buttonActiveClass}`);

    setDropdownMenuOpen((prevState) => !prevState);
  };

  // Close dropdown menu
  const closeDropdownMenu = () => {
    const button = triggeringElement.current;
    if (button) button.classList.remove(`button--${props.buttonActiveClass}`);

    setDropdownMenuOpen(false);
  };

  return (
    <div
      className={`dropdown ${modifiers}`}
      onKeyDown={handleDropdownKeyDownClose}
    >
      <Button
        categories={props.buttonCategories}
        icon="fas fa-angle-down"
        defaultLight={false}
        rightIcon
        outsideClickIgnoreClass={props.ignoreReactOnClickOutside}
        onClick={handleButtonClick}
        ref={triggeringElement}
      >
        {props.buttonText}
      </Button>
      <EnhancedDropdownMenu
        eventTypes={["mousedown", "touchstart", "keydown"]}
        visible={dropdownMenuOpen}
        onClose={closeDropdownMenu}
        outsideClickIgnoreClass={props.ignoreReactOnClickOutside}
        uniqueId={props.uniqueIdOnClickOutside}
        dropdownMenu={props.dropdownMenu}
        transitionDuration={props.transitionDuration}
        transitionClassNames={props.transitionClassNames}
      />
    </div>
  );
};

Dropdown.defaultProps = {
  transitionDuration: 400,
  transitionClassNames: "dropdown-menu",
};

Dropdown.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string),
  buttonCategories: PropTypes.arrayOf(PropTypes.string),
  buttonActiveClass: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  uniqueIdOnClickOutside: PropTypes.string.isRequired,
  dropdownMenu: PropTypes.object.isRequired,
  ignoreReactOnClickOutside: PropTypes.string.isRequired,
  transitionDuration: PropTypes.number,
  transitionClassNames: PropTypes.string,
};

export default Dropdown;
