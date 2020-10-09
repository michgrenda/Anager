const mongoose = require("mongoose");
const Task = require("./Task");

const taskSectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Project",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

// Specify TaskSections/Tasks relationship
taskSectionSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "taskSection",
});

// Cascade delete tasks
taskSectionSchema.pre("remove", async function (next) {
  const section = this;
  const taskSectionSymbol = Symbol.for("taskSectionCascade");

  if (section[taskSectionSymbol]) {
    await Task.deleteMany({
      taskSection: section._id,
    });
  } else {
    await Task.updateMany(
      {
        taskSection: section._id,
      },
      { $unset: { taskSection: "" } }
    );
  }
  next();
});

module.exports = TaskSection = mongoose.model("TaskSection", taskSectionSchema);
