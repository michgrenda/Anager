import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
// Redux
import { connect } from "react-redux";
import { addSection } from "../../actions/sections";
// Components
import Button from "../Button";
import AnimatedModal from "../modal/AnimatedModal";

const initialState = {
  name: "",
};

const SectionModalAddForm = function (props) {
  // Redux
  const { addSection } = props;

  // States
  const [formData, setFormData] = useState(initialState);

  const { name } = formData;

  // Set initial state when closing
  useEffect(() => {
    if (!props.visible) setFormData(initialState);
  }, [props.visible]);

  // Remove placeholder when input is focused
  const handleInputFocus = (e) => {
    const placeholder = e.target.nextSibling;
    if (e.target.value === "")
      placeholder.classList.add("section-add-form__placeholder--is-active");
  };

  // Restore placeholder when input is blurred
  const handleInputBlur = (e) => {
    const placeholder = e.target.nextSibling;
    if (e.target.value === "")
      placeholder.classList.remove("section-add-form__placeholder--is-active");
  };

  // Control form input
  const handleInputChange = (e) => {
    e.persist();
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Create section
  const handleFormSubmit = (e) => {
    e.preventDefault();
    addSection({
      name,
    })
      .then(() => {
        setFormData(initialState);

        closeSectionAddForm();
      })
      .catch((error) => console.log(error));
  };

  // Close section add form
  const closeSectionAddForm = () =>
    props.onClose((prevState) => ({ ...prevState, [props.indicator]: false }));

  return (
    <AnimatedModal visible={props.visible} onClose={closeSectionAddForm}>
      <form className="section-add-form" onSubmit={handleFormSubmit}>
        <header className="section-add-form__header">
          <h2 className="section-add-form__welcome-text section-add-form__welcome-text--main">
            Welcome
          </h2>
          <h2 className="section-add-form__welcome-text">
            Create section here
          </h2>
        </header>
        <div className="section-add-form__input-wrapper">
          <input
            className="section-add-form__input"
            type="text"
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onChange={handleInputChange}
            name="name"
            value={formData["name"]}
            required
          />
          <span
            className="section-add-form__placeholder"
            data-placeholder="Name"
          ></span>
        </div>
        <Button
          categories={["projects-create", "default-light"]}
          type="submit"
          light
        >
          create section
        </Button>
      </form>
    </AnimatedModal>
  );
};

SectionModalAddForm.defaultProps = {
  transitionDuration: 400,
};

SectionModalAddForm.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  transitionDuration: PropTypes.number,
  indicator: PropTypes.string.isRequired,
  // Redux
  addSection: PropTypes.func.isRequired,
};

export default connect(null, { addSection })(SectionModalAddForm);
