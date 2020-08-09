import React from "react";
import { NavLink } from "react-router-dom";

// Settings
const lnksProps = [
  {
    path: "sign-in",
    icon: "fas fa-sign-in-alt",
    text: "sign in",
  },
  {
    path: "sign-up",
    icon: "fab fa-wpforms",
    text: "sign up",
  },
];

export const Navbar3d = React.forwardRef((props, ref) => {
  // Variables
  const lnks = lnksProps.map((lnkProp) => (
    <li className="navbar-3d__itm" key={lnkProp.path}>
      <NavLink
        exact
        className="navbar-3d__lnk txt txt--nav txt--nav-3d"
        to={lnkProp.path}
        onClick={props.click}
        activeClassName="navbar-3d__lnk--is-active"
      >
        <i className={`navbar-3d__icon ${lnkProp.icon}`}></i>
        {lnkProp.text}
      </NavLink>
    </li>
  ));

  return (
    <div className={`navbar-3d ${props.bootstrapClasses || ""}`} ref={ref}>
      <ul className="navbar-3d__lst">{lnks}</ul>
    </div>
  );
});
