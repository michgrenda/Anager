const express = require("express");
const router = express.Router();
const infoColors = require("../../config/chalk/variables");
const auth = require("../../middleware/auth");
const checkObjectId = require("../../middleware/checkObjectId");
const { check, validationResult } = require("express-validator");
const Column = require("../../models/Column");
const Project = require("../../models/Project");

// @route          POST api/columns/:project_id
// @desc           Create project's column
// @access         Private
router.post(
  "/:project_id",
  [
    auth,
    checkObjectId("project_id"),
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

    const { name } = req.body;

    const column = new Column({
      name,
      project: req.params.project_id,
      owner: req.user._id,
    });

    try {
      await column.save();

      res.status(201).send(column);
    } catch (error) {
      console.error(infoColors.error(error.message));
      res.status(500).send("Server error");
    }
  }
);

// @route          GET api/columns/:project_id
// @desc           Get project's columns
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
        return res.status(404).send();
      }

      await project.populate("columns").execPopulate();

      res.send(project.columns);
    } catch (error) {
      console.error(infoColors.error(error.message));
      res.status(500).send("Server error");
    }
  }
);

// @route          GET api/columns/column/:column_id
// @desc           Get column by ID
// @access         Private
router.get(
  "/column/:column_id",
  [auth, checkObjectId("column_id")],
  async (req, res) => {
    try {
      const column = await Column.findOne({
        _id: req.params.column_id,
        owner: req.user._id,
      });
      if (!column) {
        return res.status(404).send("Column was not found");
      }

      res.send(column);
    } catch (error) {
      console.error(infoColors.error(error.message));
      res.status(500).send("Server error");
    }
  }
);

// @route          PATCH api/columns/:column_id
// @desc           Update column by ID
// @access         Private
router.patch(
  "/:column_id",
  [
    auth,
    checkObjectId("column_id"),
    [
      check("name", "Name is required")
        .optional()
        .not()
        .isEmpty()
        .custom((value) => value.trim())
        .withMessage("Title needs to include at least 1 character"),
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
    const allowedUpdates = ["name"];
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
      const column = await Column.findOne({
        _id: req.params.column_id,
        owner: req.user._id,
      });
      if (!column) {
        return res.status(404).send();
      }

      updates.forEach((update) => {
        column[update] = requestBody[update];
      });

      await column.save();

      res.send(column);
    } catch (error) {
      console.error(infoColors.error(error.message));
      res.status(500).send("Server error");
    }
  }
);

// @route          DELETE api/columns/:column_id
// @desc           Delete column by ID
// @access         Private
router.delete(
  "/:column_id",
  [auth, checkObjectId("column_id")],
  async (req, res) => {
    try {
      const column = await Column.findOne({
        _id: req.params.column_id,
        owner: req.user._id,
      });

      if (!column) {
        return res.status(404).send();
      }

      const columnSymbol = Symbol.for("columnCascade");
      column[columnSymbol] = req.body.cascade;

      column.remove();

      res.send(column);
    } catch (error) {
      console.error(infoColors.error(error.message));
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
