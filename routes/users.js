const express = require("express");
const userController = require("../controllers/usersController");

const userRouterOpen = () => {
  const router = express.Router();

  router.route("/").post(userController.createUser);

  return router;
};

module.exports = { userRouterOpen };
