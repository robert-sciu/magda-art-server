var express = require("express");
const paintingsController = require("../controllers/paintings");
const { attachFileToRequest } = require("../middleware/multerFileUpload");
const { attachIdParam } = require("../utilities/controllerUtilities");
const {
  validatePostPainting,
  validateDeletePainting,
  validateUpdatePainting,
} = require("../validators/paintingValidators");
const { validate } = require("../middleware/validator");

const paintingsRouterOpen = () => {
  const router = express.Router();
  router.route("/").get(paintingsController.getPaintings);
  return router;
};

const paintingsRouterAdmin = () => {
  const router = express.Router();
  router
    .route("/")
    .post(
      attachFileToRequest,
      validatePostPainting,
      validate,
      paintingsController.postPainting
    );

  router
    .route("/:id")
    .patch(
      attachIdParam,
      validateUpdatePainting,
      validate,
      paintingsController.updatePainting
    )
    .delete(
      attachIdParam,
      validateDeletePainting,
      validate,
      paintingsController.deletePainting
    );
  return router;
};

module.exports = { paintingsRouterOpen, paintingsRouterAdmin };
