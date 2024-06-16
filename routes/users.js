const express = require("express");
const router = express.Router();
const userController = require("../controllers/usersController");

router.route("/").get(userController.getUser).post(userController.createUser);

module.exports = router;
