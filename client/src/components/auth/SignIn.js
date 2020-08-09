import React from "react";
import { Button } from "../Button";
import classNames from "classnames";

// Settings
const socBtnsProps = [
  {
    icon: "fab fa-google",
  },
  {
    icon: "fab fa-facebook-f",
  },
];

const formInpsProps = [
  {
    type: "text",
    placeholder: "E-mail adrress",
  },
  {
    type: "password",
    placeholder: "Password",
  },
];

const formBtnsProps = [
  {
    icon: "fas fa-lock",
    text: "sign in",
  },
  {
    icon: "fas fa-unlock",
    text: "forgot password?",
  },
];

export const SignIn = (props) => {
  // Manage the properties
  const catgs = {};
  if (props.categories) {
    props.categories.forEach((catg) => {
      catgs[`sign-in--${catg}`] = catg;
    });
  }

  const cls = classNames({
    ...catgs,
  });

  // Remove the placeholder when the input is focused
  const handleFocus = (e) => {
    const plhlr = e.target.nextSibling;
    plhlr.style.opacity = 0;
  };

  // Restore the placeholder when the input is blurred
  const handleBlur = (e) => {
    const plhlr = e.target.nextSibling;
    plhlr.style.opacity = 1;
  };

  // Variables
  const formInps = formInpsProps.map((formInpProp) => (
    <div className="sign-in__inp-wrap" key={formInpProp.placeholder}>
      <input
        className="sign-in__inp"
        type={formInpProp.type}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={props.hidden}
      />
      <span
        className="sign-in__plhlr"
        data-placeholder={formInpProp.placeholder}
      ></span>
    </div>
  ));

  let btnSocCls = null;
  let btnFormCls = null;

  if (window.matchMedia("(max-width: 992px)").matches) {
    btnSocCls = ["sign-in", "soc-si"];
    btnFormCls = ["sign-in"];
  } else {
    btnSocCls = ["sign-in", "soc-si", "nav-soc"];
    btnFormCls = ["sign-in", "nav-sign-in"];
  }

  const socBtns = socBtnsProps.map((socBtnProp) => (
    <Button
      categories={btnSocCls}
      textCategory="sign-in"
      icon={socBtnProp.icon}
      key={socBtnProp.icon}
      hidden={props.hidden}
    ></Button>
  ));

  const formBtns = formBtnsProps.map((formBtnsProp) => (
    <Button
      categories={btnFormCls}
      icon={formBtnsProp.icon}
      key={formBtnsProp.text}
      hidden={props.hidden}
    >
      {formBtnsProp.text}
    </Button>
  ));

  return (
    <div className={`sign-in ${cls}`}>
      <form className="sign-in__form">
        <p className="sign-in__wlcm-txt sign-in__wlcm-txt--mn">Welcome</p>
        <p className="sign-in__wlcm-txt">Sign in here</p>
        {formInps}
        <div className="sign-in__btns">
          {formBtns}
          <div className="sign-in__soc">{socBtns}</div>
          <div className="sign-in__cir"></div>
        </div>
      </form>
    </div>
  );
};
