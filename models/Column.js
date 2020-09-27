const mongoose = require("mongoose");
const Task = require("./Task");

const columnSchema = new mongoose.Schema({
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

// Specify Columns/Tasks relationship
columnSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "column",
});

// Cascade delete tasks
columnSchema.pre("remove", async function (next) {
  const column = this;
  const columnSymbol = Symbol.for("columnCascade");

  if (column[columnSymbol]) {
    await Task.deleteMany({
      column: column._id,
    });
  } else {
    await Task.updateMany(
      {
        column: column._id,
      },
      { $unset: { column: "" } }
    );
  }
  next();
});

module.exports = Column = mongoose.model("Column", columnSchema);
