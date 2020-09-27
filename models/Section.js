const mongoose = require("mongoose");
const Project = require("./Project");

const sectionSchema = new mongoose.Schema({
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

// Specify Sections/Projects relationship
sectionSchema.virtual("projects", {
  ref: "Project",
  localField: "_id",
  foreignField: "section",
});

// Cascade delete projects
sectionSchema.pre("remove", async function (next) {
  const section = this;
  const sectionSymbol = Symbol.for("sectionCascade");

  if (section[sectionSymbol]) {
    await section.populate("projects").execPopulate();
    section.projects.forEach((project) => project.remove());
  } else {
    await Project.updateMany(
      {
        section: section._id,
      },
      { $unset: { section: "" } }
    );
  }
  next();
});

module.exports = Section = mongoose.model("Section", sectionSchema);
