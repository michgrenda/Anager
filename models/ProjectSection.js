const mongoose = require("mongoose");
const Project = require("./Project");

const projectSectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

// Specify ProjectSections/Projects relationship
projectSectionSchema.virtual("projects", {
  ref: "Project",
  localField: "_id",
  foreignField: "projectSection",
});

// Cascade delete projects
projectSectionSchema.pre("remove", async function (next) {
  const section = this;
  const projectSectionSymbol = Symbol.for("projectSectionCascade");

  if (section[projectSectionSymbol]) {
    await section.populate("projects").execPopulate();
    section.projects.forEach((project) => project.remove());
  } else {
    await Project.updateMany(
      {
        projectSection: section._id,
      },
      { $unset: { projectSection: "" } }
    );
  }
  next();
});

module.exports = ProjectSection = mongoose.model("ProjectSection", projectSectionSchema);
