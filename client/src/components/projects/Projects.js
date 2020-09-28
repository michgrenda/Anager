import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import moment from "moment";
import Moment from "react-moment";
import _ from "loadsh";
import ReactTooltip from "react-tooltip";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { CSSTransition } from "react-transition-group";
import Ripple from "@intereact/ripple";
// Redux
import { connect } from "react-redux";
import {
  getSections,
  addSection,
  updateSection,
  deleteSection,
} from "../../actions/sections";
import {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
} from "../../actions/projects";
// Dnd
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// Components
import Button from "../Button";
import ProjectModalAddForm from "./ProjectModalAddForm";
import SectionModalAddForm from "./SectionModalAddForm";
import SelectInput from "../SelectInput";
import SectionInlineAdd from "./SectionInlineAdd";
import SectionInlineEditForm from "./SectionInlineEditForm";
import DeleteConfirmation from "./DeleteConfirmation";
import ProjectInlineEditForm from "./ProjectInlineEditForm";
import ProjectMenu from "./ProjectMenu";

// Portal
const draggableRoot = document.getElementById("draggable-root");

const touch = matchMedia("(hover: none) and (pointer: coarse)").matches;
console.log(touch);
// Settings
const addProps = [
  {
    title: "add project",
    key: "add",
  },
  {
    title: "add section",
    key: "add",
  },
];

const priorityProps = [
  {
    title: "low",
    key: "priority",
  },
  {
    title: "medium",
    key: "priority",
  },
  {
    title: "high",
    key: "priority",
  },
];

const statusProps = [
  {
    title: "proposed",
    key: "status",
  },
  {
    title: "active",
    key: "status",
  },
  {
    title: "on hold",
    key: "status",
  },
  {
    title: "completed",
    key: "status",
  },
  {
    title: "canceled",
    key: "status",
  },
  {
    title: "archived",
    key: "status",
  },
];

