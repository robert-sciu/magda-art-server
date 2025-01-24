const { body, query, param } = require("express-validator");
const { checkForExtraFields } = require("../utilities/validatorUtilities");

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
      !json.description_en ||
      typeof json.description_en !== "string" ||
      json.description_en === ""
    ) {
      throw new Error("Description is required");
    }
    if (!json.width_cm || isNaN(json.width_cm)) {
      throw new Error("Width in cm is required");
    }
    if (!json.height_cm || isNaN(json.height_cm)) {
      throw new Error("Height in cm is required");
    }
    if (json.price_eur && isNaN(json.price_eur)) {
      throw new Error("Price must be a number");
    }
    if (typeof json.is_available !== "boolean") {
      throw new Error("Is sold must be a boolean");
    }
    return true;
  }),
];

const allowedFieldsForUpdate = [
  "title",
  "description_en",
  "description_de",
  "description_es",
  "description_pl",
  "price_eur",
  "is_available",
  "width_cm",
  "height_cm",
];

const validateUpdatePainting = [
  checkForExtraFields(allowedFieldsForUpdate),
  body("title").optional().isString(),
  body("description_en").optional().isString(),
  body("description_de").optional().isString(),
  body("description_es").optional().isString(),
  body("description_pl").optional().isString(),
  body("price_eur").optional().isNumeric(),
  body("is_available").optional().isBoolean(),
  body("width_cm").optional().isNumeric(),
  body("height_cm").optional().isNumeric(),
];

const validateDeletePainting = [param("id").exists().isNumeric()];

module.exports = {
  validatePostPainting,
  validateUpdatePainting,
  validateDeletePainting,
};
