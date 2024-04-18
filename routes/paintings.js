var express = require("express");
var router = express.Router();
const paintingsController = require("../controllers/paintingsController");

router.param("id", paintingsController.checkPaitningId);

/* GET users listing. */
router
  .route("/")
  .get(paintingsController.getAllPaintings)
  .post(paintingsController.uploadFile, paintingsController.postPainting);

router.route("/:id").delete(paintingsController.deletePaintingById);

module.exports = router;
