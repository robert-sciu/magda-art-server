const express = require("express");
const userController = require("../controllers/usersController");

const userRouterOpen = () => {
  const router = express.Router();

  router.route("/").post(userController.createUser);

  return router;
};

// router
//   .route("/")
//   .post(userController.createUser[process.env.USER_CREATION_MODE]);

// module.exports = router;

module.exports = { userRouterOpen };
