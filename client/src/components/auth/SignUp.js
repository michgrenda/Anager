import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import classNames from "classnames";
import PropTypes from "prop-types";
// Redux
import { connect } from "react-redux";
import { setAlert } from "../../actions/alert";
import { signUp } from "../../actions/auth";
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
    type: "text",
    placeholder: "Name",
    name: "name",
  },
  {
    type: "text",
    placeholder: "Surname",
    name: "surname",
  },
  {
    type: "email",
    placeholder: "E-mail address",
    name: "email",
  },
  {
    type: "password",
    placeholder: "Password",
    name: "password",
    minLength: "7",
  },
  {
    type: "password",
    placeholder: "Confirm password",
    name: "password2",
    minLength: "7",
  },
];

const formBtnsProps = [
  {
    icon: "fas fa-user-plus",
    text: "sign up",
    type: "submit",
  },
];

const SignUp = (props) => {
  // Redux
  const { setAlert, signUp, fromAlerts } = props;

  // Router
  let history = useHistory();

  // States
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    password2: "",
  });

  const { name, surname, email, password, password2 } = formData;
  // Manage received modifiers
  const { categories } = props;

  const catgs = {};
  if (categories)
    categories.forEach((catg) => (catgs[`sign-up--${catg}`] = catg));

  const modifiers = classNames({
    ...catgs,
  });

  // Remove placeholder when input is focused
  const handleInputFocus = (e) => {
    const placeholder = e.target.nextSibling;
    if (e.target.value === "")
      placeholder.classList.add("sign-up__placeholder--is-active");
  };

  // Restore placeholder when input is blurred
  const handleInputBlur = (e) => {
    const placeholder = e.target.nextSibling;
    if (e.target.value === "")
      placeholder.classList.remove("sign-up__placeholder--is-active");
  };

  // Control form input
  const handleInputChange = (e) => {
    e.persist();
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Create user
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2)
      setAlert(
        "Passwords do not match",
        "danger",
        "fas fa-exclamation-circle",
        "sign-up"
      );
    else
      signUp({ name, surname, email, password })
        .then(() => history.push("/dashboard"))
        .catch((error) => console.log(error));
  };

  // Variables
  const formInputs = formInputsProps.map((prop, index) => (
    <div className="sign-up__input-wrapper" key={prop.placeholder}>
      <input
        className="sign-up__input"
        type={prop.type}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onChange={handleInputChange}
        autoFocus={!index}
        name={prop.name}
        value={formData[prop.name]}
        minLength={prop.minLength}
        required
      />
      <span
        className="sign-up__placeholder"
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

  const socialBtns = (
    <div className="sign-up__social">
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

  return (
    <section className={`sign-up ${modifiers} col-12 col-lg-8 offset-lg-2`}>
      {fromAlerts === "sign-up" ? <Alert /> : null}
      <form className="sign-up__form" onSubmit={handleFormSubmit}>
        <header className="sign-up__header">
          <h2 className="sign-up__welcome-text sign-up__welcome-text--main">
            Welcome
          </h2>
          <h2 className="sign-up__welcome-text">Sign up here</h2>
        </header>
        {formInputs}
        <div className="sign-up__btns">
          {formBtns}
          {socialBtns}
        </div>
      </form>
    </section>
  );
};

SignUp.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string),
  // Redux
  setAlert: PropTypes.func.isRequired,
  signUp: PropTypes.func.isRequired,
  fromAlerts: PropTypes.string,
};

const mapStateToProps = (state) => ({
  fromAlerts: state.alert.from,
});

export default connect(mapStateToProps, { setAlert, signUp })(SignUp);
