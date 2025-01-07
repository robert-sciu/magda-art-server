const express = require("express");
const pageImagesController = require("../controllers/pageImages");
const { attachFileToRequest } = require("../middleware/multerFileUpload");
const { attachIdParam } = require("../utilities/controllerUtilities");
const {
  validatePostPageImage,
  validateDeletePageImage,
} = require("../validators/pageImageValidators");
const { validate } = require("../middleware/validator");

const pageImageRouterOpen = () => {
  const router = express.Router();
  router.route("/").get(pageImagesController.getPageImages);
  router.route("/common").get(pageImagesController.getCommonPageImages);
  return router;
};

const pageImageRouterAdmin = () => {
  const router = express.Router();
  router
    .route("/")
    .post(
      attachFileToRequest,
      validatePostPageImage,
      validate,
      pageImagesController.postPageImage
    );
  router
    .route("/:id")
    .delete(
      attachIdParam,
      validateDeletePageImage,
      validate,
      pageImagesController.deletePageImage
    );
  return router;
};

module.exports = { pageImageRouterOpen, pageImageRouterAdmin };
