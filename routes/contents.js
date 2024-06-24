const express = require("express");
const router = express.Router();
const contentsController = require("../controllers/contentsController");
const { authenticateJWT } = require("../config/jwt");

router
  .route("/")
  .get(contentsController.getAllContent)
  .post(authenticateJWT, contentsController.updateContent);

module.exports = router;
