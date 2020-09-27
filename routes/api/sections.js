const express = require("express");
const router = express.Router();
const infoColors = require("../../config/chalk/variables");
const auth = require("../../middleware/auth");
const checkObjectId = require("../../middleware/checkObjectId");
const { check, validationResult } = require("express-validator");
const Section = require("../../models/Section");

// @route          POST api/sections
// @desc           Create section
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

    const { name } = req.body;

    const section = new Section({
      name,
      owner: req.user._id,
    });

    try {
      await section.save();

      res.status(201).send(section);
    } catch (error) {
      console.error(infoColors.error(error.message));
      res.status(500).send("Server error");
    }
  }
);

// @route          GET api/sections
// @desc           Get sections
// @access         Private
router.get("/", auth, async (req, res) => {
  try {
    await req.user.populate("sections").execPopulate();

    res.send(req.user.sections);
  } catch (error) {
    console.error(infoColors.error(error.message));
    res.status(500).send("Server error");
  }
});

// @route          GET api/sections/:section_id
// @desc           Get section by ID
// @access         Private
router.get(
  "/:section_id",
  [auth, checkObjectId("section_id")],
  async (req, res) => {
    try {
      const section = await Section.findOne({
        _id: req.params.section_id,
        owner: req.user._id,
      });
      if (!section) {
        return res.status(404).send("Section was not found");
      }

      res.send(section);
    } catch (error) {
      console.error(infoColors.error(error.message));
      res.status(500).send("Server error");
    }
  }
);

// @route          PATCH api/sections/:section_id
// @desc           Update section by ID
// @access         Private
router.patch(
  "/:section_id",
  [
    auth,
    checkObjectId("section_id"),
    [
      check("name", "Name is required")
        .optional()
        .not()
        .isEmpty()
        .custom((value) => value.trim())
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
      const section = await Section.findOne({
        _id: req.params.section_id,
        owner: req.user._id,
      });
      if (!section) {
        return res.status(404).send();
      }

      updates.forEach((update) => {
        section[update] = requestBody[update];
      });

      await section.save();

      res.send(section);
    } catch (error) {
      console.error(infoColors.error(error.message));
      res.status(500).send("Server error");
    }
  }
);

// @route          DELETE api/sections/:section_id
// @desc           Delete section by ID
// @access         Private
router.delete(
  "/:section_id",
  [auth, checkObjectId("section_id")],
  async (req, res) => {
    try {
      const section = await Section.findOne({
        _id: req.params.section_id,
        owner: req.user._id,
      });
      if (!section) {
        return res.status(404).send();
      }

      const sectionSymbol = Symbol.for("sectionCascade");
      section[sectionSymbol] = req.body.cascade;

      section.remove();

      res.send(section);
    } catch (error) {
      console.error(infoColors.error(error.message));
      res.status(500).send("Server error");
    }
  }
);
module.exports = router;
