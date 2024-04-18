const express = require("express");
const router = express.Router();
const pageImagesController = require("../controllers/pageImagesController");

router.param("section", pageImagesController.setSectionName);

router.route("/").get(pageImagesController.getAllImages);

router
  .route("/:section")
  .post(
    pageImagesController.uploadFile,
    pageImagesController.updateSectionImage
  );

module.exports = router;
