const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");
const { authenticateJWT } = require("../config/jwt");

router.route("/").post(loginController.login);

router.route("/token").post(loginController.refreshToken);

router.route("/logout").post(authenticateJWT, loginController.logout);

module.exports = router;
