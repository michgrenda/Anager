import React, {
  useState,
  useRef,
  // useEffect
} from "react";
import PropTypes from "prop-types";
// Components
import Button from "../Button";
import DateInput from "../DateInput";
import SelectInput from "../SelectInput";
import AnimatedModal from "../modal/AnimatedModal";

const initialState = {
  name: "",
  description: "",
  offset: new Date().getTimezoneOffset(),
  deadline: undefined,
  priority: undefined,
  status: undefined,
};

const ProjectModalAddForm = function (props) {
  // States
  const [formData, setFormData] = useState(initialState);

  const { name, description, deadline, priority, status, offset } = formData;

  // References
  const datePlaceholder = useRef(null);

  // Set initial state when closing
  // useEffect(() => {
  //   if (!props.visible) setFormData(initialState);
  // }, [props.visible]);

  const setInitialStateWhenClosing = () => setFormData(initialState);

  // Remove placeholder when input is focused
  const handleInputFocus = (e) => {
    const placeholder = e.target.nextSibling;
    if (e.target.value === "")
      placeholder.classList.add("project-add-form__placeholder--is-active");
  };

  // Restore placeholder when input is blurred
  const handleInputBlur = (e) => {
    const placeholder = e.target.nextSibling;
    if (e.target.value === "")
      placeholder.classList.remove("project-add-form__placeholder--is-active");
  };

  // Control form input
  const handleInputChange = (e) => {
    e.persist();
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Remove placeholder when input is focused
  const handleDateFocus = (e) => {
    if (e.target.value === "")
      datePlaceholder.current.classList.add(
        "project-add-form__placeholder--is-active"
      );
  };

  // Restore placeholder when input is blurred
  const handleDateBlur = (e) => {
    if (e.target.value === "")
      datePlaceholder.current.classList.remove(
        "project-add-form__placeholder--is-active"
      );
  };

  // Control form input
  const handleDateChange = (deadline) =>
    setFormData((prevState) => ({ ...prevState, deadline }));

  // Remove placeholder when clicking outside
  const handleDateClickOutside = () =>
    datePlaceholder.current.classList.remove(
      "project-add-form__placeholder--is-active"
    );

  // Control form input
  const setSelectedData = (key, value) =>
    setFormData((prevState) => ({ ...prevState, [key]: value }));

  // Create project
  const handleFormSubmit = (e) => {
    e.preventDefault();
    props
      .addProject({
        name,
        description,
        deadline,
        priority,
        status,
        offset,
      })
      .then(() => {
        setFormData(initialState);

        closeProjectAddForm();
      })
      .catch((error) => console.log(error));
  };

  // Close project add form
  const closeProjectAddForm = () =>
    props.onClose((prevState) => ({ ...prevState, [props.indicator]: false }));

  return (
    <AnimatedModal
      visible={props.visible}
      onClose={closeProjectAddForm}
      onAnimationEnd={setInitialStateWhenClosing}
    >
      <div className="container">
        <div className="row">
          <form className="project-add-form col-12" onSubmit={handleFormSubmit}>
            <div className="row">
              <header className="project-add-form__header col-12">
                <h2 className="project-add-form__welcome-text project-add-form__welcome-text--main">
                  Welcome
                </h2>
                <h2 className="project-add-form__welcome-text">
                  Create project here
                </h2>
              </header>
              <div className="project-add-form__input-wrapper col-12">
                <input
                  className="project-add-form__input"
                  type="text"
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  onChange={handleInputChange}
                  name="name"
                  value={formData["name"]}
                  required
                />
                <span
                  className="project-add-form__placeholder"
                  data-placeholder="Name"
                ></span>
              </div>
              <div className="project-add-form__input-wrapper col-12">
                <textarea
                  className="project-add-form__input project-add-form__input--text-area"
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  onChange={handleInputChange}
                  name="description"
                  value={formData["description"]}
                  rows={5}
                  maxLength={125}
                ></textarea>
                <span
                  className="project-add-form__placeholder project-add-form__placeholder--text-area"
                  data-placeholder="Description"
                ></span>
              </div>
              <div className="project-add-form__input-wrapper col-12">
                <DateInput
                  className="project-add-form__input project-add-form__input--date"
                  onFocus={handleDateFocus}
                  onBlur={handleDateBlur}
                  onChange={handleDateChange}
                  clickOutside={handleDateClickOutside}
                />
                <span
                  className="project-add-form__placeholder project-add-form__placeholder-icon project-add-form__placeholder--date"
                  data-placeholder="Date"
                  ref={datePlaceholder}
                ></span>
              </div>
              <div className="project-add-form__select-input-wrapper col-12 col-sm-6">
                <SelectInput
                  categories={["project-modal-add"]}
                  title="select priority"
                  listProps={props.priorityProps}
                  setData={setSelectedData}
                  uniqueIdOnClickOutside="priority"
                  ignoreReactOnClickOutside={`header-priority-ignore`}
                  ripples={false}
                />
              </div>
              <div className="project-add-form__select-input-wrapper col-12 col-sm-6">
                <SelectInput
                  categories={["project-modal-add"]}
                  title="select status"
                  listProps={props.statusProps}
                  setData={setSelectedData}
                  uniqueIdOnClickOutside="status"
                  ignoreReactOnClickOutside={`header-status-ignore`}
                  ripples={false}
                />
              </div>
              <div className="project-add-form__btn-wrapper col-12">
                <Button categories={["projects-create"]} type="submit" light>
                  create project
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AnimatedModal>
  );
};

ProjectModalAddForm.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  priorityProps: PropTypes.arrayOf(PropTypes.object).isRequired,
  statusProps: PropTypes.arrayOf(PropTypes.object).isRequired,
  indicator: PropTypes.string.isRequired,
  addProject: PropTypes.func.isRequired,
};

export default ProjectModalAddForm;
