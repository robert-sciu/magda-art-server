const express = require("express");
// const router = express.Router();
const contentsController = require("../controllers/content");
// const { authenticateJWT } = require("../config/jwt");

// router
//   .route("/")
//   .get(contentsController.getAllContent)
//   .post(authenticateJWT, contentsController.updateContent);

const contentRouterOpen = () => {
  const router = express.Router();
  router.route("/").get(contentsController.getContent);
  return router;
};

const contentRouterAdmin = () => {
  const router = express.Router();
  router.route("/").post(contentsController.postContent);
  return router;
};

module.exports = {
  contentRouterOpen,
  contentRouterAdmin,
};
