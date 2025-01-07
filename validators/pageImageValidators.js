const { body, query, param } = require("express-validator");

const validatePostPageImage = [
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
    if (
      !json.imageName ||
      typeof json.imageName !== "string" ||
      json.imageName === ""
    ) {
      throw new Error("Title is required");
    }
    if (!json.role || typeof json.role !== "string" || json.role === "") {
      throw new Error("Role is required");
    }
    if (json.placement && isNaN(json.placement)) {
      throw new Error("Placement must be a number");
    }
    return true;
  }),
];

const validateDeletePageImage = [param("id").exists().isNumeric()];

module.exports = {
  validatePostPageImage,
  validateDeletePageImage,
};
