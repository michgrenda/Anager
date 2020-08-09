import React from "react";
import { Button } from "../Button";

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
    placeholder: "Name",
  },
  {
    type: "text",
    placeholder: "Surname",
  },
  {
    type: "text",
    placeholder: "E-mail adrress",
  },
  {
    type: "password",
    placeholder: "Password",
  },
  {
    type: "password",
    placeholder: "Confirm password",
  },
];

const formBtnsProps = [
  {
    icon: "fas fa-user-plus",
    text: "sign up",
  },
];

export const SignUp = () => {
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
    <div className="sign-up__inp-wrap" key={formInpProp.placeholder}>
      <input
        className="sign-up__inp"
        type={formInpProp.type}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <span
        className="sign-up__plhlr"
        data-placeholder={formInpProp.placeholder}
      ></span>
    </div>
  ));

  const formBtns = formBtnsProps.map((formBtnsProp) => (
    <Button
      categories={["sign-up"]}
      icon={formBtnsProp.icon}
      key={formBtnsProp.text}
    >
      {formBtnsProp.text}
    </Button>
  ));

  const socBtns = socBtnsProps.map((socBtnProp) => (
    <Button
      categories={["sign-up", "soc-su"]}
      icon={socBtnProp.icon}
      key={socBtnProp.icon}
    ></Button>
  ));

  return (
    <div className="sign-up">
      <form className="sign-up__form">
        <div className="sign-up__cir"></div>
        <p className="sign-up__wlcm-txt sign-up__wlcm-txt--mn">Welcome</p>
        <p className="sign-up__wlcm-txt">Sign up here</p>
        {formInps}
        <div className="sign-up__btns">{formBtns}</div>
        <div className="sign-up__soc">{socBtns}</div>
      </form>
    </div>
  );
};
