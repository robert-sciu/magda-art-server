const express = require("express");
const router = express.Router();
const pageImagesController = require("../controllers/pageImagesController");

router
  .route("/")
  .get(pageImagesController.getAllImages)
  .post(
    pageImagesController.uploadFile,
    pageImagesController.updateSectionImage
  )
  .delete(pageImagesController.deleteSectionImage);

router.route("/common").get(pageImagesController.getCommon);
// .post(pageImagesController.uploadFile, pageImagesController.updateLogo);

module.exports = router;
