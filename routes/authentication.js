const loginController = require("../controllers/authentication");
const express = require("express");

// router.route("/").post(loginController.login);

// router.route("/verifyToken").post(authenticateJWT, loginController.verifyToken);

// module.exports = router;

const authRouterOpen = () => {
  const router = express.Router();

  router.route("/login").post(loginController.login);

  router.route("/refreshToken").post(loginController.refreshToken);

  router.route("/logout").post(loginController.logout);

  return router;
};

const authRouterAdmin = () => {
  const router = express.Router();

  router.route("/verifyToken").post(loginController.verifyToken);

  return router;
};

module.exports = { authRouterOpen, authRouterAdmin };
