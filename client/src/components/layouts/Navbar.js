import React, { useRef, useEffect, useState, useCallback } from "react";
import { NavLink, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { CSSTransition } from "react-transition-group";
// Redux
import { signOut } from "../../actions/auth";
import { connect } from "react-redux";
// Components
import Button from "../Button";
import Navbar3d from "../layouts/Navbar3d";
import Dropdown from "./Dropdown";
import SignIn from "../auth/SignIn";
import SignUp from "../auth/SignUp";

// Settings
const mainPanelProps = [
  {
    path: "/",
    text: "home",
    icon: "fas fa-home",
  },
  {
    path: "read-more",
    text: "read more",
    icon: "fas fa-info-circle",
  },
];

const mainUserPanelProps = [
  {
    path: "dashboard",
    text: "dashboard",
  },
];

const authGuestPanelProps = [
  {
    path: "sign-in",
    icon: "fas fa-sign-in-alt",
    text: "sign in",
  },
  {
    path: "sign-up",
    text: "sign up",
    icon: "fab fa-wpforms",
  },
];

const authUserPanelProps = [
  {
    path: "sign-out",
    text: "sign out",
    icon: "fas fa-sign-out-alt",
  },
];

const Navbar = function (props) {
  // Redux
  const {
    auth: {
      isAuthenticated,
      // loading
    },
    signOut,
  } = props;

  // States
  const [nav3dOpen, setNav3dOpen] = useState(false);

  // References
  const triggeringElement = useRef(null);

  // Close 3d navbar | (max-width: 991px)
  const closeNav3d = useCallback(() => {
    setNav3dOpen(false);

    if (props.main.current)
      props.main.current.classList.remove("main--is-active");
  }, [props.main]);

  // Remove classes related to 3d navbar when the window is resized ***
  const handleWindowResize = useCallback(() => {
    if (window.matchMedia("(min-width: 992px)").matches) {
      closeNav3d();
    }
  }, [closeNav3d]);

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);

    return () => window.removeEventListener("click", handleWindowResize);
  }, [handleWindowResize]);
  // End ***

  // Remove class after a few seconds
  const removeClassTime = (el, className) => el.classList.remove(className);

  // Close 3d navbar using keyboard | (max-width: 991px)
  const handleMainButtonKeyDown = (e) => {
    switch (e.which) {
      case 27:
        if (nav3dOpen) {
          e.currentTarget.classList.toggle("button--nav-main-is-active");
          setTimeout(
            removeClassTime.bind(
              null,
              e.currentTarget,
              "button--nav-main-is-active"
            ),
            1000
          );

          closeNav3d();
        }
        break;
      default:
        break;
    }
  };

  // Toggle 3d navbar | (max-width: 991px)
  const handleMainButtonClick = (e) => {
    e.currentTarget.classList.toggle("button--nav-main-is-active");
    setTimeout(
      removeClassTime.bind(null, e.currentTarget, "button--nav-main-is-active"),
      1000
    );

    setNav3dOpen((prevState) => !prevState);

    if (props.main.current)
      props.main.current.classList.toggle("main--is-active");
  };

  // Sign out
  const handleSignOutLinkClick = () => {
    signOut();
  };

  // Close 3d navbar after link click | (max-width: 991px)
  const handleNav3dLinkClick = () => {
    closeNav3d();
  };

  // Close 3d navbar and sign out after link click | (max-width: 991px)
  const handleSignOutNav3dLinkClick = () => {
    handleSignOutLinkClick();
    handleNav3dLinkClick();
  };

  // Variables
  const mainMenu = mainPanelProps.map((prop) => (
    <li className="navbar__item" key={prop.path}>
      <NavLink
        exact
        to={prop.path}
        activeClassName="navbar__link--is-active"
        className="navbar__link"
        // Prevent dragging
        draggable={false}
        onDragStart={() => false}
      >
        {prop.icon && <i className={`navbar__icon ${prop.icon}`}></i>}
        <span
          className={`navbar__text ${
            prop.icon && "navbar__text--margin-left d-none d-sm-inline"
          }`}
        >
          {prop.text}
        </span>
      </NavLink>
    </li>
  ));

  const mainUserMenu = mainUserPanelProps.map((prop) => (
    <li className="navbar__item" key={prop.path}>
      <NavLink
        exact
        to={prop.path}
        activeClassName="navbar__link--is-active"
        className="navbar__link"
        // Prevent dragging
        draggable={false}
        onDragStart={() => false}
      >
        {prop.icon && <i className={`navbar__icon ${prop.icon}`}></i>}
        <span
          className={`navbar__text ${
            prop.icon && "navbar__text--margin-left d-none d-sm-inline"
          }`}
        >
          {prop.text}
        </span>
      </NavLink>
    </li>
  ));

  const authUserMenu = authUserPanelProps.map((prop) => (
    <li className="navbar__item" key={prop.path}>
      <NavLink
        exact
        to={prop.path}
        activeClassName="navbar__link--is-active"
        className="navbar__link"
        onClick={prop.text === "sign out" && handleSignOutLinkClick}
        // Prevent dragging
        draggable={false}
        onDragStart={() => false}
      >
        {prop.icon && <i className={`navbar__icon ${prop.icon}`}></i>}
        <span
          className={`navbar__text ${prop.icon && "navbar__text--margin-left"}`}
        >
          {prop.text}
        </span>
      </NavLink>
    </li>
  ));

  return (
    <header className="header">
      <nav className="nav">
        <div className="container">
          <div className="row h-100">
            <div className="navbar col-12">
              <div className="row h-100">
                <Navbar3d
                  eventTypes={["mousedown", "touchstart", "keydown"]}
                  bootstrapClasses="col-12 d-lg-none"
                  listProps={
                    isAuthenticated ? authUserPanelProps : authGuestPanelProps
                  }
                  visible={nav3dOpen}
                  onClose={closeNav3d}
                  outsideClickIgnoreClass="navbar-3d-ignore"
                  signOut={handleSignOutNav3dLinkClick}
                  onClick={handleNav3dLinkClick}
                  triggeringElement={triggeringElement}
                />
                <CSSTransition
                  in={nav3dOpen}
                  timeout={props.transitionDuration}
                  classNames={props.transitionClassNames}
                >
                  <div className="navbar__panel navbar__panel--left col-12 col-lg-6">
                    {isAuthenticated ? (
                      <ul className="navbar__list">{mainUserMenu}</ul>
                    ) : (
                      <ul className="navbar__list">{mainMenu}</ul>
                    )}
                    <Button
                      categories={["nav-main"]}
                      bootstrapClasses="d-lg-none"
                      outsideClickIgnoreClass="navbar-3d-ignore"
                      onClick={handleMainButtonClick}
                      onKeyDown={handleMainButtonKeyDown}
                      light
                      hamburger
                      ref={triggeringElement}
                    />
                  </div>
                </CSSTransition>

                <div className="navbar__panel navbar__panel--right col-lg-6 d-none d-lg-flex">
                  {isAuthenticated ? (
                    <ul className="navbar__list">{authUserMenu}</ul>
                  ) : (
                    props.location.pathname !== "/sign-out" && (
                      <>
                        {props.location.pathname !== "/sign-in" && (
                          <Dropdown
                            dropdownMenu={<SignIn categories={["nav"]} />}
                            categories={["nav"]}
                            buttonCategories={[
                              "nav-right",
                              "nav-right-dropdown",
                            ]}
                            ignoreReactOnClickOutside="sign-in-ignore"
                            buttonActiveClass="nav-right-dropdown-is-active"
                            buttonText="sign in"
                            uniqueIdOnClickOutside="sign-in"
                          />
                        )}
                        {props.location.pathname !== "/sign-up" && (
                          <Dropdown
                            dropdownMenu={<SignUp categories={["nav"]} />}
                            categories={["nav"]}
                            buttonCategories={[
                              "nav-right",
                              "nav-right-dropdown",
                            ]}
                            ignoreReactOnClickOutside="sign-up-ignore"
                            buttonActiveClass="nav-right-dropdown-is-active"
                            buttonText="sign up"
                            uniqueIdOnClickOutside="sign-up"
                          />
                        )}
                      </>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

Navbar.defaultProps = {
  transitionDuration: 400,
  transitionClassNames: "navbar__main-panel",
};

Navbar.propTypes = {
  main: PropTypes.object,
  transitionDuration: PropTypes.number,
  transitionClassNames: PropTypes.string,
  // Redux
  signOut: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { signOut })(withRouter(Navbar));
