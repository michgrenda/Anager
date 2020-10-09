import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { CSSTransition } from "react-transition-group";
import onClickOutside from "react-onclickoutside";
// Components
import Button from "../Button";

// Settings
const menuProps = [{ option: "detail view" }, { option: "delete project" }];

// Menu ***
const Menu = function (props) {
  // References
  const firstItem = useRef(null);
  const lastItem = useRef(null);

  const focusTriggeringElement = () => {
    const button = props.triggeringElement.current;
    if (button) button.focus();
  };

  const handleItemKeyDown = (e) => {
    const keyboardEvent = e.which || e.key
    switch (keyboardEvent) {
      // Trap focus
      case 9:
      case "Tab":
        if (e.shiftKey) {
          if (document.activeElement.isSameNode(firstItem.current)) {
            lastItem.current.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement.isSameNode(lastItem.current)) {
            firstItem.current.focus();
            e.preventDefault();
          }
        }
        break;
      case 13:
      case "Enter":
        e.preventDefault();

        handleItemClick();
        break;
      case 27:
      case "Escape":
        props.onClose();

        focusTriggeringElement();
        break;
      default:
        break;
    }
  };

  // Close menu and call an action after click
  const handleItemClick = (option) => {
    if (option !== "delete project") {
      focusTriggeringElement();

      props.openDetailView();

      props.onClose();
    } else
      props
        .deleteFunction()
        .then(() => props.onClose())
        .catch((error) => console.log(error));
  };

  // React-onClickOutside
  Menu[`handleClickOutside${props.uniqueId}`] = (e) => {
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

  // Variables
  const menuList = menuProps.map((item, index) => (
    <li
      className="project-menu__item"
      key={item.option}
      onClick={handleItemClick.bind(null, item.option)}
      onKeyDown={handleItemKeyDown}
      tabIndex={0}
      ref={
        index === 0
          ? firstItem
          : index === menuProps.length - 1
          ? lastItem
          : null
      }
    >
      {item.option}
    </li>
  ));

  return (
    <CSSTransition
      in={props.visible}
      timeout={props.transitionDuration}
      classNames={props.transitionClassNames}
      mountOnEnter
      unmountOnExit
    >
      <ul className="project-menu__list">{menuList}</ul>
    </CSSTransition>
  );
};

Menu.propTypes = {
  transitionDuration: PropTypes.number,
  transitionClassNames: PropTypes.string,
  visible: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  uniqueId: PropTypes.string.isRequired,
  triggeringElement: PropTypes.object.isRequired,
  deleteFunction: PropTypes.func.isRequired,
  openDetailView: PropTypes.func.isRequired,
};

const clickOutsideConfig = {
  handleClickOutside: ({ props }) =>
    Menu[`handleClickOutside${props.uniqueId}`],
};

const EnhancedMenu = onClickOutside(Menu, clickOutsideConfig);
// End ***

const ProjectMenu = function (props) {
  // States
  const [menuOpen, setMenuOpen] = useState(false);

  // References
  const triggeringElement = useRef(null);

  // Close menu using keyboard
  const handleButtonKeyDownClose = (e) => {
    const keyboardEvent = e.which || e.key
    switch (keyboardEvent) {
      case 27:
      case "Escape":
        if (menuOpen) closeMenu();
        break;
      default:
        break;
    }
  };

  // Toggle menu
  const handleButtonClickToggle = () =>
    setMenuOpen((prevMenuOpen) => !prevMenuOpen);

  // Close menu
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="project-menu">
      <Button
        categories={["project-ellipsis"]}
        icon="fas fa-ellipsis-h"
        defaultLight={false}
        outsideClickIgnoreClass={props.ignoreReactOnClickOutside}
        onClick={handleButtonClickToggle}
        onKeyDown={handleButtonKeyDownClose}
        ref={triggeringElement}
      />
      <EnhancedMenu
        eventTypes={["mousedown", "touchstart", "keydown"]}
        visible={menuOpen}
        onClose={closeMenu}
        outsideClickIgnoreClass={props.ignoreReactOnClickOutside}
        uniqueId={props.projectId}
        triggeringElement={triggeringElement}
        transitionDuration={props.transitionDuration}
        transitionClassNames={props.transitionClassNames}
        deleteFunction={props.deleteFunction}
        openDetailView={props.openDetailView}
      />
    </div>
  );
};

ProjectMenu.defaultProps = {
  transitionDuration: 400,
  transitionClassNames: "project-menu__list",
};

ProjectMenu.propTypes = {
  transitionDuration: PropTypes.number,
  transitionClassNames: PropTypes.string,
  projectId: PropTypes.string.isRequired,
  ignoreReactOnClickOutside: PropTypes.string.isRequired,
  deleteFunction: PropTypes.func.isRequired,
  openDetailView: PropTypes.func.isRequired,
};

export default ProjectMenu;
