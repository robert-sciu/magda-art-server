const { body, query, param } = require("express-validator");

const validatePostPainting = [
  body("JSON")
    .custom((value) => {
      try {
        JSON.parse(value);
        return true;
      } catch (error) {
        throw new Error("Invalid JSON");
      }
    })
    .withMessage("Invalid JSON"),
  body("JSON").custom((value) => {
    const json = JSON.parse(value);
    if (!json.title || typeof json.title !== "string" || json.title === "") {
      throw new Error("Title is required");
    }
    if (
      !json.description ||
      typeof json.description !== "string" ||
      json.description === ""
    ) {
      throw new Error("Description is required");
    }
    if (!json.width_cm || isNaN(json.width_cm)) {
      throw new Error("Width in cm is required");
    }
    if (!json.height_cm || isNaN(json.height_cm)) {
      throw new Error("Height in cm is required");
    }
    return true;
  }),
];

const validateDeletePainting = [param("id").exists().isNumeric()];

module.exports = {
  validatePostPainting,
  validateDeletePainting,
};
