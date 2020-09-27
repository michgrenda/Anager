import React from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import { CSSTransition } from "react-transition-group";
import onClickOutside from "react-onclickoutside";

const Navbar3d = function (props) {
  // Close 3d navbar using keyboard
  const handleNav3dKeyDownClose = (e) => {
    switch (e.which) {
      case 27:
        props.onClose();

        const button = props.triggeringElement.current;
        if (button) button.focus();
        break;
      default:
        break;
    }
  };

  // React-onClickOutside
  Navbar3d.handleClickOutside = (e) => {
    if (e.type === "keydown") {
      switch (e.which) {
        case 27:
          props.onClose();
          break;
        case 13:
          props.onClose();
          break;
        default:
          break;
      }
    } else props.onClose();
  };

  // Variables
  const list = props.listProps.map((item) => (
    <li className="navbar-3d__item" key={item.path}>
      <NavLink
        exact
        to={item.path}
        activeClassName="navbar-3d__link--is-active"
        className="navbar-3d__link text text--nav"
        onClick={item.text === "sign out" ? props.signOut : props.onClick}
        // Prevent dragging
        draggable={false}
        onDragStart={() => false}
      >
        <i className={`navbar-3d__icon ${item.icon}`}></i>
        {item.text}
      </NavLink>
    </li>
  ));

  return (
    <CSSTransition
      in={props.visible}
      timeout={props.transitionDuration}
      classNames={props.transitionClassNamesNavbar3d}
      unmountOnExit
    >
      <div
        className={`navbar-3d ${props.bootstrapClasses}`}
        onKeyDown={handleNav3dKeyDownClose}
      >
        <CSSTransition
          in={props.visible}
          timeout={props.transitionDuration}
          classNames={props.transitionClassNamesList}
          appear
          onEnter={(el) => el.focus()}
        >
          <ul className="navbar-3d__list" tabIndex={0}>
            {list}
          </ul>
        </CSSTransition>
      </div>
    </CSSTransition>
  );
};

Navbar3d.defaultProps = {
  transitionDuration: 400,
  transitionClassNamesNavbar3d: "navbar-3d",
  transitionClassNamesList: "navbar-3d__list",
};

Navbar3d.propTypes = {
  bootstrapClasses: PropTypes.string,
  listProps: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClick: PropTypes.func.isRequired,
  signOut: PropTypes.func,
  transitionDuration: PropTypes.number,
  transitionClassNamesNavbar3d: PropTypes.string,
  transitionClassNamesList: PropTypes.string,
  visible: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  triggeringElement: PropTypes.object.isRequired,
};

const clickOutsideConfig = {
  handleClickOutside: () => Navbar3d.handleClickOutside,
};

export default onClickOutside(Navbar3d, clickOutsideConfig);
