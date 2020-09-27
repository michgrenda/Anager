import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import classNames from "classnames";
import PropTypes from "prop-types";
// Redux
import { signIn } from "../../actions/auth";
import { connect } from "react-redux";
// Components
import Button from "../Button";
import Alert from "../layouts/Alert";

// Settings
const socialBtnsProps = [
  {
    icon: "fab fa-google",
  },
  {
    icon: "fab fa-facebook-f",
  },
];

const formInputsProps = [
  {
    type: "email",
    placeholder: "E-mail address",
    name: "email",
  },
  {
    type: "password",
    placeholder: "Password",
    name: "password",
  },
];

const formBtnsProps = [
  {
    icon: "fas fa-lock",
    text: "sign in",
    type: "submit",
  },
  {
    icon: "fas fa-unlock",
    text: "forgot password?",
  },
];

const SignIn = (props) => {
  // Redux
  const { signIn, fromAlerts } = props;

  // Router
  let history = useHistory();

  // States
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  // Manage received modifiers
  const { categories } = props;

  const catgs = {};
  if (categories)
    categories.forEach((catg) => (catgs[`sign-in--${catg}`] = catg));

  const modifiers = classNames({
    ...catgs,
  });

  // Remove placeholder when input is focused
  const handleInputFocus = (e) => {
    const placeholder = e.target.nextSibling;
    if (e.target.value === "")
      placeholder.classList.add("sign-in__placeholder--is-active");
  };

  // Restore placeholder when input is blurred
  const handleInputBlur = (e) => {
    const placeholder = e.target.nextSibling;
    if (e.target.value === "")
      placeholder.classList.remove("sign-in__placeholder--is-active");
  };

  // Control form input
  const handleInputChange = (e) => {
    e.persist();
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Authenticate user
  const handleFormSubmit = (e) => {
    e.preventDefault();
    signIn({ email, password })
      .then(() => history.push("/dashboard"))
      .catch((error) => console.log(error));
  };

  // Variables
  const formInputs = formInputsProps.map((prop, index) => (
    <div className="sign-in__input-wrapper" key={prop.placeholder}>
      <input
        className="sign-in__input"
        type={prop.type}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onChange={handleInputChange}
        autoFocus={!index}
        name={prop.name}
        value={formData[prop.name]}
        required
      />
      <span
        className="sign-in__placeholder"
        data-placeholder={prop.placeholder}
      ></span>
    </div>
  ));

  let socialBtnModifiers = null;
  let formBtnModifiers = null;

  if (window.matchMedia("(max-width: 991px)").matches) {
    socialBtnModifiers = ["auth", "auth-social"];
    formBtnModifiers = ["auth"];
  } else {
    socialBtnModifiers = [
      "auth",
      "auth-social",
      "nav-auth-social",
      "default-light",
    ];
    formBtnModifiers = ["auth", "nav-auth"];
  }

  const socialBtns = (
    <div className="sign-in__social">
      {socialBtnsProps.map((prop) => (
        <Button
          categories={socialBtnModifiers}
          icon={prop.icon}
          type={prop.type}
          light
          key={prop.icon}
        ></Button>
      ))}
    </div>
  );

  const formBtns = formBtnsProps.map((prop) => (
    <Button
      categories={formBtnModifiers}
      icon={prop.icon}
      type={prop.type}
      light
      key={prop.text}
    >
      {prop.text}
    </Button>
  ));

  return (
    <section className={`sign-in ${modifiers} col-12 col-lg-8 offset-lg-2`}>
      {fromAlerts === "sign-in" ? <Alert /> : null}
      <form className="sign-in__form" onSubmit={handleFormSubmit}>
        <header className="sign-in__header">
          <h2 className="sign-in__welcome-text sign-in__welcome-text--main">
            Welcome
          </h2>
          <h2 className="sign-in__welcome-text">Sign in here</h2>
        </header>
        {formInputs}
        <div className="sign-in__btns">
          {formBtns}
          {socialBtns}
        </div>
      </form>
    </section>
  );
};

SignIn.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string),
  // Redux
  signIn: PropTypes.func.isRequired,
  fromAlerts: PropTypes.string,
};

const mapStateToProps = (state) => ({
  fromAlerts: state.alert.from,
});

export default connect(mapStateToProps, { signIn })(SignIn);
