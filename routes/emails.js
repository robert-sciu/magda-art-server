const express = require("express");
const router = express.Router();
const emailsController = require("../controllers/emailsController");

router.route("/").post(emailsController.sendEmail);

module.exports = router;
