import React, {
  useState,
  // useEffect
} from "react";
import PropTypes from "prop-types";
import DatePicker, { CalendarContainer } from "react-datepicker";
// Components
import Button from "../Button";
import SelectInput from "../SelectInput";
import AnimatedModal from "../modal/AnimatedModal";
// import Portal from "../Portal"

const ProjectDetailView = (props) => {
  const initialState = {
    name: props.project.name,
    description: props.project.description,
    offset: new Date().getTimezoneOffset(),
    deadline: props.project.deadline ? new Date(props.project.deadline) : null,
    priority: props.project.priority,
    status: props.project.status,
  };

  // States
  const [formData, setFormData] = useState(initialState);

  const { name, description, deadline, priority, status, offset } = formData;

  const setInitialStateWhenClosing = () => setFormData(initialState);

  // Remove placeholder when input is focused
  const handleInputFocus = (e) => {
    const placeholder = e.target.nextSibling;
    if (e.target.value === "")
      placeholder.classList.add("project-detail-view__placeholder--is-active");
  };

  // Restore placeholder when input is blurred
  const handleInputBlur = (e) => {
    const placeholder = e.target.nextSibling;
    if (e.target.value === "")
      placeholder.classList.remove(
        "project-detail-view__placeholder--is-active"
      );
  };

  // Control form input
  const handleInputChange = (e) => {
    e.persist();
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Control form input
  const handleDateChange = (deadline) =>
    setFormData((prevState) => ({ ...prevState, deadline }));

  // Control form input
  const setSelectedData = (key, value) =>
    setFormData((prevState) => ({ ...prevState, [key]: value }));

  // Update project
  const handleFormSubmit = (e) => {
    e.preventDefault();
    props
      .updateProject(
        {
          name,
          description,
          deadline,
          priority,
          status,
          offset,
        },
        props.project._id
      )
      .then(() => closeProjectDetailView())
      .catch((error) => console.log(error));
  };

  // Close project detail view
  const closeProjectDetailView = () =>
    props.onClose((prevState) => ({
      ...prevState,
      [props.project._id]: false,
    }));

  // Variables
  const MyContainer = ({ className, children }) => {
    return (
      <div className="project-detail-view__calendar-wrapper">
        <CalendarContainer className={className}>
          <div style={{ position: "relative" }}>{children}</div>
        </CalendarContainer>
      </div>
    );
  };

  return (
    <AnimatedModal
      visible={props.visible}
      onClose={closeProjectDetailView}
      onAnimationEnd={setInitialStateWhenClosing}
      modalClassName="project-detail-view__modal"
    >
      {/* <Portal className="projects__project-detail-view" container={props.container}> */}
      <div className="container">
        <div className="row">
          <form
            className="project-detail-view col-12"
            onSubmit={handleFormSubmit}
          >
            <div className="row">
              <header className="project-detail-view__header col-12">
                <h2 className="project-detail-view__welcome-text project-detail-view__welcome-text--main">
                  {props.project.name}
                </h2>
                <h2 className="project-detail-view__welcome-text">
                  {props.project.description}
                </h2>
              </header>
              <div className="project-detail-view__input-wrapper col-12">
                <input
                  className="project-detail-view__input"
                  type="text"
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  onChange={handleInputChange}
                  name="name"
                  value={formData["name"]}
                  required
                />
                <span
                  className="project-detail-view__placeholder"
                  data-placeholder="Name"
                  style={{ opacity: formData.name ? 0 : 1 }}
                ></span>
              </div>
              <div className="project-detail-view__input-wrapper col-12">
                <textarea
                  className="project-detail-view__input project-detail-view__input--text-area"
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  onChange={handleInputChange}
                  name="description"
                  value={formData["description"]}
                  rows={5}
                  maxLength={125}
                ></textarea>
                <span
                  className="project-detail-view__placeholder project-detail-view__placeholder--text-area"
                  data-placeholder="Description"
                  style={{ opacity: formData.description ? 0 : 1 }}
                ></span>
              </div>
              <div className="project-detail-view__input-wrapper col-12">
                <DatePicker
                  selected={formData.deadline}
                  onChange={handleDateChange}
                  calendarClassName="project-detail-view__calendar"
                  inline
                  calendarContainer={MyContainer}
                />
              </div>
              <div className="project-detail-view__select-input-wrapper col-12 col-sm-6">
                <SelectInput
                  categories={["project-modal-add"]}
                  title={formData.priority}
                  listProps={props.priorityProps}
                  setData={setSelectedData}
                  uniqueIdOnClickOutside="priority"
                  ignoreReactOnClickOutside={`header-priority-detail-ignore`}
                />
              </div>
              <div className="project-detail-view__select-input-wrapper col-12 col-sm-6">
                <SelectInput
                  categories={["project-modal-add"]}
                  title={formData.status}
                  listProps={props.statusProps}
                  setData={setSelectedData}
                  uniqueIdOnClickOutside="status"
                  ignoreReactOnClickOutside={`header-status-detail-ignore`}
                />
              </div>
              <div className="project-detail-view__btn-wrapper col-12">
                <Button categories={["projects-create"]} type="submit" light>
                  Save
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* </Portal> */}
    </AnimatedModal>
  );
};

ProjectDetailView.propTypes = {
  container: PropTypes.object,
  visible: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  priorityProps: PropTypes.arrayOf(PropTypes.object).isRequired,
  statusProps: PropTypes.arrayOf(PropTypes.object).isRequired,
  indicator: PropTypes.string.isRequired,
  updateProject: PropTypes.func.isRequired,
};

export default ProjectDetailView;
