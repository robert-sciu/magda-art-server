const express = require("express");
const router = express.Router();
const contentsController = require("../controllers/contentsController");

router
  .route("/")
  .get(contentsController.getAllContent)
  .post(contentsController.updateContent);

module.exports = router;
