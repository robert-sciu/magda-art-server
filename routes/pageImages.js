const express = require("express");
const pageImagesController = require("../controllers/pageImages");
const { attachFileToRequest } = require("../middleware/multerFileUpload");
const { attachIdParam } = require("../utilities/controllerUtilities");

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
    .post(attachFileToRequest, pageImagesController.postPageImage);
  router
    .route("/:id")
    .delete(attachIdParam, pageImagesController.deletePageImage);
  return router;
};

module.exports = { pageImageRouterOpen, pageImageRouterAdmin };
