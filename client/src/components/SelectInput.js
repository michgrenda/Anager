import React, { useState, useRef } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import onClickOutside from "react-onclickoutside";
import { CSSTransition } from "react-transition-group";
import Ripple from "@intereact/ripple";
// List ***
const List = function (props) {
  // References
  const firstItem = useRef(null);
  const lastItem = useRef(null);

  const focusTriggeringElement = () => {
    const button = props.triggeringElement.current;
    if (button) button.focus();
  };

  const handleItemKeyDown = (key, title, e) => {
    switch (e.which) {
      // Trap focus
      case 9:
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
        handleItemClick(key, title);
        break;
      case 27:
        props.onClose();

        focusTriggeringElement();
        break;
      default:
        break;
    }
  };

  // Close list and set data after item click
  const handleItemClick = (key, title) => {
    focusTriggeringElement();
    if (props.headerTitle !== title) {
      props.setData(key, title);
      props.setHeaderTitle(title);
    }

    props.onClose();
  };

  const handleItemMouseOver = (e) => {
    const parent = e.currentTarget.parentElement;
    [...parent.children].forEach((child) =>
      child.classList.remove("select-input__item--selected")
    );
    e.currentTarget.classList.add("select-input__item--selected");
  };

  // React-onClickOutside
  List[`handleClickOutside${props.uniqueId}`] = (e) => {
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
  const selectList = props.listProps.map((item, index) => (
    <li
      className={`select-input__item select-input__item--${item.title.replace(
        / /g,
        "-"
      )} ${
        props.headerTitle === item.title &&
        `select-input__item--selected-${item.title.replace(/ /g, "-")}`
      } ${props.headerTitle === item.title && "select-input__item--selected"}`}
      key={item.title}
      onClick={handleItemClick.bind(null, item.key, item.title)}
      onKeyDown={handleItemKeyDown.bind(null, item.key, item.title)}
      onMouseOver={handleItemMouseOver}
      onFocus={handleItemMouseOver}
      tabIndex={0}
      ref={
        index === 0
          ? firstItem
          : index === props.listProps.length - 1
          ? lastItem
          : null
      }
    >
      <span className="select-input__option">{item.title}</span>
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
      <ul className="select-input__list">{selectList}</ul>
    </CSSTransition>
  );
};

List.propTypes = {
  transitionDuration: PropTypes.number,
  transitionClassNames: PropTypes.string,
  visible: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  uniqueId: PropTypes.string.isRequired,
  triggeringElement: PropTypes.object.isRequired,
  headerTitle: PropTypes.string.isRequired,
  setHeaderTitle: PropTypes.func.isRequired,
  listProps: PropTypes.arrayOf(PropTypes.object).isRequired,
  setData: PropTypes.func.isRequired,
};

const clickOutsideConfig = {
  handleClickOutside: ({ props }) =>
    List[`handleClickOutside${props.uniqueId}`],
};

const EnhancedList = onClickOutside(List, clickOutsideConfig);
// End ***

const SelectInput = function (props) {
  // States
  const [listOpen, setListOpen] = useState(false);
  const [headerTitle, setHeaderTitle] = useState(props.title);

  // References
  const triggeringElement = useRef(null);

  // Manage received modifiers
  const { categories } = props;

  const catgs = {};
  if (categories)
    categories.forEach((catg) => (catgs[`select-input--${catg}`] = catg));

  const modifiers = classNames({
    ...catgs,
  });

  // Toggle list using keyboard (enter)
  // Close list using keyboard (escape)
  const handleSelectInputKeyDown = (e) => {
    switch (e.which) {
      case 13:
        handleSelectInputClick();
        break;
      case 27:
        if (listOpen) closeList();
        break;
      default:
        break;
    }
  };

  // Toggle list
  const handleSelectInputClick = () =>
    setListOpen((prevListOpen) => !prevListOpen);

  // Close List
  const closeList = () => setListOpen(false);

  return (
    <div
      className={`select-input ${
        props.defaultLight && !props.defaultDark
          ? "select-input--default-light"
          : props.defaultDark && "select-input--default-dark"
      } ${modifiers} ${
        !headerTitle.startsWith("select") &&
        `select-input--${headerTitle.replace(/ /g, "-")}`
      }`}
    >
      <div
        className={`select-input__header ${props.ignoreReactOnClickOutside}`}
        onClick={handleSelectInputClick}
        onKeyDown={handleSelectInputKeyDown}
        tabIndex={0}
        ref={triggeringElement}
      >
        <Ripple size={props.ripples ? "cover" : 0}>
          {(ripples) => (
            <div
              className="select-input__title-wrapper"
              style={{ position: "relative" }}
            >
              <span className="select-input__title">{headerTitle}</span>
              {ripples}
            </div>
          )}
        </Ripple>

        <CSSTransition
          in={listOpen}
          timeout={props.transitionDurationIcon}
          classNames={props.transitionClassNamesIcon}
        >
          <i className="select-input__icon fas fa-angle-down"></i>
        </CSSTransition>
      </div>
      <EnhancedList
        eventTypes={["mousedown", "touchstart", "keydown"]}
        visible={listOpen}
        onClose={closeList}
        outsideClickIgnoreClass={props.ignoreReactOnClickOutside}
        uniqueId={props.uniqueIdOnClickOutside}
        triggeringElement={triggeringElement}
        headerTitle={headerTitle}
        setHeaderTitle={setHeaderTitle}
        listProps={props.listProps}
        transitionDuration={props.transitionDurationList}
        transitionClassNames={props.transitionClassNamesList}
        setData={props.setData}
      />
    </div>
  );
};

SelectInput.defaultProps = {
  transitionDurationList: 400,
  transitionDurationIcon: 400,
  transitionClassNamesList: "select-input__list",
  transitionClassNamesIcon: "select-input__icon",
  defaultLight: true,
  defaultDark: false,
  ripples: true,
};

SelectInput.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string.isRequired,
  listProps: PropTypes.arrayOf(PropTypes.object).isRequired,
  setData: PropTypes.func.isRequired,
  uniqueIdOnClickOutside: PropTypes.string.isRequired,
  ignoreReactOnClickOutside: PropTypes.string.isRequired,
  transitionDurationList: PropTypes.number,
  transitionDurationIcon: PropTypes.number,
  transitionClassNamesList: PropTypes.string,
  transitionClassNamesIcon: PropTypes.string,
  defaultLight: PropTypes.bool,
  defaultDark: PropTypes.bool,
  ripples: PropTypes.bool,
};

export default SelectInput;
