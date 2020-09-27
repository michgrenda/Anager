const express = require("express");
const router = express.Router();
const infoColors = require("../../config/chalk/variables");
const auth = require("../../middleware/auth");
const checkObjectId = require("../../middleware/checkObjectId");
const { check, validationResult } = require("express-validator");
const Task = require("../../models/Task");
const Column = require("../../models/Column");
const Project = require("../../models/Project");
const mongoose = require("mongoose");

// @route          POST api/tasks/:project_id/:column_id
// @desc           Create column's task
// @access         Private
router.post(
  "/:project_id/:column_id",
  [
    auth,
    checkObjectId("project_id"),
    checkObjectId("column_id"),
    [
      check("title", "Title is required")
        .not()
        .isEmpty()
        .custom((value) => value && value.trim())
        .withMessage("Title needs to include at least 1 character"),
      check("description", "Description is required")
        .not()
        .isEmpty()
        .custom((value) => value && value.trim())
        .withMessage("Description needs to include at least 1 character"),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { title, description, completed, deadline, priority } = req.body;

    const task = new Task({
      title,
      description,
      completed,
      deadline,
      priority,
      column: req.params.column_id,
      project: req.params.project_id,
      owner: req.user._id,
    });

    try {
      await task.save();

      res.status(201).send(task);
    } catch (error) {
      console.error(infoColors.error(error.message));
      res.status(500).send("Server error");
    }
  }
);

// @route          POST api/tasks/:project_id
// @desc           Create project's task
// @access         Private
router.post(
  "/:project_id",
  [
    auth,
    checkObjectId("project_id"),
    [
      check("title", "Title is required")
        .not()
        .isEmpty()
        .custom((value) => value && value.trim())
        .withMessage("Title needs to include at least 1 character"),
      check("description", "Description is required")
        .not()
        .isEmpty()
        .custom((value) => value && value.trim())
        .withMessage("Description needs to include at least 1 character"),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { title, description, completed, deadline, priority } = req.body;

    const task = new Task({
      title,
      description,
      completed,
      deadline,
      priority,
      project: req.params.project_id,
      owner: req.user._id,
    });

    try {
      await task.save();

      res.status(201).send(task);
    } catch (error) {
      console.error(infoColors.error(error.message));
      res.status(500).send("Server error");
    }
  }
);

// @route          GET api/tasks/column/:column_id
// @desc           Get column's tasks
// @access         Private
router.get(
  "/columns/:column_id",
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

      await column.populate("tasks").execPopulate();

      res.send(column.tasks);
    } catch (error) {
      console.error(infoColors.error(error.message));
      res.status(500).send("Server error");
    }
  }
);

// @route          GET api/tasks/projects/:project_id
// @desc           Get project's tasks
// @access         Private
router.get(
  "/projects/:project_id",
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

      await project.populate("tasks").execPopulate();

      res.send(project.tasks);
    } catch (error) {
      console.error(infoColors.error(error.message));
      res.status(500).send("Server error");
    }
  }
);

// @route          GET api/tasks/:task_id
// @desc           Get task by ID
// @access         Private
router.get("/:task_id", [auth, checkObjectId("task_id")], async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.task_id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send("Task was not found");
    }

    res.send(task);
  } catch (error) {
    console.error(infoColors.error(error.message));
    res.status(500).send("Server error");
  }
});

// @route          PATCH api/tasks/:task_id
// @desc           Update task by ID
// @access         Private
router.patch(
  "/:task_id",
  [
    auth,
    checkObjectId("task_id"),
    [
      check("subtasks", "Invalid updates").not().exists(),
      check("title", "Title is required")
        .optional()
        .not()
        .isEmpty()
        .custom((value) => value && value.trim())
        .withMessage("Title needs to include at least 1 character"),
      check("description", "Description is required")
        .optional()
        .not()
        .isEmpty()
        .custom((value) => value && value.trim())
        .withMessage("Description needs to include at least 1 character"),
      check("column", "Incorrect ID")
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
      "title",
      "description",
      "completed",
      "deadline",
      "priority",
      "column",
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
      const task = await Task.findOne({
        _id: req.params.task_id,
        owner: req.user._id,
      });
      if (!task) {
        return res.status(404).send();
      }

      updates.forEach((update) => {
        task[update] = requestBody[update];
      });

      await task.save();

      res.send(task);
    } catch (error) {
      console.error(infoColors.error(error.message));
      res.status(500).send("Server error");
    }
  }
);

// @route          DELETE api/tasks/:task_id
// @desc           Delete task by ID
// @access         Private
router.delete(
  "/:task_id",
  [auth, checkObjectId("task_id")],
  async (req, res) => {
    try {
      const task = await Task.findOneAndDelete({
        _id: req.params.task_id,
        owner: req.user._id,
      });
      if (!task) {
        return res.status(404).send();
      }

      res.send(task);
    } catch (error) {
      console.error(infoColors.error(error.message));
      res.status(500).send("Server error");
    }
  }
);

// @route          PUT api/tasks/subtasks/:task_id
// @desc           Add task's subtask
// @access         Private
router.put(
  "/subtasks/:task_id",
  [
    auth,
    checkObjectId("task_id"),
    [
      check("description", "Description is required")
        .not()
        .isEmpty()
        .custom((value) => value && value.trim())
        .withMessage("Description needs to include at least 1 character"),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { description, completed } = req.body;

    try {
      const task = await Task.findOne({
        _id: req.params.task_id,
        owner: req.user._id,
      });
      if (!task) {
        return res.status(404).send();
      }

      const newSubtask = {
        description,
        completed,
      };

      task.subtasks.unshift(newSubtask);

      await task.save();

      res.send(task);
    } catch (error) {
      console.error(infoColors.error(error.message));
      res.status(500).send("Server error");
    }
  }
);

// @route          PATCH api/tasks/subtasks/:subtask_id
// @desc           Update task's subtask
// @access         Private
router.patch(
  "/subtasks/:subtask_id",
  [
    auth,
    checkObjectId("subtask_id"),
    [
      check("description", "Description is required")
        .optional()
        .not()
        .isEmpty()
        .custom((value) => value && value.trim())
        .withMessage("Description needs to include at least 1 character"),
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
    const allowedUpdates = ["description", "completed"];
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

    const { description, completed } = requestBody;

    try {
      const task = await Task.findOneAndUpdate(
        {
          "subtasks._id": req.params.subtask_id,
          owner: req.user._id,
        },
        {
          $set: {
            "subtasks.$.description": description,
            "subtasks.$.completed": completed,
          },
        },
        {
          omitUndefined: true,
          new: true,
        }
      );
      if (!task) {
        return res.status(404).send();
      }

      res.send(task);
    } catch (error) {
      console.error(infoColors.error(error.message));
      res.status(500).send("Server error");
    }
  }
);

// @route          DELETE api/tasks/subtasks/:subtask_id
// @desc           Delete task's subtask
// @access         Private
router.delete(
  "/subtasks/:subtask_id",
  [auth, checkObjectId("subtask_id")],
  async (req, res) => {
    const { subtask_id } = req.params;
    try {
      const task = await Task.findOneAndUpdate(
        {
          "subtasks._id": subtask_id,
          owner: req.user._id,
        },
        {
          $pull: {
            subtasks: {
              _id: subtask_id,
            },
          },
        },
        {
          new: true,
        }
      );
      if (!task) {
        return res.status(404).send();
      }

      res.send(task);
    } catch (error) {
      console.error(infoColors.error(error.message));
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
