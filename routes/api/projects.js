const express = require("express");
const router = express.Router();
const infoColors = require("../../config/chalk/variables");
const auth = require("../../middleware/auth");
const checkObjectId = require("../../middleware/checkObjectId");
const { check, validationResult } = require("express-validator");
const Project = require("../../models/Project");
const ProjectSection = require("../../models/ProjectSection");
const mongoose = require("mongoose");

// @route          POST api/projects
// @desc           Create project
// @access         Private
router.post(
  "/",
  [
    auth,
    [
      check("name", "Name is required")
        .not()
        .isEmpty()
        .custom((value) => value && value.trim())
        .withMessage("Name needs to include at least 1 character"),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { name, description, deadline, offset, priority, status } = req.body;

    const project = new Project({
      name,
      description,
      deadline,
      offset,
      priority,
      status,
      owner: req.user._id,
    });

    try {
      await project.save();

      res.status(201).send(project);
    } catch (error) {
      console.error(infoColors.error(error.message));
      res.status(500).send("Server error");
    }
  }
);

// @route          POST api/projects/:section_id
// @desc           Create project
// @access         Private
router.post(
  "/:section_id",
  [
    auth,
    checkObjectId("section_id"),
    [
      check("name", "Name is required")
        .not()
        .isEmpty()
        .custom((value) => value && value.trim())
        .withMessage("Name needs to include at least 1 character"),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { name, description, deadline, offset, priority, status } = req.body;

    const project = new Project({
      name,
      description,
      deadline,
      offset,
      priority,
      status,
      projectSection: req.params.section_id,
      owner: req.user._id,
    });

    try {
      await project.save();

      res.status(201).send(project);
    } catch (error) {
      console.error(infoColors.error(error.message));
      res.status(500).send("Server error");
    }
  }
);

// @route          GET api/projects
// @desc           Get projects
// @access         Private
router.get("/", auth, async (req, res) => {
  try {
    await req.user.populate("projects").execPopulate();

    res.send(req.user.projects);
  } catch (error) {
    console.error(infoColors.error(error.message));
    res.status(500).send("Server error");
  }
});

// @route          GET api/projects/:project_id
// @desc           Get project by ID
// @access         Private
router.get(
  "/:project_id",
  [auth, checkObjectId("project_id")],
  async (req, res) => {
    try {
      const project = await Project.findOne({
        _id: req.params.project_id,
        owner: req.user._id,
      });
      if (!project) {
        return res.status(404).send("Project was not found");
      }

      res.send(project);
    } catch (error) {
      console.error(infoColors.error(error.message));
      res.status(500).send("Server error");
    }
  }
);

// @route          GET api/projects/:section_id
// @desc           Get section's projects
// @access         Private
router.get(
  "/sections/:section_id",
  [auth, checkObjectId("section_id")],
  async (req, res) => {
    try {
      const section = await ProjectSection.findOne({
        _id: req.params.section_id,
        owner: req.user._id,
      });
      if (!section) {
        return res.status(404).send("Section's projects were not found");
      }

      await section.populate("projects").execPopulate();

      res.send(section.projects);
    } catch (error) {
      console.error(infoColors.error(error.message));
      res.status(500).send("Server error");
    }
  }
);

// @route          PATCH api/projects/:project_id
// @desc           Update project by ID
// @access         Private
router.patch(
  "/:project_id",
  [
    auth,
    checkObjectId("project_id"),
    [
      check("name", "Name is required")
        .optional()
        .not()
        .isEmpty()
        .custom((value) => value.trim())
        .withMessage("Name needs to include at least 1 character"),
      check("section", "Incorrect ID")
        .optional()
        .custom((value) => mongoose.Types.ObjectId.isValid(value))
        .withMessage("ID needs to be valid"),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const requestBody = req.body;
    const updates = Object.keys(requestBody);
    const allowedUpdates = [
      "name",
      "description",
      "deadline",
      "offset",
      "priority",
      "status",
      "projectSection",
      "unset",
    ];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      return res.status(400).json({
        errors: [
          {
            msg: "Invalid updates",
          },
        ],
      });
    }

    try {
      if (!requestBody.unset) {
        const project = await Project.findOne({
          _id: req.params.project_id,
          owner: req.user._id,
        });
        if (!project) {
          return res.status(404).send();
        }

        updates.forEach((update) => {
          project[update] = requestBody[update];
        });

        await project.save();

        res.send(project);
      } else {
        const project = await Project.findOneAndUpdate(
          {
            _id: req.params.project_id,
            owner: req.user._id,
          },
          { $unset: { projectSection: "" } },
          {
            new: true,
          }
        );
        if (!project) {
          return res.status(404).send();
        }

        res.send(project);
      }
    } catch (error) {
      console.error(infoColors.error(error.message));
      res.status(500).send("Server error");
    }
  }
);

// @route          DELETE api/projects/:project_id
// @desc           Delete project by ID
// @access         Private
router.delete(
  "/:project_id",
  [auth, checkObjectId("project_id")],
  async (req, res) => {
    try {
      const project = await Project.findOneAndDelete({
        _id: req.params.project_id,
        owner: req.user._id,
      });
      if (!project) {
        return res.status(404).send();
      }

      res.send(project);
    } catch (error) {
      console.error(infoColors.error(error.message));
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
