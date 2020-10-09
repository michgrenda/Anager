const mongoose = require("mongoose");
const TaskSection = require("./TaskSection");
const Task = require("./Task");

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  deadline: {
    type: Date,
  },
  offset: {
    type: Number,
    default: 0,
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "low",
  },
  status: {
    type: String,
    enum: [
      "archived",
      "proposed",
      "on hold",
      "completed",
      "active",
      "canceled",
    ],
    default: "active",
  },
  projectSection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProjectSection",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

// Specify Project/TaskSections relationship
projectSchema.virtual("taskSections", {
  ref: "TaskSection",
  localField: "_id",
  foreignField: "project",
});

// Specify Project/Tasks relationship
projectSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "project",
});

// Cascade delete taskSections & tasks
projectSchema.pre("findOneAndDelete", async function (next) {
  const project = this;

  await Task.deleteMany({
    project: project._id,
  });
  await TaskSection.deleteMany({
    project: project._id,
  });
  next();
});

// Cascade delete taskSections & tasks (chain)
projectSchema.pre("remove", async function (next) {
  const project = this;

  await Task.deleteMany({
    project: project._id,
  });
  await TaskSection.deleteMany({
    project: project._id,
  });
  next();
});

module.exports = Project = mongoose.model("Project", projectSchema);
