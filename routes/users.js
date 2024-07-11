const express = require("express");
const router = express.Router();
const userController = require("../controllers/usersController");

router
  .route("/")
  .post(userController.createUser[process.env.USER_CREATION_MODE]);

module.exports = router;
