var express = require("express");
var router = express.Router();
const paintingsController = require("../controllers/paintingsController");
const { authenticateJWT } = require("../config/jwt");

router.param("id", paintingsController.checkPaitningId);

/* GET users listing. */
router
  .route("/")
  .get(paintingsController.getAllPaintings)
  .post(paintingsController.uploadFile, paintingsController.postPainting);

router
  .route("/fullRes")
  .get(paintingsController.getFullResPainting)
  .post(
    paintingsController.uploadFile,
    paintingsController.postFullResPainting
  );

router.route("/:id").delete(paintingsController.deletePaintingById);

module.exports = router;
