var express = require("express");
const paintingsController = require("../controllers/paintings");
const { attachFileToRequest } = require("../middleware/multerFileUpload");
const { attachIdParam } = require("../utilities/controllerUtilities");

const paintingsRouterOpen = () => {
  const router = express.Router();
  router.route("/").get(paintingsController.getPaintings);
  return router;
};

const paintingsRouterAdmin = () => {
  const router = express.Router();
  router.route("/").post(attachFileToRequest, paintingsController.postPainting);
  router
    .route("/:id")
    .delete(attachIdParam, paintingsController.deletePainting);
  return router;
};

module.exports = { paintingsRouterOpen, paintingsRouterAdmin };
