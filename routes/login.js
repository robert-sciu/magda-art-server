const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");
const { authenticateJWT } = require("../config/jwt");

router.route("/").post(loginController.login);

router.route("/verifyToken").post(authenticateJWT, loginController.verifyToken);

module.exports = router;