const Projects = (props) => {
  // Redux
  const {
    getSections,
    addSection,
    updateSection,
    deleteSection,
    sections: {
      sections,
      section,
      // In the future
      // deletedSection,
      loading: loadingSections,
    },
    getProjects,
    addProject,
    updateProject,
    deleteProject,
    projects: { projects, project, loading: loadingProjects },
  } = props;

  // States
  const [search, setSearch] = useState("");

  const [sectionsAndProjects, setSectionsAndProjects] = useState({
    sections: [],
  });

  const [sectionInlineEditOpen, setSectionInlineEditOpen] = useState({});
  const [sectionNameHidden, setSectionNameHidden] = useState({});
  const [deleteSectionOpen, setDeleteSectionOpen] = useState({});

  const [projectInlineEditOpen, setProjectInlineEditOpen] = useState({});
  const [projectNameHidden, setProjectNameHidden] = useState({});

  const [modalOpen, setModalOpen] = useState({});
  const [whichModal, setWhichModal] = useState("project");

  // References
  const deleteSectionBtns = useRef({});
  const editSectionBtns = useRef({});
  const editProjectBtns = useRef({});

  // Manage fetched data
  useEffect(() => {
    if (!loadingSections && !loadingProjects) {
      const storageData = JSON.parse(
        window.localStorage.getItem("sectionsAndProjects")
      );

      const fetchedData = [];

      fetchedData.push({
        name: "No section",
        _id: "noSection",
      });

      fetchedData.push(...sections);

      // Add projects property to section
      fetchedData.forEach((section) => {
        if (section._id !== "noSection") {
          section.projects = projects.filter(
            (project) => project.section === section._id
          );
        } else {
          section.projects = projects.filter(
            (project) => !project.hasOwnProperty("section")
          );
        }
      });

      let sortedSecionsAndProjects = fetchedData;
      if (storageData) {
        // Reorder fetched data
        const orderedData = storageData;

        const orderOfSections = [];
        const orderOfProjects = {};

        orderedData.forEach((orderedSection) => {
          orderOfSections.push(orderedSection._id);

          const orderSectionsProjects = [];

          orderedSection.projects.forEach((orderedProject) => {
            orderSectionsProjects.push(orderedProject._id);
          });

          orderOfProjects[orderedSection._id] = orderSectionsProjects;
        });

        sortedSecionsAndProjects = _.sortBy(fetchedData, function (section) {
          const sortedProjects = _.sortBy(section.projects, function (project) {
            const index = _.indexOf(orderOfProjects[section._id], project._id);
            return index === -1 ? section.projects.length : index;
          });

          section.projects = sortedProjects;
          const index = _.indexOf(orderOfSections, section._id);
          return index === -1 ? fetchedData.length : index;
        });
      }

      setSectionsAndProjects({ sections: sortedSecionsAndProjects });
    }
  }, [sections, projects, loadingProjects, loadingSections]);

  // Load sections & projects ***
  useEffect(() => {
    getSections();
    getProjects();
  }, [getSections, getProjects]);

  useEffect(() => {
    if (project) getProjects();
  }, [project, getProjects]);

  useEffect(() => {
    if (section) getSections();
  }, [section, getSections]);

  // In the future
  // useEffect(() => {
  //   if (deletedSection) getProjects();
  // }, [deletedSection, getProjects]);
  // End ***

  // Set add option
  const setSelectedAddOption = (key, title) => {
    if (key === "add") {
      if (title === "add section") setWhichModal("section");
      else if (title === "add project") setWhichModal("project");
    }
  };

  // Remove placeholder when input is focused
  const handleSearchFocus = (e) => {
    const placeholder = e.target.nextSibling;
    if (e.target.value === "")
      placeholder.classList.add("projects__placeholder--is-active");
  };

  // Restore placeholder when input is blurred
  const handleSearchBlur = (e) => {
    const placeholder = e.target.nextSibling;
    if (e.target.value === "")
      placeholder.classList.remove("projects__placeholder--is-active");
  };

  // Control form input
  const handleSearchChange = (e) => setSearch(e.target.value);

  // Update status or priority
  const updateSelectableData = (projectId, key, value) => {
    updateProject({ [key]: value }, projectId).catch((error) =>
      console.log(error)
    );
  };

  // Remove class after a few seconds
  const removeClassTime = (el, className) => el.classList.remove(className);

  // Open modal
  const handleMainButtonClick = (e) => {
    e.currentTarget.classList.add("button--projects-main-is-active");
    setTimeout(
      removeClassTime.bind(
        null,
        e.currentTarget,
        "button--projects-main-is-active"
      ),
      1000
    );

    setModalOpen((prevState) => ({ ...prevState, [whichModal]: true }));
  };

  // Open section inline edit using keyboard (enter)
  // Close section inline edit using keyboard (escape)
  const handleSectionInlineEditKeyDown = (sectionId, e) => {
    switch (e.which) {
      case 13:
        handleSectionInlineEditClick(sectionId, e);
        break;
      case 27:
        if (sectionInlineEditOpen[sectionId]) {
          e.stopPropagation();
          e.preventDefault();

          setSectionInlineEditOpen((prevState) => ({
            ...prevState,
            [sectionId]: false,
          }));
        }
        break;
      default:
        break;
    }
  };

  // Toggle section inline edit
  const handleSectionInlineEditClick = (sectionId, e) => {
    e.stopPropagation();
    e.preventDefault();

    setSectionInlineEditOpen((prevState) => ({
      ...prevState,
      [sectionId]: !prevState[sectionId],
    }));
    setSectionNameHidden((prevState) => ({
      ...prevState,
      [sectionId]: true,
    }));
  };

  const restoreSectionName = (sectionId) =>
    setSectionNameHidden((prevState) => ({ ...prevState, [sectionId]: false }));

  // Toggle delete section using keyboard (enter)
  // Close delete section using keyboard (escape)
  const handleDeleteSectionKeyDown = (sectionId, e) => {
    switch (e.which) {
      case 13:
        handleDeleteSectionClick(sectionId, e);
        break;
      case 27:
        if (deleteSectionOpen[sectionId]) {
          e.stopPropagation();
          e.preventDefault();

          setDeleteSectionOpen((prevState) => ({
            ...prevState,
            [sectionId]: false,
          }));
        }
        break;
      default:
        break;
    }
  };

  // Toggle delete section
  const handleDeleteSectionClick = (sectionId, e) => {
    e.stopPropagation();
    e.preventDefault();

    setDeleteSectionOpen((prevState) => ({
      ...prevState,
      [sectionId]: !prevState[sectionId],
    }));
  };

  // Toggle project inline edit using keyboard (enter)
  // Close project inline edit using keyboard (escape)
  const handleProjectInlineEditKeyDown = (projectId, e) => {
    switch (e.which) {
      case 13:
        handleProjectInlineEditClick(projectId, e);
        break;
      case 27:
        if (projectInlineEditOpen[projectId]) {
          e.stopPropagation();
          e.preventDefault();

          setProjectInlineEditOpen((prevState) => ({
            ...prevState,
            [projectId]: false,
          }));
        }
        break;
      default:
        break;
    }
  };

  // Toggle project inline edit
  const handleProjectInlineEditClick = (projectId, e) => {
    e.stopPropagation();
    e.preventDefault();

    setProjectInlineEditOpen((prevState) => ({
      ...prevState,
      [projectId]: !prevState[projectId],
    }));
    setProjectNameHidden((prevState) => ({
      ...prevState,
      [projectId]: true,
    }));
  };

  const restoreProjectName = (projectId) =>
    setProjectNameHidden((prevState) => ({ ...prevState, [projectId]: false }));

  const preventLinkDefaultBehaviour = (projectId, e) =>
    projectNameHidden[projectId] && e.preventDefault();

  // Get item's style while dragging
  const getItemStyle = (isDragging, draggableStyle) => ({
    backgroundColor: isDragging && "#ecf0f3",
    borderRadius: isDragging && "10px",
    boxShadow: isDragging && "0 1px 3px rgba(151, 167, 195, 0.5)",

    ...draggableStyle,
  });

  const getListStyle = (isDraggingOver) => ({
    pointerEvents: isDraggingOver && "none",
  });

  // Create results list
  const createResultsList = (elements) => {
    return elements.map((project) => (
      <div className="projects__grid-project" key={project._id}>
        <div className="projects__project-col">
          <Ripple>
            {(ripples) => (
              <Link
                to={`${props.match.url}/${project._id}`}
                className={`projects__project-name projects__project-name--result ${
                  projectInlineEditOpen[project._id] &&
                  "projects__project-name--is-edited"
                }`}
                // Prevent dragging
                draggable={false}
                onDragStart={() => false}
                onClick={preventLinkDefaultBehaviour.bind(null, project._id)}
              >
                {console.log(props.match)}
                <i className="projects__project-icon far fa-check-circle"></i>
                {!projectNameHidden[project._id] && (
                  <span className="projects__project-text">{project.name}</span>
                )}
                {ripples}
                <ProjectInlineEditForm
                  eventTypes={["mousedown", "touchstart", "keydown"]}
                  projectId={project._id}
                  projectName={project.name}
                  onClose={setProjectInlineEditOpen}
                  visible={projectInlineEditOpen[project._id]}
                  onExited={restoreProjectName.bind(null, project._id)}
                  outsideClickIgnoreClass={`edit-project-ignore-${project._id}`}
                  triggeringElement={editProjectBtns}
                  updateProject={updateProject}
                />

                <div className="projects__project-options">
                  <div className="projects__option-wrapper">
                    <div
                      className={`projects__project-option edit-project-ignore-${project._id}`}
                      onClick={handleProjectInlineEditClick.bind(
                        null,
                        project._id
                      )}
                      onKeyDown={handleProjectInlineEditKeyDown.bind(
                        null,
                        project._id
                      )}
                      tabIndex={0}
                      ref={(el) => (editProjectBtns.current[project._id] = el)}
                    >
                      <i className="projects__project-icon projects__project-icon--edit far fa-edit"></i>
                    </div>
                  </div>
                </div>
              </Link>
            )}
          </Ripple>
        </div>
        <div
          className="projects__project-col projects__project-col--date d-none d-md-flex"
          data-tip={moment(project.deadline).format("D MMM YYYY")}
          data-for="date"
          data-tip-disable={!project.deadline}
          data-background-color="#696969"
          data-text-color="#ecf0f3"
        >
          <span
            className="projects__project-due-date"
            tabIndex={project.deadline ? 0 : -1}
          >
            {project.deadline ? (
              <Moment format="D MMM">{project.deadline}</Moment>
            ) : (
              "n.d."
            )}
          </span>
        </div>
        <ReactTooltip id="date" />
        <div className="projects__project-col projects__project-col--options d-none d-sm-flex">
          <SelectInput
            categories={["project"]}
            title={project.priority}
            listProps={priorityProps}
            setData={updateSelectableData.bind(null, project._id)}
            uniqueIdOnClickOutside={`priority-${project._id}`}
            transitionClassNamesList="select-input__list--project"
            ignoreReactOnClickOutside={`header-priority-ignore-${project._id}`}
          />
        </div>
        <div className="projects__project-col projects__project-col--options d-none d-sm-flex">
          <SelectInput
            categories={["project"]}
            title={project.status}
            listProps={statusProps}
            setData={updateSelectableData.bind(null, project._id)}
            uniqueIdOnClickOutside={`status-${project._id}`}
            transitionClassNamesList="select-input__list--project"
            ignoreReactOnClickOutside={`header-status-ignore-${project._id}`}
          />
        </div>
        <div className="projects__project-col projects__project-col--ellipsis projects__project-col--options">
          <ProjectMenu
            projectId={project._id}
            ignoreReactOnClickOutside={`project-menu-ignore-${project._id}`}
            deleteFunction={() => deleteProject(project._id)}
          />
        </div>
      </div>
    ));
  };

  // Create list of projects
  const createProjectsList = (elements) => {
    return elements.map((project, index) => (
      <Draggable draggableId={project._id} index={index} key={project._id}>
        {(provided, snapshot) =>
          optionalPortal(
            provided.draggableProps.style,
            <div
              className={`projects__grid-project ${
                snapshot.isDragging && "projects__grid-project--is-dragging"
              }`}
              {...provided.draggableProps}
              style={getItemStyle(
                snapshot.isDragging,
                provided.draggableProps.style
              )}
              ref={provided.innerRef}
            >
              <div className="projects__project-col">
                <Ripple>
                  {(ripples) => (
                    <Link
                      to={`${props.match.url}/${project._id}`}
                      className={`projects__project-name ${
                        projectInlineEditOpen[project._id] &&
                        "projects__project-name--is-edited"
                      }`}
                      // Prevent dragging
                      draggable={false}
                      onDragStart={() => false}
                      onClick={preventLinkDefaultBehaviour.bind(
                        null,
                        project._id
                      )}
                      style={{ position: "relative" }}
                      {...(touch && provided.dragHandleProps)}
                    >
                      <i
                        className="projects__project-icon projects__project-icon--grip fas fa-grip-vertical"
                        {...(!touch && provided.dragHandleProps)}
                        // style={{ visibility: touch && "hidden" }}
                      ></i>
                      <i className="projects__project-icon far fa-check-circle"></i>
                      {!projectNameHidden[project._id] && (
                        <span className="projects__project-text">
                          {project.name}
                        </span>
                      )}
                      {ripples}
                      <ProjectInlineEditForm
                        eventTypes={["mousedown", "touchstart", "keydown"]}
                        projectId={project._id}
                        projectName={project.name}
                        onClose={setProjectInlineEditOpen}
                        visible={projectInlineEditOpen[project._id]}
                        onExited={restoreProjectName.bind(null, project._id)}
                        outsideClickIgnoreClass={`edit-project-ignore-${project._id}`}
                        triggeringElement={editProjectBtns}
                        updateProject={updateProject}
                      />
                      <div className="projects__project-options">
                        <div className="projects__project-option-wrapper">
                          <div
                            className={`projects__project-option edit-project-ignore-${project._id}`}
                            onClick={handleProjectInlineEditClick.bind(
                              null,
                              project._id
                            )}
                            onKeyDown={handleProjectInlineEditKeyDown.bind(
                              null,
                              project._id
                            )}
                            tabIndex={0}
                            ref={(el) =>
                              (editProjectBtns.current[project._id] = el)
                            }
                          >
                            <i className="projects__project-icon projects__project-icon--edit far fa-edit"></i>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )}
                </Ripple>
              </div>
              <div
                className="projects__project-col projects__project-col--date d-none d-md-flex"
                data-tip={moment(project.deadline).format("D MMM YYYY")}
                data-for="date"
                data-tip-disable={!project.deadline}
                data-background-color="#696969"
                data-text-color="#ecf0f3"
                tabIndex={project.deadline ? 0 : -1}
              >
                <span className="projects__project-due-date">
                  {project.deadline ? (
                    <Moment format="D MMM">{project.deadline}</Moment>
                  ) : (
                    "n.d."
                  )}
                </span>
              </div>
              <ReactTooltip id="date" />
              <div className="projects__project-col projects__project-col--options d-none d-sm-flex">
                <SelectInput
                  categories={["project"]}
                  title={project.priority}
                  listProps={priorityProps}
                  setData={updateSelectableData.bind(null, project._id)}
                  uniqueIdOnClickOutside={`priority-${project._id}`}
                  transitionClassNamesList="select-input__list--project"
                  ignoreReactOnClickOutside={`header-priority-ignore-${project._id}`}
                />
              </div>
              <div className="projects__project-col projects__project-col--options d-none d-sm-flex">
                <SelectInput
                  categories={["project"]}
                  title={project.status}
                  listProps={statusProps}
                  setData={updateSelectableData.bind(null, project._id)}
                  uniqueIdOnClickOutside={`status-${project._id}`}
                  transitionClassNamesList="select-input__list--project"
                  ignoreReactOnClickOutside={`header-status-ignore-${project._id}`}
                />
              </div>
              <div className="projects__project-col projects__project-col--ellipsis projects__project-col--options">
                <ProjectMenu
                  projectId={project._id}
                  ignoreReactOnClickOutside={`project-menu-ignore-${project._id}`}
                  deleteFunction={() => deleteProject(project._id)}
                />
              </div>
            </div>
          )
        }
      </Draggable>
    ));
  };

  // Reorder sections & projects after drop
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  // Fix "Warning: position: fixed"
  const optionalPortal = (styles, el) => {
    if (styles.position === "fixed")
      return ReactDOM.createPortal(el, draggableRoot);

    return el;
  };

  // Drag and drop algorithm
  const handleDragEnd = useCallback(
    (result) => {
      if (!result.destination) return;

      if (
        result.destination.droppableId === result.source.droppableId &&
        result.destination.index === result.source.index
      )
        return;

      const sourceIndex = result.source.index;
      const destinationIndex = result.destination.index;

      if (result.type === "droppableItem") {
        const sections = reorder(
          sectionsAndProjects.sections,
          sourceIndex,
          destinationIndex
        );

        window.localStorage.setItem(
          "sectionsAndProjects",
          JSON.stringify(sections)
        );

        setSectionsAndProjects({ sections });
      } else if (result.type === "droppableSubItem") {
        const sectionProjectMap = sectionsAndProjects.sections.reduce(
          (acc, section) => {
            acc[section._id] = section.projects;
            return acc;
          },
          {}
        );

        const sourceParentId = result.source.droppableId;
        const destinationParentId = result.destination.droppableId;

        const sourceSubItems = sectionProjectMap[sourceParentId];
        const destinationSubItems = sectionProjectMap[destinationParentId];

        let newItems = [...sectionsAndProjects.sections];

        // In this case subitems are reordered inside same parent
        if (sourceParentId === destinationParentId) {
          const reorderedSubItems = reorder(
            sourceSubItems,
            sourceIndex,
            destinationIndex
          );

          newItems = newItems.map((item) => {
            if (item._id === sourceParentId) item.projects = reorderedSubItems;

            return item;
          });

          window.localStorage.setItem(
            "sectionsAndProjects",
            JSON.stringify(newItems)
          );
        } else {
          let newSourceSubItems = [...sourceSubItems];
          const [draggedItem] = newSourceSubItems.splice(sourceIndex, 1);

          if (destinationParentId !== "noSection")
            draggedItem.section = destinationParentId;
          else delete draggedItem.section;

          let newDestinationSubItems = [...destinationSubItems];
          newDestinationSubItems.splice(destinationIndex, 0, draggedItem);

          newItems = newItems.map((item) => {
            if (item._id === sourceParentId) item.projects = newSourceSubItems;
            else if (item._id === destinationParentId)
              item.projects = newDestinationSubItems;

            return item;
          });

          window.localStorage.setItem(
            "sectionsAndProjects",
            JSON.stringify(newItems)
          );

          if (destinationParentId !== "noSection") {
            updateProject(
              { section: destinationParentId },
              result.draggableId
            ).catch((error) => console.log(error));
          } else {
            updateProject({ unset: true }, result.draggableId).catch((error) =>
              console.log(error)
            );
          }
        }
      }
    },
    [sectionsAndProjects.sections, updateProject]
  );

  // Variables
  const sectionsList = sections.length ? (
    sectionsAndProjects.sections.map((section, index) => (
      <Draggable draggableId={section._id} index={index} key={section._id}>
        {(provided, snapshot) =>
          optionalPortal(
            provided.draggableProps.style,
            <section
              className={`projects__section ${
                snapshot.isDragging && "projects__section--is-dragging"
              }`}
              {...provided.draggableProps}
              style={getItemStyle(
                snapshot.isDragging,
                provided.draggableProps.style
              )}
              ref={provided.innerRef}
            >
              <header
                className={`projects__section-header ${
                  section.projects.length &&
                  "projects__section-header--border-bottom"
                } ${
                  (sectionInlineEditOpen[section._id] ||
                    deleteSectionOpen[section._id]) &&
                  "projects__section-header--is-edited"
                }`}
                {...(touch && provided.dragHandleProps)}
              >
                <div className="projects__section-information">
                  <i
                    className="projects__section-icon projects__section-icon--grip fas fa-grip-vertical"
                    {...(!touch && provided.dragHandleProps)}
                    // style={{ visibility: touch && "hidden" }}
                  ></i>
                  {!sectionNameHidden[section._id] && (
                    <span className="projects__section-text">
                      {section.name}
                    </span>
                  )}

                  {section._id !== "noSection" && (
                    <>
                      <SectionInlineEditForm
                        eventTypes={["mousedown", "touchstart", "keydown"]}
                        sectionId={section._id}
                        sectionName={section.name}
                        onClose={setSectionInlineEditOpen}
                        visible={sectionInlineEditOpen[section._id]}
                        onExited={restoreSectionName.bind(null, section._id)}
                        outsideClickIgnoreClass={`edit-section-ignore-${section._id}`}
                        triggeringElement={editSectionBtns}
                        updateSection={updateSection}
                      />
                      <div className="projects__section-options">
                        <div className="projects__section-option-wrapper">
                          <div
                            className={`projects__section-option edit-section-ignore-${section._id}`}
                            onClick={handleSectionInlineEditClick.bind(
                              null,
                              section._id
                            )}
                            onKeyDown={handleSectionInlineEditKeyDown.bind(
                              null,
                              section._id
                            )}
                            tabIndex={0}
                            ref={(el) =>
                              (editSectionBtns.current[section._id] = el)
                            }
                          >
                            <i className="projects__section-icon projects__section-icon--edit far fa-edit"></i>
                          </div>
                        </div>
                        <div className="projects__section-option-wrapper">
                          <div
                            className={`projects__section-option delete-ignore-${section._id}`}
                            onClick={handleDeleteSectionClick.bind(
                              null,
                              section._id
                            )}
                            onKeyDown={handleDeleteSectionKeyDown.bind(
                              null,
                              section._id
                            )}
                            tabIndex={0}
                            ref={(el) =>
                              (deleteSectionBtns.current[section._id] = el)
                            }
                          >
                            <i className="projects__section-icon projects__section-icon--delete far fa-trash-alt"></i>
                          </div>
                          <DeleteConfirmation
                            categories={["projects-section"]}
                            eventTypes={["mousedown", "touchstart", "keydown"]}
                            uniqueId={section._id}
                            onClose={setDeleteSectionOpen}
                            visible={deleteSectionOpen[section._id]}
                            outsideClickIgnoreClass={`delete-ignore-${section._id}`}
                            triggeringElement={deleteSectionBtns}
                            elementName="section"
                            information="All projects associated with this section will be permanently deleted."
                            deleteFunction={() =>
                              deleteSection({ cascade: true }, section._id)
                            }
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </header>
              <Droppable droppableId={section._id} type="droppableSubItem">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    {createProjectsList(section.projects)}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </section>
          )
        }
      </Draggable>
    ))
  ) : (
    <section className="projects__section">
      {sectionsAndProjects.sections.map((section) => (
        <Droppable
          droppableId={section._id}
          type="droppableSubItem"
          key={section._id}
        >
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {createProjectsList(section.projects)}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ))}
    </section>
  );

  const makeSkeletonBody = (amount) => {
    const rows = [];
    for (let i = 0; i < amount; ++i) {
      rows.push(
        <React.Fragment key={i}>
          <h2 style={{ fontSize: 32 }}>{<Skeleton />}</h2>
          <div style={{ padding: "5px 30px" }}>{<Skeleton count={5} />}</div>
        </React.Fragment>
      );
    }
    return rows;
  };

  const skeleton = (
    <SkeletonTheme
      color="rgba(173, 191, 204, 0.25)"
      highlightColor="rgba(236, 240, 243, 0.75)"
    >
      <div style={{ fontSize: 20, lineHeight: 2 }}>
        <h1 style={{ fontSize: 64, marginTop: "unset", marginBottom: 20 }}>
          {<Skeleton />}
        </h1>
        {makeSkeletonBody(2)}
      </div>
    </SkeletonTheme>
  );

  const transitionDuration = 1000;

  return (
    <section className="projects col-12">
      {!loadingSections && !loadingProjects ? (
        <CSSTransition
          in
          timeout={transitionDuration}
          appear
          classNames="projects"
        >
          <div className="row h-100">
            <header className="projects__header col-12">
              <div className="row h-100">
                <div className="projects__search-bar col-12">
                  <div className="row h-100">
                    <div className="projects__main-wrapper col-5 col-sm-6">
                      <Button
                        categories={["projects-main"]}
                        onClick={handleMainButtonClick}
                        light
                        plus
                      />
                      <SelectInput
                        categories={["projects-main", "default-light"]}
                        title="add project"
                        listProps={addProps}
                        setData={setSelectedAddOption}
                        transitionClassNamesList="select-input__list--projects-main"
                        uniqueIdOnClickOutside="projects-main"
                        ignoreReactOnClickOutside={`header-projects-main-ignore`}
                        ripples={false}
                      />
                    </div>
                    <div className="projects__input-wrapper col-7 col-sm-6">
                      <input
                        className="projects__input projects__input--search"
                        type="text"
                        name="search"
                        onFocus={handleSearchFocus}
                        onBlur={handleSearchBlur}
                        onChange={handleSearchChange}
                        value={search}
                      />
                      <span
                        className="projects__placeholder-icon projects__placeholder"
                        data-placeholder="Search projects"
                      ></span>
                    </div>
                  </div>
                </div>
              </div>
            </header>
            <section className="projects__section col-12">
              <div className="projects__grid">
                <header className="projects__grid-header">
                  <div className="projects__header-col">Project name</div>
                  <div className="projects__header-col d-none d-md-block">
                    Due date
                  </div>
                  <div className="projects__header-col d-none d-sm-block">
                    Priority
                  </div>
                  <div className="projects__header-col d-none d-sm-block">
                    Status
                  </div>
                  <div className="projects__header-col"></div>
                </header>
                {!search ? (
                  <>
                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable
                        droppableId="sectionDroppable"
                        type="droppableItem"
                      >
                        {(provided, snapshot) => (
                          <section
                            className="projects__sections-list"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}
                          >
                            {sectionsList}
                            {provided.placeholder}
                          </section>
                        )}
                      </Droppable>
                    </DragDropContext>
                    <SectionInlineAdd addSection={addSection} />
                  </>
                ) : (
                  <section className="projects__results-list">
                    {createResultsList(
                      projects.filter((project) =>
                        project.name
                          .toLowerCase()
                          .includes(search.toLowerCase())
                      )
                    )}
                  </section>
                )}
              </div>
            </section>
          </div>
        </CSSTransition>
      ) : (
        skeleton
      )}
      <SectionModalAddForm
        onClose={setModalOpen}
        visible={modalOpen["section"]}
        indicator="section"
        addSection={addSection}
      />
      <ProjectModalAddForm
        onClose={setModalOpen}
        visible={modalOpen["project"]}
        priorityProps={priorityProps}
        statusProps={statusProps}
        indicator="project"
        addProject={addProject}
      />
    </section>
  );
};

Projects.propTypes = {
  // Redux
  projects: PropTypes.object,
  sections: PropTypes.object,
  getSections: PropTypes.func.isRequired,
  updateSection: PropTypes.func.isRequired,
  addSection: PropTypes.func.isRequired,
  deleteSection: PropTypes.func.isRequired,
  getProjects: PropTypes.func.isRequired,
  addProject: PropTypes.func.isRequired,
  updateProject: PropTypes.func.isRequired,
  deleteProject: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  projects: state.projects,
  sections: state.sections,
});

export default connect(mapStateToProps, {
  getSections,
  addSection,
  updateSection,
  deleteSection,
  getProjects,
  addProject,
  updateProject,
  deleteProject,
})(Projects);
