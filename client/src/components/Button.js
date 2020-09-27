import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

const Button = React.forwardRef((props, ref) => {
  // Manage received modifiers
  const { categories } = props;

  const catgs = {};
  if (categories)
    categories.forEach((catg) => (catgs[`button--${catg}`] = catg));

  const modifiers = classNames({
    ...catgs,
  });

  // Remove class after a few seconds
  const removeClassTime = (el, className) => el.classList.remove(className);

  // Add light active state
  const addLightClass = (el) => {
    el.classList.toggle(props.lightActiveClassName);
    setTimeout(
      removeClassTime.bind(null, el, props.lightActiveClassName),
      1000
    );
  };

  // Add dark active state
  const addDarkClass = (el) => {
    el.classList.toggle(props.darkActiveClassName);
    setTimeout(removeClassTime.bind(null, el, props.darkActiveClassName), 1000);
  };

  const handleButtonClick = (e) => {
    if (props.light) addLightClass.call(null, e.currentTarget);
    else if (props.dark) addDarkClass.call(null, e.currentTarget);
    if (props.onClick) props.onClick.call(null, e);
  };

  return (
    <button
      className={`button ${
        props.defaultLight && !props.defaultDark
          ? "button--default-light"
          : props.defaultDark && "button--default-dark"
      } ${modifiers} ${props.bootstrapClasses} ${
        props.outsideClickIgnoreClass
      }`}
      ref={ref}
      onClick={handleButtonClick}
      onKeyDown={props.onKeyDown}
      onFocus={props.focus}
      onBlur={props.blur}
      type={props.type}
    >
      <span
        className={`button__content ${
          props.rightIcon && "button__content--reverse-children"
        }`}
      >
        {props.icon && <i className={`button__icon ${props.icon}`}></i>}
        {props.hamburger ? (
          <span className="button__children">
            <span className="button__burger-line"></span>
            <span className="button__burger-line"></span>
            <span className="button__burger-line"></span>
          </span>
        ) : props.plus ? (
          <span className="button__children">
            <span className="button__plus-line"></span>
            <span className="button__plus-line"></span>
          </span>
        ) : props.children ? (
          <span
            className={
              props.icon &&
              `button__text ${
                props.rightIcon
                  ? "button__text--margin-right"
                  : "button__text--margin-left"
              }`
            }
          >
            {props.children}
          </span>
        ) : null}
      </span>
    </button>
  );
});

Button.defaultProps = {
  type: "button",
  lightActiveClassName: "button--light-is-active",
  darkActiveClassName: "button--dark-is-active",
  defaultLight: true,
  defaultDark: false,
};

Button.propTypes = {
  onClick: PropTypes.func,
  onKeyDown: PropTypes.func,
  type: PropTypes.string,
  icon: PropTypes.string,
  rightIcon: PropTypes.bool,
  hamburger: PropTypes.bool,
  plus: PropTypes.bool,
  children: PropTypes.string,
  categories: PropTypes.arrayOf(PropTypes.string),
  bootstrapClasses: PropTypes.string,
  outsideClickIgnoreClass: PropTypes.string,
  lightActiveClassName: PropTypes.string,
  darkActiveClassName: PropTypes.string,
};

export default Button;
