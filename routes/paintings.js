var express = require("express");
const paintingsController = require("../controllers/paintings");
const { attachFileToRequest } = require("../middleware/multerFileUpload");
// router
//   .route("/")
//   .get(paintingsController.getAllPaintings)
//   .post(
//     authenticateJWT,
//     paintingsController.uploadFile,
//     paintingsController.postPainting
//   )
//   .delete(authenticateJWT, paintingsController.deletePaintingById);

// router.route("/fullRes").get(paintingsController.getFullResPainting);

const paintingsRouterAdmin = () => {
  const router = express.Router();

  router.route("/").post(attachFileToRequest, paintingsController.postPainting);

  return router;
};

module.exports = { paintingsRouterAdmin };
