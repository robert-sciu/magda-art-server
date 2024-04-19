const express = require("express");
const router = express.Router();
const pageImagesController = require("../controllers/pageImagesController");

router
  .route("/")
  .get(pageImagesController.getAllImages)
  .post(
    pageImagesController.uploadFile,
    pageImagesController.updateSectionImage
  );

module.exports = router;
