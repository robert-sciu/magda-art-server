const express = require("express");
const router = express.Router();
const pageImagesController = require("../controllers/pageImagesController");
const { authenticateJWT } = require("../config/jwt");
const { nonce } = require("../config/nonce");

router
  .route("/")
  .get(nonce, pageImagesController.getAllImages)
  .post(
    authenticateJWT,
    pageImagesController.uploadFile,
    pageImagesController.updateSectionImage
  )
  .delete(authenticateJWT, pageImagesController.deleteSectionImage);

router.route("/common").get(pageImagesController.getCommon);

module.exports = router;
