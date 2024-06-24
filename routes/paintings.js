var express = require("express");
var router = express.Router();
const paintingsController = require("../controllers/paintingsController");
const { authenticateJWT } = require("../config/jwt");

router
  .route("/")
  .get(paintingsController.getAllPaintings)
  .post(
    authenticateJWT,
    paintingsController.uploadFile,
    paintingsController.postPainting
  )
  .delete(authenticateJWT, paintingsController.deletePaintingById);

router.route("/fullRes").get(paintingsController.getFullResPainting);

module.exports = router;
