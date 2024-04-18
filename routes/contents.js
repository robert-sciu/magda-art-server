const express = require("express");
const router = express.Router();
const contentsController = require("../controllers/contentsController");

router.route("/").get(contentsController.getAllContent);

router.route("/:heading").post(contentsController.updateContent);

module.exports = router;
